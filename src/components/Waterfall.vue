<template>
  <div
    ref="waterfall-wrapper"
    class="waterfall-wrapper"
    :style="{ 'column-gap': gap[1] }"
  >
    <div
      class="col-wrapper"
      ref="cols"
      v-for="(col, i) in colData"
      :key="i"
      :style="{ 'row-gap': gap[0] }"
    >
      <div
        class="row-wrapper"
        :class="[ animation ]"
        v-for="(row, j) in col" :key="j"
      >
        <slot :item="row" />
      </div>
    </div>
  </div>
</template>

<script>
import { checkIntersectionObserver } from '@/utils/checkIntersectionObserver'

let observerObj
// 最小列索引
let minCol = 0
// 瀑布流数据队列
let innerData = []
// 已经渲染的数量
let count = 0

export default {
  name: 'Waterfall',
  props: {
    // 瀑布流数据
    data: {
      type: Array,
      default: () => []
    },
    // 列数
    col: {
      type: Number,
      default: 2
    },
    // 行、列间距
    gap: {
      type: Array,
      default: () => ['0px', '0px']
    },
    // 首屏开启并行渲染，减少白屏时间
    firstPageCount: {
      type: Number,
      default: 6,
    },
    animation: {
      type: String,
      default: 'hapi' // hapi|osiris
    },
    // 扩展 intersectionRect 交叉区域，可以提前加载部分数据，优化用户浏览体验
    rootMargin: {
      type: String,
      default: '0px 0px 800px 0px'
    }
  },
  data() {
    return {
      colData: [],
    }
  },
  watch: {
    data: {
      handler: function(v) {
        innerData = [...innerData, ...v]
        this.waterfall()
      }
    },
    col: {
      handler: function(v) {
        // 初始化各列数据
        for (let i = 0; i < v; i++) {
          this.colData[i] = []
        }
      },
      immediate: true
    },
  },
  created() {
    // 不支持IntersectionObserver的场景下，动态引入polyfill
    const ioPromise = checkIntersectionObserver()
      ? Promise.resolve()
      : import('intersection-observer')

    ioPromise.then(() => {
      // 瀑布流布局：取出数据源中最靠前的一个并添加到瀑布流高度最小的那一列，等图片完全加载后重复该循环
      observerObj = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const { target, isIntersecting } = entry
            if (isIntersecting) {
              const done = () => {
                if (innerData.length) {
                  this.waterfall()
                } else {
                  this.$emit('rendered')
                }
                // 停止观察，防止回拉时二次触发监听逻辑
                observerObj.unobserve(target)
              }

              if (target.complete) {
                done()
              } else {
                target.onload = target.onerror = done
              }
            }
          }
        },
        {
          rootMargin: this.rootMargin
        }
      )
    })
  },
  methods: {
    // 更新瀑布流高度最小列
    updateMinCol() {
      // 并行渲染时，无法获取最小列，只能按列依次渲染
      if (count < this.firstPageCount) {
        minCol = count % (this.col)
        return
      }
      // 获取高度最小的列
      const heightList = this.$refs['cols'].map((item) => item.offsetHeight)
      const minHeight = Math.min(...heightList)
      minCol = heightList.indexOf(minHeight)
    },

    // 取出数据源中最靠前的一个并添加到瀑布流高度最小的那一列
    appendColData() {
      const colItem = innerData.shift()
      this.colData[minCol].push(colItem)
    },

    // 开始监测新增加的瀑布流元素
    startObserver() {
      const nodes = this.$refs['cols'][minCol].querySelectorAll('.waterfall-img')
      const lastNode = nodes[nodes.length - 1]
      observerObj.observe(lastNode)
    },

    waterfall() {
      this.updateMinCol()
      this.appendColData()
      if (++count < this.firstPageCount) {
        // 首屏采用并行渲染
        this.waterfall()
      } else {
        // 非首屏采用串行渲染
        this.$nextTick(() => {
          this.startObserver()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.waterfall-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.col-wrapper {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.waterfall-wrapper {
  .hapi {
    .waterfall-card {
      animation: 0.4s hapi-animation linear;
      animation-fill-mode: forwards;
    }

    @keyframes hapi-animation {
      from {
        opacity: 0;
        transform-origin: 50% 50%;
        transform: scale(0);
      }

      to {
        opacity: 1;
        transform-origin: 50% 50%;
        transform: scale(1);
      }
    }
  }

  .osiris {
    .waterfall-card {
      animation: 0.4s osiris-animation linear;
      animation-fill-mode: forwards;
    }

    @keyframes osiris-animation {
      from {
        opacity: 0;
        transform-origin: 50% 50%;
        transform: translateZ(-3000px) rotateY(-1turn);
      }

      to {
        opacity: 1;
        transform-origin: 50% 50%;
        transform: translateZ(0) rotateY(0turn);
      }
    }
  }
}
</style>

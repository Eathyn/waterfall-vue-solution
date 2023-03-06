<template>
  <div class="waterfall-card">
    <img
      class="waterfall-img"
      :src="item.url"
      :id="item.tag"
    />
    <p style="text-align: center; margin: 0">{{ item.tag }}</p>
  </div>
</template>

<script>
export default {
  name: 'WaterfallCard',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.waterfall-card {
  border: 1px solid #000;
  background: #fff;
}

.waterfall-img {
  width: 100%;
  object-fit: cover;
}
</style>

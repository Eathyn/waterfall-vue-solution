<template>
  <div class="waterfall-card">
    <img
      class="waterfall-img"
      :src="item.url"
      :id="item.tag"
    />
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
  background: #fff;
}

.waterfall-img {
  width: 175px;
  object-fit: cover;
}
</style>

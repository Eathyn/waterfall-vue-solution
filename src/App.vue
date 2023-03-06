<template>
  <Waterfall
    v-slot="{ item }"
    :data="itemData"
    :gap="['10px', '10px']"
    @rendered="initItemData"
  >
    <WaterfallCard :item="item" />
  </Waterfall>
</template>

<script>
import Waterfall from '@/components/Waterfall'
import WaterfallCard from '@/components/WaterfallCard'

export default {
  name: 'App',
  data() {
    return {
      itemData: [],
      page: 0,
      count: 10,
    }
  },
  components: {
    Waterfall,
    WaterfallCard,
  },
  async created() {
    await this.initItemData()
  },
  methods: {
    async initItemData() {
      const images = await this.getImages()
      const data = []
      for (let i = 0; i < images.length; i++) {
        const { url, tag } = images[i]
        data.push({
          url,
          tag,
        })
      }
      this.itemData = data
    },

    async getImages() {
      const response = await fetch('http://localhost:3000/images', {
        method: 'POST',
        body: JSON.stringify({
          page: ++this.page,
          count: this.count,
        }),
      })
      const { data } = await response.json()
      return data
    },
  },
}
</script>

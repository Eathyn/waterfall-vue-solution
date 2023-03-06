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
      const serverLocalAddress = 'http://localhost:3000/images'
      // const serverIpAddress = 'http://192.168.31.155:8082/images'
      const response = await fetch(serverLocalAddress, {
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

<style>
body {
  margin: 8px;
}
</style>

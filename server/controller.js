module.exports = class {
  handleRoot(req, res) {
    res.end(
      JSON.stringify({
        code: 200,
        message: '/ success',
      })
    )
  }

  getImages(req, res) {
    const urls = generateImageUrls()
    const data = []

    req.on('data', (chunk) => {
      const { page, count } = JSON.parse(chunk)
      const start = (page - 1) * count
      const end = Math.min(page * count, urls.length)
      for (let i = start; i < end; i++) {
        data.push({
          tag: i + 1,
          url: urls[i],
        })
      }

      res.end(
        JSON.stringify({
          code: 200,
          message: '/ images',
          data,
        })
      )
    })

    function generateImageUrls() {
      const urls = []
      for (let i = 1; i <= 300; i++) {
        urls.push(`https://cdn.catboys.com/images/image_${i}.jpg`)
      }
      return urls
    }
  }
}

const http = require('http')
const Controller = require('./controller')

// const PORT = 8082
const PORT = 3000

const server = http.createServer()
const controller = new Controller()

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.status = 200
    res.end()
    return
  }

  if (req.url === '/') {
    await controller.handleRoot(req, res)
    return
  }

  if (req.url === '/images') {
    await controller.getImages(req, res)
    return
  }
})

// server.listen(PORT, '192.168.31.155', () => {
//   console.log(`listening port ${PORT}`)
// })

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`)
})

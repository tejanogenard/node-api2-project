const express = require("express")
const server = express()
const port = 8000

const postRouter = require('./posts/router')

server.use(express.json())
server.use('/api/posts', postRouter)

server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})
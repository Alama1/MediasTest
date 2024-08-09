const express = require('express')
const cors = require('cors')
const expressRouter = require('./router')

class expressManager {
    constructor(app) {
        this.app = app
        this.server = express()
        this.configureRoutes()
    }

    configureRoutes() {
        const router = new expressRouter(this)
        this.server.use(express.json())
        this.server.use(cors())
        this.server.use(this.logger.bind(this))
        this.server.use('/', router.createRoutes()) 
        console.log('[express]: Routes configured!')
    }

    start() {
        this.server.listen(this.app.config.properties.express.port, () => {
            console.log(`[express]: Server started on port: ${this.app.config.properties.express.port}!`)
        })
    }

    logger(req, res, next) {
        console.log(`[express] New ${req.method} request for the route ${req.originalUrl}`)
        next()
    }
}

module.exports = expressManager
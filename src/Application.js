const Configuration = require('./Configuration')
const DatabaseManager = require ('./database/DatabaseManager')
const Express = require('./express/ExpressManager')

class Application {
    async initialize() {
        this.config = new Configuration()
        this.database = new DatabaseManager(this)
        this.express = new Express(this)
    }

    start() {
         this.database.connect()
         this.express.start()
    }
}

module.exports = new Application()
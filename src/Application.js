const Configuration = require('./Configuration')
const Database = require ('./database/DatabaseManager')
const Express = require('./express/ExpressManager')

class Application {
    async initialize() {
        this.config = new Configuration()
        this.database = new Database(this)
        this.express = new Express(this)
    }

    start() {
         this.database.connect()
    }
}

module.exports = new Application()
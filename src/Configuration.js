require('dotenv').config()

class Configuration {
    constructor() {
        
        if (!process.env.DATABASEPASSWORD) throw Error('Database password is not configured! \nPlease add DATABASEPASSWORD key in this program env variables.')
        if (!process.env.DATABASELOGIN) throw Error('Database login is not configured! \nPlease add DATABASELOGIN key in this program env variables.')
        if (!process.env.DATABASEHOST) throw Error('Database host is not configured! \nPlease add DATABASEHOST key in this program env variables.')
        if (!process.env.DATABASEPORT) throw Error('Database port is not configured! \nPlease add DATABASEPORT key in this program env variables.') 
        if (!process.env.DATABASENAME) throw Error('Database name is not configured! \nPlease add DATABASENAME key in this program env variables.')
        
        this.properties = {
            database: {
                name: process.env.DATABASENAME,
                login: process.env.DATABASELOGIN,
                password: process.env.DATABASEPASSWORD,
                port: process.env.DATABASEPORT,
                host: process.env.DATABASEHOST
            }
        }
    }
}

module.exports = Configuration
const app = require('./src/Application')

app
    .initialize()
    .then(() => {
        app.start()
    })
    .catch((err) => {
        console.error(err.message)
    })
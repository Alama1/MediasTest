const { Router } = require('express')

class expressRouter {
    constructor(express) {
        this.express = express
        this.database = express.app.database
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/cost/:id', this.getProductCost.bind(this))
        routes.get('/report', this.getReport.bind(this))
        
        //post
        routes.post('/products', this.addProduct.bind(this))
        routes.post('/arrivals', this.createIncomingInvoice.bind(this))
        routes.post('/orders', this.createOutgoingInvoice.bind(this))

        return routes
    }

    async getProductCost(req, res) {
        const id = req.params.id;
        const date = req.query.date;

        try {
            const priceResponse = await this.database.getPrice({ id, date });
            res.status(200)
                .json(priceResponse)
        } catch(err) {
            res.status(500)
                .json(err.message)
        }
    }

    getReport(req, res) {

    }

    async addProduct(req, res) {
        const product = req.body
        try {
            const productResponse = await this.database.createProduct(product)
            res.status(201)
                .json({success: true, message: productResponse})
        } catch(err) {
            res.status(500)
                .json(err.message)
        }
    }

    async createIncomingInvoice(req, res) {
        this.database.newIncomingInvoice(req, res)
    }

    async createOutgoingInvoice(req, res) {
        this.database.newOutgoingInvoice(req, res)
    }
}

module.exports = expressRouter
const { Router } = require('express')

class expressRouter {
    constructor(express) {
        this.express = express
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/cost/:id', this.getProductCost.bind(this))
        routes.get('/report', this.getReport.bind(this))
        
        //post
        routes.post('/products', this.addProduct.bind(this))
        routes.post('/arrivals', this.createIncomingInvoice.bind(this))
        routes.post('/orders', this.createBillOfLading.bind(this))

        //put

        //delete

        return routes
    }

    getProductCost(req, res) {

    }

    getReport(req, res) {

    }

    addProduct(req, res) {

    }

    createIncomingInvoice(req, res) {

    }

    createBillOfLading(req, res) {

    }
}

module.exports = expressRouter
#Inventory manager
## _Medias job interview test_

It is only server-side application, written in Node.JS
Stack used:
- [Node.JS]
- [Sequelize]
- [PostgreSQL]
- [Express]

##How to run

1. Clone this repository
2. Install npm packages
3. Set up ENV variables
4. Start application with npm start

```sh
git clone https://github.com/Alama1/MediasTest.git
npm install
```
##Set up env variables
You need following variables: * - required
```sh
DATABASEPASSWORD *
DATABASELOGIN *
DATABASEHOST *
DATABASEPORT * 
DATABASENAME *
EXPRESSPORT
```

##Start the application
```sh
npm start
```

#Routes
```sh
GET /cost/:id?date= - get cost of the product for the specific month.
GET /report?from=...&to=... - get report for the specific period of time

POST /products - create a new product body should have id and name keys
POST /arrivals - create a new incoming invoice
POST /orders - create a new outgoing invoice 
```
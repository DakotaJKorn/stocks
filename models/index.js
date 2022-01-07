
    // require the db configuration from the dbConfig file
const dbConfig = require('../config/dbConfig')
    
    // require the sequelize Constructor and Datatypes from sequelize module
const { Sequelize, DataTypes } = require('sequelize')


    // construct the sequelize object using the constructor
const sequelize = new Sequelize(
    { // use imported configurations from dbConfig
        database: dbConfig.DB,
        username: dbConfig.USER,
        password: dbConfig.PASSWORD,
        dialect: dbConfig.dialect,
        host: dbConfig.HOST,
    })

    // authenticate will test the connection with DB and return a promise
sequelize.authenticate()
.then(() => { // successfully connected to DB
    console.log(`---------------------------------------`)
    console.log(`-   Connected to Postgres Database    -`)
    console.log(`---------------------------------------`)
})
.catch(e => {// failed connecting to DB
    console.log('unable to connect to Postgres DB' + e)
})

// create a db object to work with the sequelize table
const db = {}

// create an attribute storing the previously created sequelize instance
db.sequelize = sequelize

// get the stock_archive model - our table name will be cusomters as set in the following line
db.Stock_Archives = require('./stockArchiveModel')(sequelize, DataTypes)

// sync the db by running the model
// "force: false" ensures that the table is not created again every time the program runs
db.sequelize.sync({ force: false }).then(() => {
    console.log(`---------------------------------------`)
    console.log(`-      DB synced with sequelize       -`)
    console.log(`---------------------------------------`)
}).catch((error) => {
    console.log('Error syncing the DB to sequelize' + error)
})

module.exports = db
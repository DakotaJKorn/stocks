const dbConfig = require('../config/dbConfig')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({ 
        database: dbConfig.DB,
        username: dbConfig.USER,
        password: dbConfig.PASSWORD,
        dialect: dbConfig.dialect,
        host: dbConfig.HOST,
    })

 
sequelize.authenticate()
    .then(() => { 
        console.log(`---------------------------------------`)
        console.log(`-   Connected to Postgres Database    -`)
        console.log(`---------------------------------------`)
    })
    .catch(e => console.log('unable to connect to Postgres DB' + e))


const db = {}
db.sequelize = sequelize

// Creates a table called Stock_Archives in the db
db.Stock_Archives = require('./stockArchiveModel')(sequelize, DataTypes)
db.Stocks = require('./stockModel')(sequelize, DataTypes)
// sync the db by running the model
// "force: false" ensures that the table is not created again every time the program runs
db.sequelize.sync({ force: false })
    .then(() => {
        console.log(`---------------------------------------`)
        console.log(`-      DB synced with sequelize       -`)
        console.log(`---------------------------------------`)
    })
    .catch((error) => console.log('Error syncing the DB to sequelize' + error))

db.Stock_Archives.belongsTo(db.Stocks);
db.Stocks.hasMany(db.Stock_Archives);

module.exports = db
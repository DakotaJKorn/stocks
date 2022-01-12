const stockInfoController = require('../controllers/stockInfoController')
const router = require('express').Router()

// access all of the stocks in the database
router.get('/', stockInfoController.getAllStocks)

// access a group of stocks
router.get('/:stock_symbols_separated_by_commas', stockInfoController.getStockGroup)



module.exports = router
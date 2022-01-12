const router = require('express').Router()
const stockCurrentController = require('../controllers/stockCurrentController')

// access all of the stocks in the database
router.get('/', stockCurrentController.getAllStocks)

// access a group of stocks
router.get('/:stock_symbols_separated_by_commas', stockCurrentController.getStockGroup)

module.exports = router
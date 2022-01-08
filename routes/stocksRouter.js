const router = require('express').Router()
const stockController = require('../controllers/stocksController')

// access all of the stocks in the database
router.get('/', stockController.getAllStocks)

// access a group of stocks
router.get('/:stock_symbols_separated_by_commas', stockController.getStockGroup)

module.exports = router
const router = require('express').Router()
const stockController = require('../controllers/stocksController')

// access all of the stocks in the database
router.get('/', stockController.getAllStocks)

// access a group of stocks
router.get('/stockArray/:stock_symbols_separated_by_commas', stockController.getStockGroup)

// access one stock in the database
router.get('/:stock_symbol', stockController.getStock)


module.exports = router
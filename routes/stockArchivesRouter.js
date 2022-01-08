const stockArchiveController = require('../controllers/stockArchiveController')
const router = require('express').Router()


// add a new archive to the database
router.post('/', stockArchiveController.addStockArchive)

// access all of the archives in the database
router.get('/', stockArchiveController.getAllStockArchives)

// access all of the archives in the database for one specific stock
router.get('/:stock_symbol_OR_date', stockArchiveController.getAllStockArchivesFromStockSymbolOrDate)

// access all of the archives in the database for the inputted stocks
router.get('/:stock_symbols_separated_by_commas/all', stockArchiveController.getAllStockArchivesFromStockSymbols)

// access all of the archives in the database for the inputted stocks on the inputted dates
router.get('/:stock_symbols_separated_by_commas/:dates_separated_by_commas', stockArchiveController.getStockArchivesFromStockSymbolsAndDates)


module.exports = router
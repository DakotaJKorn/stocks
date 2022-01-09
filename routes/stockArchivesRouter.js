const stockArchiveController = require('../controllers/stockArchiveController')
const router = require('express').Router()


// add a new archive to the database
router.post('/', stockArchiveController.addStockArchive)

// access all of the archives in the database
router.get('/', stockArchiveController.getStockArchives)

// access all of the archives in the database for one specific stock
router.get('/:stock_symbols_separated_by_commas', stockArchiveController.getStockArchivesFromStockSymbols)

// access all of the archives in the database for the inputted stocks on the inputted dates
router.get('/all/:dates_separated_by_commas', stockArchiveController.getStockArchivesFromDates)

// access all of the archives in the database for the inputted stocks on the inputted dates
router.get('/all/:date1/:date2', stockArchiveController.getStockArchivesFromDateRange)

// access all of the archives in the database for the inputted stocks on the inputted dates
router.get('/:stock_symbols_separated_by_commas/:dates_separated_by_commas', stockArchiveController.getStockArchivesFromStockSymbolsAndDates)

// access all of the archives in the database for the inputted stocks on the inputted dates
router.get('/:stock_symbols_separated_by_commas/:date1/:date2', stockArchiveController.getStockArchivesFromStockSymbolsAndDateRange)


module.exports = router
const stockArchiveController = require('../controllers/stockArchiveController')
const router = require('express').Router()


// add a new archive to the database
router.post('/', stockArchiveController.addStockArchive)

// access all of the archives in the database
router.get('/', stockArchiveController.getAllStockArchives)

// access all of the archives in the database for one specific stock
router.get('/:stock_symbol_OR_date', stockArchiveController.getAllStockArchivesFromStockSymbolOrDate)

// access all of the archives in the database for one specific stock
router.get('/:stock_symbols_separated_by_commas/:dates_separated_by_commas', stockArchiveController.getStockArchivesFromStockSymbolsAndDates)


/*
// access one customer by id
router.get('/:stock_symbol', stockArchiveController.getOneStockArchive)

// modify one customer by id
router.put('/:stock_symbol', stockArchiveController.updateStockArchive)

// delete one customer by id
router.delete('/:stock_symbol', stockArchiveController.deleteStockArchive)
*/
module.exports = router
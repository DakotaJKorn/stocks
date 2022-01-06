// import the controller functions
const stockArchiveController = require('../controllers/stockArchiveController')

// create a Router object from express
const router = require('express').Router()

// add a new customer to the table
router.post('/', stockArchiveController.addStockArchive)

// access all the customers in the table
router.get('/', stockArchiveController.getAllStockArchives)

// access one customer by id
router.get('/:stock_symbol', stockArchiveController.getOneStockArchive)

// modify one customer by id
router.put('/:stock_symbol', stockArchiveController.updateStockArchive)

// delete one customer by id
router.delete('/:stock_symbol', stockArchiveController.deleteStockArchive)

module.exports = router
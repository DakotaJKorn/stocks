// require the db created in the index file
const { Stock_Archives } = require('../models/index')
const db = require('../models/index')

// get the customers model
const StockArchives = db.Stock_Archives


const addStockArchive = async (req, res) => {
    console.log("I MADE IT HERE!!!")
    let input_data = {
        stock_symbol: req.body.stock_symbol,
        stock_value: req.body.stock_value,
        date: req.body.date,
        }
        // using the builtin 'create' function on Customer Model
        const stockArchive = await Stock_Archives.create(input_data)
        
        // send a 200 response with the created entry
        res.status(200).send(stockArchive)
}  

const getAllStockArchives = async (req, res) => {

    // using the builtin 'findOne' function
    let stockArchives = await StockArchives.findAll({})
    res.status(200).send(stockArchives)
}   

const getOneStockArchive = async (req, res) => {

    // getting the id from the params in the req
    let stock_symbol = req.params.stock_symbol
    
    // using the builtin 'findOne' function on Customer Model
    let stockArchive = await StockArchives.findOne({where: {stock_symbol: stock_symbol}})
    res.status(200).send(stockArchive)
} 

const updateStockArchive = async (req, res) => {
    let stock_symbol = req.params.stock_symbol

    // using the builtin 'update' function on Customer Model
    const stockArchive = await StockArchives.update(req.body, { where: {stock_symbol: stock_symbol}})
    res.status(200).send(stockArchive)
}

const deleteStockArchive = async (req, res) => {
    let stock_symbol = req.params.stock_symbol

    // using the builtin 'destroy' function on Customer Model
    await StockArchives.destroy({where :{stock_symbol: stock_symbol}})
    res.status(200).send(`stock archive with symbol: ${stock_symbol} is deleted`)
}     


// export all the controller functions
module.exports = {
    addStockArchive,
    getAllStockArchives,
    getOneStockArchive,
    updateStockArchive,
    deleteStockArchive
}
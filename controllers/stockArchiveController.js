const db = require('../models/index')
const StockArchivesTable = db.Stock_Archives

const addStockArchive = async (request, response) => {

    const date = new Date(request.body.date)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const dateString = "" + date.toLocaleDateString("en-US", options)

    let input_data = {
        stock_symbol: request.body.stock_symbol,
        stock_value: request.body.stock_value,
        date: dateString
        }

    const stockArchive = await StockArchivesTable.create(input_data)
    response.status(200).send(stockArchive)
}  

const getAllStockArchives = async (request, response) => {

    let stockArchives = await StockArchivesTable.findAll({})
    response.status(200).send(stockArchives)

}   

const getAllStockArchivesFromStockSymbolOrDate = async (request, response) => {

    const stock_symbol_OR_date = request.params["stock_symbol_OR_date"].toUpperCase()

    let stockArchives = "";

    if(isNaN(Date.parse(stock_symbol_OR_date))){
        const stock_symbol = stock_symbol_OR_date
        stockArchives = await StockArchivesTable.findAll({where: {stock_symbol: stock_symbol}})
    } 
    else{
        const date = new Date(stock_symbol_OR_date)
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const dateString = date.toLocaleDateString("en-US", options)
        stockArchives = await StockArchivesTable.findAll({where: {date: dateString}})
    }
        
    response.status(200).send(stockArchives)
} 


const getStockArchivesFromStockSymbolsAndDates = async (request, response) => {

    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",")
    const array_of_date_strings = request.params["dates_separated_by_commas"].split(",")

    const array_of_formatted_dates = new Array();

    const options = { year: 'numeric', month: 'long', day: 'numeric' }

    for(let date_string of array_of_date_strings){
        let date = new Date(date_string)
        array_of_formatted_dates.push(date.toLocaleDateString("en-US", options))
    }


    let returnObject = {
        stockArchives:  [],
        errors: []
    }

    for(let stock_symbol of array_of_stock_symbols){
        for(let date of array_of_formatted_dates){
            let archive = await StockArchivesTable.findOne({where: {stock_symbol: stock_symbol, date: date}})
            if(archive == null)
            returnObject.errors.push(`Error: Could not find an archive of ${stock_symbol} on ${date}`)
            else{
                returnObject.stockArchives.push(archive)
            }
        }
    }

    if(returnObject.errors.length != 0)
    response.status(200).send(returnObject)
    else if(returnObject.stockArchives.length == 1)
    response.status(200).send(returnObject.stockArchives[0])
    else
    response.status(200).send(returnObject.stockArchives)
} 

 
/* -------------------------------------------------------------------------------
----------------------------------------------------------------------------------
                             Working On
----------------------------------------------------------------------------------
---------------------------------------------------------------------------------*/




/* -------------------------------------------------------------------------------
----------------------------------------------------------------------------------
                             Not Functional
----------------------------------------------------------------------------------
---------------------------------------------------------------------------------*/
//let stockArchive = await StockArchives.findOne({where: {stock_symbol: stock_symbol}})

const getAllStockArchivesFromDate = async (request, response) => {

    const date = request.params["date"].toUpperCase()

    let stockArchives = await StockArchivesTable.findAll({where: {date: date}})
    response.status(200).send(stockArchives)
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

module.exports = {
    addStockArchive,
    getAllStockArchives,
    getAllStockArchivesFromStockSymbolOrDate,
    getStockArchivesFromStockSymbolsAndDates
}
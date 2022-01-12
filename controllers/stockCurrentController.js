const db = require('../models/index')
const StockArchivesTable = db.Stock_Archives
const StockInfoTable = db.Stock_Info
const StockCurrentTable = db.Stock_Current

const getAllStocks = async (request, response) => {
    let stocks = await StockCurrentTable.findAll({})
    //console.log(stocks)
    let returnArray = new Array();

    for(let stock of stocks)
    {
        returnArray.push({
            "stock_symbol": stock.stock_symbol,
            "stock_value": stock.stock_value,
        })
    }
        

    response.status(200).send(returnArray)
}  

const getStockGroup = async (request, response) => {
    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",")

    let returnObject = {
        stocks:  [],
        errors: []
    }

    
    for(let stock_symbol of array_of_stock_symbols){
            let stockInfo = await StockCurrentTable.findOne({where: {stock_symbol: stock_symbol}})
            if(stockInfo.length == 0)
                returnObject.errors.push({"stock_symbol-error": stock_symbol})
            else{
                    returnObject.stocks.push({
                                        "stock_symbol": stockInfo.stock_symbol,
                                        "stock_value": stockInfo.stock_value 
                                    })
            }
    }
    
    console.log(returnObject)
    setTimeout(() => {
        if(returnObject.stocks.length == 1 && returnObject.errors.length == 0)
            response.status(200).send(returnObject.stocks[0])
        else if(returnObject.stocks.length == 0 && returnObject.errors.length == 1)
            response.status(200).send(returnObject.errors[0])
        else
            response.status(200).send(returnObject)
    }, 100)
    
}

module.exports = {
    getAllStocks,
    getStockGroup,
}
const db = require('../models/index')
const StockArchivesTable = db.Stock_Archives
const StockInfoTable = db.Stock_Info
const StockCurrentTable = db.Stock_Current

const getAllStocks = async (request, response) => {
    let stocks = await StockInfoTable.findAll({include: [StockArchivesTable,StockCurrentTable]})
    let returnArray = new Array();

    for(let stock of stocks)
    {
        
        returnArray.push({
            "stock_symbol": stock.stock_symbol,
            "stock_name": stock.stock_name,
            "stock_value": stock.stock_current,
            "stock_exchange": stock.stock_exchange,
            "stock_sector": stock.stock_sector,
            "stock_industry": stock.stock_industry,
            "stock_description": stock.stock_description,
            "stock_archives": stock.stock_archives
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
            let stockInfo = await StockInfoTable.findOne({where: {stock_symbol: stock_symbol}, include: [StockArchivesTable,StockCurrentTable]})
            if(stockInfo == null)
                returnObject.errors.push({
                                       "stock_symbol": stock_symbol,
                                       "stock_name": "", 
                                       "stock_value": "",
                                       "stock_exchange": "",
                                       "stock_sector": "",
                                       "stock_industry": "", 
                                       "stock_description": "",
                                       "stock_archives": ""
                                    })
            else{
                    returnObject.stocks.push({
                                       "stock_symbol": stockInfo.stock_symbol,
                                       "stock_name": stockInfo.stock_name, 
                                       "stock_value": stockInfo.stock_current,
                                       "stock_exchange":stockInfo.stock_exchange,
                                       "stock_sector": stockInfo.stock_sector,
                                       "stock_industry": stockInfo.stock_industry, 
                                       "stock_description": stockInfo.stock_description,
                                       "stock_archives": stockInfo.stock_archives
                                    })
            }
    }
    
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
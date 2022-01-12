const db = require('../models/index')
const StockArchivesTable = db.Stock_Archives
const StockTable = db.Stocks

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

const getStockArchives = async (request, response) => {

    let stockArchives = await StockArchivesTable.findAll({})
    let returnArray = new Array();

    for(let archive of stockArchives)
    {
        returnArray.push({
            "stock_symbol": archive.stock_symbol,
            "stock_value": archive.stock_value,
            "date": archive.date
        })
    }
        

    response.status(200).send(returnArray)

}   

const getStockArchivesFromStockSymbols = async (request, response) => {

    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",")

    let stockArchives = {
        archives:  [],
    }

    let returnObject = {
        archives:  [],
        errors: []
    }

    for(let stock_symbol of array_of_stock_symbols){
            let archive = await StockArchivesTable.findAll({where: {stock_symbol: stock_symbol}})
            if(archive.length == 0)
                returnObject.errors.push({"stock_symbol": stock_symbol, "stock_value":"", "date":""})
            else{
                for(let stock_archive of archive)
                    stockArchives.archives.push(stock_archive)
            }
    }

    for(let archive of stockArchives.archives){
        returnObject.archives.push({"stock_symbol": archive.stock_symbol, "stock_value":archive.stock_value, "date":archive.date})
    }

        response.status(200).send(returnObject)

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

    let stockArchives = {
        archives:  []
    }

    let returnObject = {
        archives:  [],
        errors: []
    }

    for(let stock_symbol of array_of_stock_symbols){
        for(let date of array_of_formatted_dates){
            let archive = await StockArchivesTable.findOne({where: {stock_symbol: stock_symbol, date: date}})
            if(archive == null)
                returnObject.errors.push({"stock_symbol": stock_symbol, "stock_value": "", "date": date})
            else{
                stockArchives.archives.push(archive)
            }
        }
    }

    for(let archive of stockArchives.archives){
        returnObject.archives.push({"stock_symbol": archive.stock_symbol, "stock_value":archive.stock_value, "date":archive.date})
    }

    if(returnObject.archives.length == 1 && returnObject.errors.length == 0)
        response.status(200).send(returnObject.archives[0])
    else if(returnObject.archives.length == 0 && returnObject.errors.length == 1)
        response.status(200).send(returnObject.errors[0])
    else
        response.status(200).send(returnObject)
} 


const getStockArchivesFromDates = async (request, response) => {
    const array_of_date_strings = request.params["dates_separated_by_commas"].split(",")

    const array_of_formatted_dates = new Array();

    const options = { year: 'numeric', month: 'long', day: 'numeric' }

    for(let date_string of array_of_date_strings){
        let date = new Date(date_string)
        array_of_formatted_dates.push(date.toLocaleDateString("en-US", options))
    }

    let stockArchives = {
        archives:  []
    }

    let returnObject = {
        archives:  [],
        errors: []
    }

    for(let date of array_of_formatted_dates){
        let archives = await StockArchivesTable.findAll({where: {date: date}})
        
        if(archives.length == 0)
            returnObject.errors.push({"stock_symbol": "", "stock_value": "", "date": date})

        for(let archive of archives)
                stockArchives.archives.push(archive.dataValues) 
 
    }

    for(let archive of stockArchives.archives){
        returnObject.archives.push({"stock_symbol": archive.stock_symbol, "stock_value":archive.stock_value, "date":archive.date})
    }

    if(returnObject.archives.length == 1 && returnObject.errors.length == 0)
        response.status(200).send(returnObject.archives[0])
    else
        response.status(200).send(returnObject)

}

const getStockArchivesFromStockSymbolsAndDateRange = async (request, response) => {
    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",")
    const date1 = request.params["date1"]
    const date2 = request.params["date2"]

    const options = { year: 'numeric', month: 'long', day: 'numeric' }

    let dateA = new Date(date1)
    let dateB = new Date(date2)

    let getDate = new Date();
    let todayformatted = getDate.toLocaleDateString("en-US", options)
    let today = new Date(todayformatted)

    if(dateA.getFullYear() < 2022)
        dateA = new Date('01-01-2022')
    if(dateB.getFullYear() < 2022)
        dateB = new Date('01-01-2022')
    if(dateA > today)
        dateA = today
    if(dateB > today)
        dateB = today

    let formattedDateA = dateA.toLocaleDateString("en-US", options)
    let formattedDateB = dateB.toLocaleDateString("en-US", options)

    let dateRange = new Array(); 

        if(dateA <= dateB){
            while (dateA < dateB) {
                let formattedDate = dateA.toLocaleDateString("en-US", options)
                dateRange.push(formattedDate)
                dateA.setDate(dateA.getDate() + 1)
            }
            dateRange.push(formattedDateB)
        }
        else if(dateB < dateA){
            while (dateB < dateA) {
                let formattedDate = dateB.toLocaleDateString("en-US", options)
                dateRange.push(formattedDate)
                dateB.setDate(dateB.getDate() + 1)
            }
            dateRange.push(formattedDateA)
        }
    
    

    let stockArchives = {
        archives:  []
    }

    let returnObject = {
        archives:  [],
        errors: []
    }

    for(let stock_symbol of array_of_stock_symbols){
        for(let date of dateRange){
            let archive = await StockArchivesTable.findOne({where: {stock_symbol: stock_symbol, date: date}})
            if(archive == null)
                returnObject.errors.push({"stock_symbol": stock_symbol, "stock_value": "", "date": date})
            else{
                stockArchives.archives.push(archive)
            }
        }
    }


    for(let archive of stockArchives.archives){
        returnObject.archives.push({"stock_symbol": archive.stock_symbol, "stock_value":archive.stock_value, "date":archive.date})
    }

    response.status(200).send(returnObject)

}

const getStockArchivesFromDateRange = async (request, response) => {

    const date1 = request.params["date1"]
    const date2 = request.params["date2"]

    const options = { year: 'numeric', month: 'long', day: 'numeric' }

    let dateA = new Date(date1)
    let dateB = new Date(date2)

    let getDate = new Date();
    let todayformatted = getDate.toLocaleDateString("en-US", options)
    let today = new Date(todayformatted)

    if(dateA.getFullYear() < 2022)
        dateA = new Date('01-01-2022')
    if(dateB.getFullYear() < 2022)
        dateB = new Date('01-01-2022')
    if(dateA > today)
        dateA = today
    if(dateB > today)
        dateB = today

    let formattedDateA = dateA.toLocaleDateString("en-US", options)
    let formattedDateB = dateB.toLocaleDateString("en-US", options)

    let dateRange = new Array(); 

        if(dateA <= dateB){
            while (dateA < dateB) {
                let formattedDate = dateA.toLocaleDateString("en-US", options)
                dateRange.push(formattedDate)
                dateA.setDate(dateA.getDate() + 1)
            }
            dateRange.push(formattedDateB)
        }
        else if(dateB < dateA){
            while (dateB < dateA) {
                let formattedDate = dateB.toLocaleDateString("en-US", options)
                dateRange.push(formattedDate)
                dateB.setDate(dateB.getDate() + 1)
            }
            dateRange.push(formattedDateA)
        }
    
    

    let stockArchives = {
        archives:  []
    }

    let returnObject = {
        archives:  [],
        errors: []
    }

    for(let date of dateRange){
        let archives = await StockArchivesTable.findAll({where: {date: date}})
        if(archives.length == 0)
            returnObject.errors.push({"stock_symbol": "", "stock_value": "", "date": date})

        for(let archive of archives)
                stockArchives.archives.push(archive.dataValues) 
    }

    for(let archive of stockArchives.archives){
        returnObject.archives.push({"stock_symbol": archive.stock_symbol, "stock_value":archive.stock_value, "date":archive.date})
    }

    response.status(200).send(returnObject)

}

module.exports = {
    addStockArchive,
    getStockArchives,
    getStockArchivesFromStockSymbols,
    getStockArchivesFromStockSymbolsAndDates,
    getStockArchivesFromDates,
    getStockArchivesFromStockSymbolsAndDateRange,
    getStockArchivesFromDateRange
}


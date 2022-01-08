const docClient = require('../config/dynamoDBConfig').docClient;

const getAllStocks = async (request, response) => {
    docClient.scan( { TableName:"Stocks" } , (err, data) => {
        if (err)
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2))
         else         
            response.status(200).send(data.Items)
    })
}  

const getStockGroup = async (request, response) => {
    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",")

    let stocks = {
        "stock_array":[],
        "errors":[]
    }

    for(let stock_symbol of array_of_stock_symbols){
        
        docClient.get({ TableName: "Stocks", Key:{ "stock_symbol": stock_symbol } }, await function(err,data){
            if(err)
                    console.log("stock::get::error - " + JSON.stringify(err,null,2))
            else{
                    if(data.Item != null)
                        stocks.stock_array.push(data.Item)
                    else
                        stocks.errors.push({"stock_name":"", "stock_symbol":stock_symbol, "stock_value":""})
            }
        })

    }

    setTimeout(() => {
        if(stocks.stock_array.length == 1 && stocks.errors.length == 0)
            response.status(200).send(stocks.stock_array[0])
        else if(stocks.stock_array.length == 0 && stocks.errors.length == 1)
            response.status(200).send(stocks.errors[0])
        else
            response.status(200).send(stocks)
    }, 100)
    


}

module.exports = {
    getAllStocks,
    getStockGroup,
}
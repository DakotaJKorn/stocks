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

    let returnObject = {
        "stocks":[],
        "errors":[]
    }

    for(let stock_symbol of array_of_stock_symbols){
        
        docClient.get({ TableName: "Stocks", Key:{ "stock_symbol": stock_symbol } }, await function(err,data){
            if(err)
                    console.log("stock::get::error - " + JSON.stringify(err,null,2))
            else{
                    if(data.Item != null)
                        returnObject.stocks.push(data.Item)
                    else
                        returnObject.errors.push({"stock_name":"", "stock_symbol":stock_symbol, "stock_value":""})
            }
        })

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
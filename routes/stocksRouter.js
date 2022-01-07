const router = require('express').Router()
const AWS = require('aws-sdk');

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAVG5QQ6QVBRDCKWHE", "secretAccessKey": "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"
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();



// access all of the stocks in the database
router.get('/', (request, response) => {

    docClient.scan( { TableName:"Stocks" } , (err, data) => {
        if (err)
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
         else         
            response.status(200).send(data.Items); 
    });

});

// access a group of stocks
router.get('/stockArray/:stock_symbols_separated_by_commas', (request, response) => {

    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",");

    let stocks = {
        "stock_array":[],
        "errors":[]
    }
    
    for(let stock_symbol of array_of_stock_symbols){
        
        docClient.get({ TableName: "Stocks", Key:{ "stock_symbol": stock_symbol } }, function(err,data){
            if(err)
                    console.log("stock::get::error - " + JSON.stringify(err,null,2)); 
            else{
                    if(data.Item != null)
                        stocks.stock_array.push(data.Item);
                    else
                        stocks.errors.push("Error: Couldn't find stock with symbol: " + stock_symbol);   
            }
        })

    }

    setTimeout(function(){
        response.status(200).send(stocks); 
    }, 100);
    
});


// access one stock in the database
router.get('/:stock_symbol', (request, response) => {

    docClient.get({ TableName: "Stocks", Key: {"stock_symbol": request.params["stock_symbol"].toUpperCase()} }, function(err,data){
        if(err){
                console.log("stock::get::error - " + JSON.stringify(err,null,2));
        }
        else{
                if(data.Item == null)
                    response.status(200).send("Error: Stock couldn't be found in database.");
                else
                    response.status(200).send(data.Item);
        }
    })
});




module.exports = router
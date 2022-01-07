// create a Router object from express
const router = require('express').Router()
const AWS = require('aws-sdk');

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAVG5QQ6QVBRDCKWHE", "secretAccessKey": "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"
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();


//params.Key.stock_symbol="AAPL";


// access all the customers in the table
router.get('/', (request, response) => {
    
    let params = {
        TableName: "Stocks"
    };

    let stocks = {
        "stock_array":[]
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            console.log("Scan succeeded.");
            stocks.stock_array = data.Items;
            response.status(200).send(stocks.stock_array); 
        }
    });
    
});

// access all the customers in the table
router.get('/stockArray/:stock_symbols_separated_by_commas', (request, response) => {
    const array_of_stock_symbols = request.params["stock_symbols_separated_by_commas"].toUpperCase().split(",");

    let stocks = {
        "stock_array":[],
        "errors":[]
    }


    let params = {
        TableName: "Stocks",
        Key:{
                "stock_symbol": ""
        }
    };
    

    for(let stock_symbol of array_of_stock_symbols){

        params.Key.stock_symbol = stock_symbol;
        
        docClient.get(params, function(err,data){
            if(err){
                    console.log("stock::get::error - " + JSON.stringify(err,null,2));
                    
            }
            else{
                    console.log("stock::get::success");
                    if(data.Item != null){
                        stocks.stock_array.push(data.Item);
                    }
                    else{
                        stocks.errors.push("Error: Couldn't find stock with symbol: " + stock_symbol);
                    }
                    
            }
    })

    }

    setTimeout(function(){
        response.status(200).send(stocks); 
    }, 100);
    
});



router.get('/:stock_symbol', (request, response) => {

    let stock;

    let params = {
        TableName: "Stocks",
        Key:{
                "stock_symbol": ""
        }
    };

    params.Key.stock_symbol = request.params["stock_symbol"].toUpperCase();

    docClient.get(params, function(err,data){
        if(err){
                console.log("stock::get::error - " + JSON.stringify(err,null,2));
        }
        else{
                //console.log("stock::get::success");
                stock = data.Item;

                if(stock == null)
                response.status(200).send("Error: Stock couldn't be found in database.");
                else
                response.status(200).send(stock);
        }
})
});




/*
app.get('/', (request, response) => {
    response.send("HELLO WORLD!");
});

app.get('/allStocks', (request, response) => {
    //
});

app.get('/allStocks/:date', (request, response) => {
    //response.send();
});

app.get('/stock_symbol_array/:arrayOfStockSymbols', (request, response) => {
    //response.send();
});

app.get('/stock_symbol_array/:arrayOfStockSymbols/:date', (request, response) => {
    //response.send();
});

app.get('/:stock_symbol', (request, response) => {
    params.Key.stock_symbol = request.params["stock_symbol"];

    docClient.get(params, function(err,data){
        if(err){
                console.log("stock::get::error - " + JSON.stringify(err,null,2));
                response.status(404).send("Oops! We couldn't find the stock you were searching for. Make sure you are entering the correct symbol of the stock.");
        }
        else{
                console.log("stock::get::success");
                response.status(200).send(data);
        }
})
    //response.send();
});

app.get('/:stock_symbol/:date', (request, response) => {
    const stock_symbol = request.params["stock_symbol"];
    const date = request.params["date"];
    //response.send();
});



app.post("/createStock",(request,response)=> {
    let body = request.body;
    console.log(body);
    let input = {
            "stock_name": body.stock_name,
            "stock_symbol": body.stock_symbol,
            "stock_value": body.stock_value
    };
    let params = {
            TableName: "Stocks",
            Item: input,
    };

    docClient.put(params, function(err,data){
            if(err){
                    console.log("stock::add::error - " + JSON.stringify(err,null,2));
                    response.status(404).send("Oops! Stock could not be added to the database.");
            }
            else{
                    console.log("stock::add::success");
                    response.status(200).send("Great! Stock saved in dynamoDB");
            }
    })
})
*/

module.exports = router
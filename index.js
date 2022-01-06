const express = require('express');
const request = require('express/lib/request');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 3223;

let awsConfig = {
        "region": "us-east-1",
        "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
        "accessKeyId": "AKIAVG5QQ6QVBRDCKWHE", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

 
let params = {
    TableName: "Stocks",
    Key:{
            "stock_symbol": ""
    }
};

//params.Key.stock_symbol="AAPL";
console.log("Hosting on port: ",port);

app.get('/', (request, response) => {
    response.send("HELLO WORLD!");
});

app.get('/allStocks', (request, response) => {
    //response.send();
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
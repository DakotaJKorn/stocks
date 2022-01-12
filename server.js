const express = require('express')
const req = require('express/lib/request')

const app = express()
const port = process.env.PORT || 3223

app.use(express.json())


const Router_Archives = require('./routes/stockArchivesRouter.js')
app.use('/archives', Router_Archives)
const Router_Stocks = require('./routes/stockCurrentRouter.js')
app.use('/current', Router_Stocks)
const Router_StockInfo = require('./routes/stockInfoRouter.js')
app.use('/info', Router_StockInfo)



app.listen(port, () => {
    console.log(`-----------------------------------------------`)
    console.log(`- Express Server is listening on Port:  ${port}  -`)
    console.log(`-----------------------------------------------`)
})

const express = require('express')
const req = require('express/lib/request')

const app = express()
const port = process.env.PORT || 3223

app.use(express.json())


const Router_Archives = require('./routes/stockArchivesRouter.js')
app.use('/stockArchives', Router_Archives)
const Router_Stocks = require('./routes/stocksRouter.js')
app.use('/stocks', Router_Stocks)

console.log("Hosting on port: ",port)

app.listen(port, () => {
    console.log(`---------------------------------------`)
    console.log(`-     Express Server is listening     -`)
    console.log(`---------------------------------------`)
})

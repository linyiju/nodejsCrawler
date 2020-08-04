const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8081
const moment = require('moment')


// 創建 application/x-www-form-urlencoded 編碼解析
const urlencodeParser = bodyParser.urlencoded({ extended: false })

// 放入靜態文件
app.use('/public', express.static('public'))

// 進入主頁
app.get('/', function(req, res) {
    res.sendFile(`${__dirname}/public/index.html`)
})

// process_get 頁面
app.post('/process_post', urlencodeParser, function(req, res) {
    let response = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name
    }
    console.log(response)
    res.end(JSON.stringify(response))
})

// Display udnCrawler Informatipn
app.get('/crawlerInfo', async function(req, res) {
    let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
    let udn = new udnCrawler()
    let info = await udn.praseUdn()
    let response = {
        data: "udnCrawler",
        date: moment().format('YYYY-MM-DD'),
        info: info
    }
    res.json(response)
})

app.listen(port ,() => {
    console.log(`Example app listening at http://localhost:${port}`)
})

exports.udnWeb = app;


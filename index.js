const express = require('express')
const app = express()
const moment = require('moment')
const bodyParser = require('body-parser')
const path = require('path')

// 創建 application/x-www-form-urlencoded 編碼解析
const urlencodeParser = bodyParser.urlencoded({ extended: false })

// 放入靜態文件
app.use('/template', express.static(path.join('template')))
app.use('/public', express.static(path.join('public')))

// Maine Page
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/template/index.html`)
})

// Main Page
app.get('/udnCrawler', async (req, res) => {
    let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
    let udn = new udnCrawler()
    let infos = await udn.praseUdn()
    let today =  moment().format('YYYY-MM-DD')
    let data = {
        date: today,
        data: infos 
    }
    res.send(data)
})

// Post
app.post('/get_data', urlencodeParser, async (req, res) => {
    let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
    let udn = new udnCrawler()
    let infos = await udn.praseUdn()
    if(req.body.num > infos.length) {
        res.send(`The length is ${infos.length}. \nYour input number is ${req.body.num}\nYou have to reset the number.`)
    } else {
        let response = infos[req.body.num]
        res.send(response)
    }
})

// Post
app.post('/get_page', urlencodeParser, async (req, res) => {
    let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
    let udn = new udnCrawler()
    let infos = await udn.praseUdn(req.body.page)
    let today =  moment().format('YYYY-MM-DD')
    let data = {
        date: today,
        page: req.body.page,
        data: infos 
    }
    res.send(data)
})


// Get
// app.get('/getData/', async (req, res) => {
//     let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
//     let udn = new udnCrawler()
//     let infos = await udn.praseUdn()
//     let response = infos[req.query.num]
//     res.send(response)
// })

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

exports.udnTest = app;
const express = require('express')
const app = express()
const moment = require('moment')
const bodyParser = require('body-parser')
const path = require('path')
const crypto = require('crypto')
const base = require(`${__dirname}/lib/base`)
const session = require('express-session')

// 創建 application/x-www-form-urlencoded 編碼解析
const urlencodeParser = bodyParser.urlencoded({ extended: false })

// 放入靜態文件
app.use('/template', express.static(path.join('template')))
app.use('/public', express.static(path.join('public')))

// Veiw engine setup
app.set('views', path.join(`${__dirname}`, 'views'))
app.set('view engine', 'ejs')

// Session
app.use(session({
    secret: 'udncrawlertest',
    resave : true,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 1000}
}))

// Login
app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
})

// Loout
app.get('/logout', (req, res) => {
    req.session.userName = null // Delete session
    res.redirect('login')
})

// Sign
app.get('/sign', async (req, res) => {
    res.render('sign', {title: 'Sign'})
})

// Sign Post
app.post('/crawler', urlencodeParser, async (req, res) => {
    let name = req.body.name
    let pwd = req.body.password
    let rePwd = req.body.rePass

    if(pwd != rePwd) {
        res.render('sign', {title: 'Sign'})
    } else {
        let md5 = crypto.createHash('md5') // 加密
        pwd = md5.update(pwd).digest('hex')
        await base.saveUser(name, pwd)
        res.render('crawler', {title: 'udn Crawler'})
    }
})

// Crawler Page
app.post('/', urlencodeParser, async (req, res) => {
    let name = req.body.name
    let pwd = req.body.password
    let userInfo = await base.getUserNumByName(name) // 尋找帳號是否儲存在資料庫內
    if(userInfo == 0) {
        res.render('sign', {title: 'Sign'})
    } else {
        req.session.userName = name
        res.redirect('/')
    }
})

// Main Page
app.get('/', (req, res) => {
    if(req.session.userName) { // 判斷 session 狀態
        res.render('crawler', {title: 'udn Crawler'})
    } else {
        //設定session
        req.session.userName = name
        res.redirect('login')
    }
})

// Crawler Page
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
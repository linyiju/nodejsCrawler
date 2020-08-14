const express = require('express')
const router = express.Router()

/* GET HOME Page */
router.get('/', (req, res) => {
    res.render('index', {title: 'WELCOME'})
})

module.exports = router;
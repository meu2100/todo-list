const express = require('express')
const router = express.Router()
const todos = require('./todos')

router.use('/todos', todos)

router.get('/', (req, res) => {
	res.render('index')
})

// 匯出路由器
module.exports = router
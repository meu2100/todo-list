const express = require('express')
const router = express.Router()
const todos = require('./todos')
const users = require('./users')

router.use('/todos', todos)
router.use('/users', users)

router.get('/', (req, res) => {
	res.render('index')
})

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/login", (req, res) => {
  return res.send(req.body);
});

router.post("/logout", (req, res) => {
  return res.send("logout");
});

// 匯出路由器
module.exports = router
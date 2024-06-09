const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

if (process.env.NODE_ENV === 'development') {
	require('dotenv').config()
}

const port = 3000
const router = require('./Routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

app.use(flash())
app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
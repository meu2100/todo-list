const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

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
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

//...

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos, message: req.flash('success') }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos', (req, res) => {
  res.send('get all todos')
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name

  return Todo.create({ name })
  
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/todos')}
    )
    .catch((err) => console.log(err))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('todo', { todos, message: req.flash('success') }))
    .catch((err) => console.log(err))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => {
      res.render('edit', { todo })})
})

app.put('/todos/:id', (req, res) => {
  const { name, isComplete } = req.body
  const id = req.params.id


  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '修改完成')
      res.redirect(`/todos/${id}`)})
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '成功刪除')
      res.redirect('/todos')})
})




app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
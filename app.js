const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res)=> {
  res.send('hello world')
})

app.get('/todos', (req, res) => {
  res.send('get all todos')
})

app.get('/todos/new', (req, res) => {
  res.send('create todo')
})

app.post('/todos', (req, res) => {
  res.send('add todo')
})

app.get('/todos/:id', (req, res) => {
  res.send(`get todo: ${req.params.id}`)
})

app.get('/todos/:id/edit', (req, res) => {
  res.send(`get todo edit: ${req.params.id}`)
})

app.put('/todos/:id', (req, res) => {
  res.send('modify todo')
})

app.delete('/todos/:id', (req, res) => {
  res.send('delete todo')
})


app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
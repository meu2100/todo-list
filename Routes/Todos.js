const express = require('express')
const router = express.Router()
const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  try {
    return Todo.findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.get('/new', (req, res) => {
  try{
    return res.render('new', { error: req.flash('error') })
  }catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.post('/', (req, res) => {
  try {
    const name = req.body.name

    return Todo.create({ name })
      .then(() => {
        req.flash('success', '新增成功!')
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '新增失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '新增失敗:(')
    return res.redirect('back')
  }
})

router.get('/:id', (req, res) => {
  try{
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('todo', { todos, message: req.flash('success') }))
      .catch((err) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => {
        res.render('edit', { todo, error: req.flash('error') })
      })
      .catch((error)=> {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.put('/:id', (req, res) => {
  try{
    const { name, isComplete } = req.body
    const id = req.params.id


    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      .then(() => {
        req.flash('success', '修改完成')
        res.redirect(`/todos/${id}`)
      })
      .catch ((error) =>{
        console.error(error)
        req.flash('error', '資料修改失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id

    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '成功刪除')
        res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料刪除失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '資料刪除失敗')
    return res.redirect('back')
  }
})

module.exports = router
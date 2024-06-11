const express = require('express')
const router = express.Router()
const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const limit = 10

	return Todo.findAll({
		attributes: ['id', 'name', 'isComplete'],
		offset: (page - 1) * limit,
		limit,
		raw: true
	})
		.then((todos) => res.render('todos', { 
			todos,
			prev: page > 1 ? page - 1 : page,
			next: page + 1,
			page
		}))
		.catch((error) => {
			error.errorMessage = '資料取得失敗:('
			next(error)
		})
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => {
	const name = req.body.name

	return Todo.create({ name })
		.then(() => {
			req.flash('success', '新增成功!')
			return res.redirect('/todos')
		})
		.catch((error) => {
			error.errorMessage = '新增失敗:('
			next(error)
		})
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('todo', { todo }))
		.catch((error) => {
			error.errorMessage = '資料取得失敗:('
			next(error)
		})
  })

router.get('/:id/edit', (req, res, next) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todo) => res.render('edit', { todo }))
		.catch((error) => {
			error.errorMessage = '資料取得失敗:('
			next(error)
		})
})

router.put('/:id', (req, res, next) => {
	const { name, isComplete } = req.body
	const id = req.params.id

	return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id }})
		.then(() => {
			req.flash('success', '更新成功!')
			return res.redirect(`/todos/${id}`)
		})
		.catch((error) => {
			error.errorMessage = '更新失敗:('
			next(error)
		})
})

router.delete('/:id', (req, res, next) => {
	const id = req.params.id

	return Todo.destroy({ where: { id }})
		.then(() => {
			req.flash('success', '刪除成功!')
			return res.redirect('/todos')
		})
		.catch((error) => {
			error.errorMessage = '刪除失敗:('
			next(error)
		})
})

module.exports = router
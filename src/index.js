const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		res.status(201).send(user)
	} catch (error) {
		res.status(400).send(error)
	}
})

app.get('/users', (req, res) => {
	User.find({}).then((users) => {
		res.status(302).send(users)
	}).catch((error) => {
		res.status(404).send(error)
	})
})

app.get('/users/:id', (req, res) => {
	const _id = req.params.id
	User.findById(_id).then((user) => {
		if (!user) {
			return res.status(404).send() //if no feedback
		}
		res.status(200).send(user)
	// eslint-disable-next-line no-unused-vars
	}).catch((error) => {
		res.status(500).send()
	})
})

app.post('/tasks', (req, res) => {
	const task = new Task(req.body)
	task.save().then(() => {
		res.status(201).send(task)
	}).catch((e) => {
		res.status(500).send(e)
	})
})

app.get('/tasks', (req, res) => {
	Task.find({}).then((tasks) => {
		res.status(200).send(tasks)
	}).catch((e) => {
		res.status(500).send(e)
	})
})

app.get('/tasks/:id', (req, res) => {
	Task.findById(req.params.id).then((task) => {
		if (!task) {
			return res.status(404).send()
		}
		res.status(200).send(task)
	}).catch((error) => {
		res.status(500).send()
	})
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})


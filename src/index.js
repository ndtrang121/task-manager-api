const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
// 	if(req.method === 'GET'){
// 		res.status(400).send('GET requests are disable')
// 	} else {
// 		next()
// 	}
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

// eslint-disable-next-line no-unused-vars
const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
// 	const task = await Task.findById('62958522c742aaffd8af6529')
// 	await task.populate('owner').execPopulate()
// 	console.log(task.owner)

	const user = await User.findById('62958505c742aaffd8af6523')
	await user.populate('tasks').execPopulate()
	console.log(user.tasks)	
}

main()
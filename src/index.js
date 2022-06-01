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


require('../src/db/mongoose')
const Task = require('../src/models/task')

const deleteTaskAndCount = async (id) => {
	// eslint-disable-next-line no-unused-vars
	const task = await Task.findByIdAndDelete(id)
	const count = await Task.countDocuments({ completed: false })
	return count
}

deleteTaskAndCount('6284bd242c1ae05ea31e3dfd').then((result) => {
	console.log(result)
}).catch((e) => {
	console.log(e)
})
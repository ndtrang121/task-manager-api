require('../src/db/mongoose')
const User = require('../src/models/user')

const updateUserAndCount = async (id, age) => {
	// eslint-disable-next-line no-unused-vars
	const user = await User.findByIdAndUpdate(id, { age })
	const count = await User.countDocuments({ age })
	return count
}

updateUserAndCount('6284b84825e6975ad2a12b3d', 2).then((result) => {
	console.log(result)
}).catch((e) => {
	console.log(e)
})
const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid.')
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0)
				throw new Error('Age must be greater than zero.')
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: [ 6, 'Length must be at least 6 characters.' ],
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Passwords does not contain \'password\'.')
			}
		}
	}
})

module.exports = User
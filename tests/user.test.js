/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
	const response = await request(app).post('/users').send({
		name: 'TrangNguyen',
		email: 'hamhamt1998@gmail.com',
		password: 'duongtrang'
	}).expect(201)

	// Assert that the database was changed correctly
	const user = await User.findById(response._body._id)
	expect(user).not.toBeNull()

	// Assertions about the response
	expect(response._body).toMatchObject({
		name: 'TrangNguyen',
		email: 'hamhamt1998@gmail.com',
	})
	expect(user.password).not.toBe('duongtrang')

})

test('Should login an existing user', async () => {
	const response = await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)

	// Assert that token in response matches users second token
	const user = await User.findById(userOneId)
	expect(response._body.token).toBe(user.tokens[1].token)
})

test('Should not login none existent user', async () => {
	await request(app).post('/users/login').send({
		email: 'Nick',
		password: 'Thisisnotmypass'
	}).expect(400)

})

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Should delete account for user', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401)
})

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
	const newName = 'NewName'
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: newName
		})
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.name).toBe(newName)
})

test('Should not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'NewYork'
		})
		.expect(404)
})
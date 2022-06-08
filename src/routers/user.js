const User = require('../models/user')
const express = require('express')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()


router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)
		res.status(201).send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		if(!user){
			res.status(404).send()
		}
		res.send({ user, token })
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})

		await req.user.save()
		res.send()
	} catch (error) {
		res.status(400).send(error)
	}
})

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send()
	} catch (error) {
		res.status(500).send(error)
	}
})

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = [ 'name', 'email', 'password', 'age' ]
	const isValidOperation = updates.every(update => allowedUpdates.includes(update))

	if(!isValidOperation) {
		return res.status(404).send({ error: 'Invalid updates!' })
	}

	try {
		const user = req.user
		updates.forEach((update) => user[update] = req.body[update])
		await user.save()
		
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/users/me', auth ,async (req, res) => {
	try {

		await req.user.remove()
		sendCancellationEmail(req.user.email, req.user.name)
		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}
})

const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload an image'))
		}

		cb(undefined, true)
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	res.send()
// eslint-disable-next-line no-unused-vars
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (!user || !user.avatar) {
			throw new Error()
		}
		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	} catch (error) {
		res.status(404).send()
	}
})

module.exports = router
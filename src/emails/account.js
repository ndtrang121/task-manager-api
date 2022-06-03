const mailjet = require ('node-mailjet')

const mail = mailjet.connect(process.env.API_KEY_PUBLIC, process.env.API_KEY_PRIVATE).post('send', { 'version': 'v3.1' })

const sendWelcomeEmail = (email, name) => {
	mail.request({
		'Messages':[
			{
				'From': {
					'Email': 'ndtrang129@gmail.com',
					'Name': 'Nguyen'
				},
				'To': [
					{
						'Email': email,
						'Name': name 
					}
				],
				'Subject': 'Thanks for joining in!',
				'HTMLPart': `<h3>Welcome to the app, ${name}!.</h3><br />Let me know how you get along with the app.`
			}
		]
	})
}

const sendCancellationEmail = (email, name) => {
	mail.request({
		'Messages':[
			{
				'From': {
					'Email': 'ndtrang129@gmail.com',
					'Name': 'Nguyen'
				},
				'To': [
					{
						'Email': email,
						'Name': name
					}
				],
				'Subject': 'Sorry to see you go!',
				'HTMLPart': `<h3>Good bye, ${name}!.</h3><br />I hope to see you back sometime soon`
			}
		]
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}
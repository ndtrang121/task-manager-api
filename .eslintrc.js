module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'array-bracket-spacing': [ 
			'error', 
			'always' 
		],
		'object-curly-spacing': [ 
			'error', 
			'always' 
		],
		'space-in-parens': [ 
			'error', 
			'never' 
		]
	}
}

module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['standard-with-typescript', 'plugin:n/recommended', 'plugin:import/recommended', 'plugin:promise/recommended'],
	overrides: [
		{
			files: ['*.ts'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
	},
	rules: {
		'@typescript-eslint/prefer-nullish-coalescing': 'off',
	},
}

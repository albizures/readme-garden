module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
	ignorePatterns: ['dist/*'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'prefer-const': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
	},
};

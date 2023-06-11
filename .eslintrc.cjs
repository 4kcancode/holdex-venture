module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint', 'prefer-arrow-functions'],
	// ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		'svelte3/ignore-warnings': (warning) => {
			return warning.code === 'unused-export-let';
		},
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'comma-dangle': 'off',
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		// 'import/no-duplicates': ['off', {}], // warnings such as duplicate imports in module and source in the same file are to be ignored,
		curly: ['error', 'multi-line'],
		'prefer-arrow-functions/prefer-arrow-functions': [
			'warn',
			{
				classPropertiesAllowed: false,
				disallowPrototype: false,
				returnStyle: 'unchanged',
				singleReturnOnly: false,
			},
		],
	},
};

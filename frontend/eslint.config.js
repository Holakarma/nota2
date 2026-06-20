import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
	{ ignores: ['dist'] },
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		settings: { react: { version: '18.3' } },
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: prettierPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			'react/jsx-no-target-blank': 'off',
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/prop-types': 'off',
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
		},
	},
];

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactQueryPlugin from '@tanstack/eslint-plugin-query';

export default tseslint.config(
    { ignores: ['dist', 'src/shadcn'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierPlugin],
        files: ['**/*.{ts,tsx}', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@tanstack/query': reactQueryPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            // My own rules
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            semi: ['error', 'always'],
            'prefer-const': 'error',
            // 'max-len': ['error', { code: 120 }], // disable because of Tailwind
            'jsx-quotes': ['error', 'prefer-single'],
        },
    }
);

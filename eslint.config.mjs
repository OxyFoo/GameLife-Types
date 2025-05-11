import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: globals.browser } },

    // Configuration ESLint
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,

    {
        plugins: {
            prettier: prettier
        },
        rules: {
            semi: ['warn', 'always'],
            quotes: [
                'warn',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            'jsx-quotes': ['warn', 'prefer-single'],
            'comma-dangle': ['warn', 'never'],
            'eol-last': ['warn', 'always'],
            'dot-notation': 'off',
            'no-bitwise': 'off',
            curly: ['warn', 'multi-line'],
            'max-len': [
                'error',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true
                }
            ],
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                    parser: 'flow',
                    tabWidth: 4,
                    jsxSingleQuote: true,
                    avoidEscape: true,
                    trailingComma: 'none',
                    printWidth: 120
                }
            ]
        }
    }
];

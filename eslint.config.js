import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin-ts';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'dist-ssr/**',
      '*.local',
      '.vscode/**',
      '.idea/**',
      '.DS_Store',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?',
      '.env',
      '.env.*',
      '!.env.example',
      '*.tsbuildinfo',
      'coverage/**',
      'build/**',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  
  js.configs.recommended,

    {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        // Browser globals
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLMediaElement: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        Audio: 'readonly',
        Event: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      '@stylistic/ts': stylistic,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': ['warn', 'never'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'props|emits' }],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      
      '@stylistic/ts/type-annotation-spacing': [
        'warn',
        {
          after: true,
        },
      ],
      
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': [0, { code: 80 }],
      'eol-last': ['error', 'always'],
      'no-tabs': 'error',
      'wrap-iife': ['error', 'inside'],
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': [1, { beforeColon: false, afterColon: true }],
      'keyword-spacing': [1, { before: true, after: true }],
      'block-spacing': [1, 'always'],
      'space-before-blocks': [1, 'always'],
      'arrow-spacing': [1, { before: true, after: true }],
      'space-infix-ops': [1, { int32Hint: false }],
      'semi-spacing': [1, { before: false, after: true }],
      'no-unused-vars': 'off', 
    },
  },
  
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLMediaElement: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        Audio: 'readonly',
        Event: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@stylistic/ts': stylistic,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'props|emits|page' }],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      
      '@stylistic/ts/type-annotation-spacing': [
        'warn',
        {
          after: true,
        },
      ],
      
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': [0, { code: 80 }],
      'eol-last': ['error', 'always'],
      'no-tabs': 'error',
      'wrap-iife': ['error', 'inside'],
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': [1, { beforeColon: false, afterColon: true }],
      'keyword-spacing': [1, { before: true, after: true }],
      'block-spacing': [1, 'always'],
      'space-before-blocks': [1, 'always'],
      'arrow-spacing': [1, { before: true, after: true }],
      'space-infix-ops': [1, { int32Hint: false }],
      'semi-spacing': [1, { before: false, after: true }],
      'no-unused-vars': 'off', 
    },
  },
  
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLMediaElement: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        Audio: 'readonly',
        Event: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': [0, { code: 80 }],
      'eol-last': ['error', 'always'],
      'no-tabs': 'error',
      'wrap-iife': ['error', 'inside'],
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': [1, { beforeColon: false, afterColon: true }],
      'keyword-spacing': [1, { before: true, after: true }],
      'block-spacing': [1, 'always'],
      'space-before-blocks': [1, 'always'],
      'arrow-spacing': [1, { before: true, after: true }],
      'space-infix-ops': [1, { int32Hint: false }],
      'semi-spacing': [1, { before: false, after: true }],
    },
  },
  
  {
    files: ['**/*.config.*', 'tests/setup.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLMediaElement: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        Audio: 'readonly',
        Event: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
]; 

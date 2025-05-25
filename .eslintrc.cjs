module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@stylistic/ts', 'vue', '@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
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
    'vue/script-setup-uses-vars': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'props|emits' }],
    'tailwindcss/no-custom-classname': 'off',
    'key-spacing': [1, { beforeColon: false, afterColon: true }],
    'keyword-spacing': [1, { before: true, after: true }],
    'block-spacing': [1, 'always'],
    'space-before-blocks': [1, 'always'],
    'arrow-spacing': [1, { before: true, after: true }],
    'space-infix-ops': [1, { int32Hint: false }],
    'semi-spacing': [1, { before: false, after: true }],
    'vue/multi-word-component-names': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/block-tag-newline': [
      'error',
      { singleline: 'always', multiline: 'always', maxEmptyLines: 0 },
    ],
    'vue/attribute-hyphenation': ['warn', 'never'],
    'vue/custom-event-name-casing': ['warn', 'camelCase'],
    'vue/v-on-event-hyphenation': ['warn', 'never', { autofix: true }],
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
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        fixToUnknown: false,
        ignoreRestArgs: true,
      },
    ],
  },
};

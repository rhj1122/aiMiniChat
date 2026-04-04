import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

// ─────────────────────────────────────────────────────────────
// 自定义 Harness 架构规则（10.3 节填充）
// import noApiInComponents from './eslint-rules/no-api-in-components.js'
// import noStoreInPages from './eslint-rules/no-store-in-pages.js'
// import noAiSdkInComponents from './eslint-rules/no-ai-sdk-in-components.js'
// ─────────────────────────────────────────────────────────────

export default [
  // 忽略文件（ESLint v10 用 ignores，不用 .eslintignore）
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // 基础规则
  js.configs.recommended,

  // TypeScript 规则
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // React 规则（@eslint-react/eslint-plugin 支持 ESLint v10 flat config）
  {
    files: ['src/**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended-type-checked'],
  },

  // React Hooks 规则
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // Harness 自定义架构规则（10.3 节解注释并填充）
  // {
  //   files: ['src/**/*.{ts,tsx}'],
  //   plugins: {
  //     harness: {
  //       rules: {
  //         'no-api-in-components': noApiInComponents,
  //         'no-store-in-pages': noStoreInPages,
  //         'no-ai-sdk-in-components': noAiSdkInComponents,
  //       },
  //     },
  //   },
  //   rules: {
  //     'harness/no-api-in-components': 'error',
  //     'harness/no-store-in-pages': 'error',
  //     'harness/no-ai-sdk-in-components': 'error',
  //   },
  // },
  // ─────────────────────────────────────────────────────────────
]

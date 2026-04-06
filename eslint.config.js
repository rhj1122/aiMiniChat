import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

// ─────────────────────────────────────────────────────────────
// 自定义 Harness 架构规则
import noNetworkInComponents from './eslint-rules/no-network-in-components.js'
import noStoreInPages from './eslint-rules/no-store-in-pages.js'
import noStoreInUtils from './eslint-rules/no-store-in-utils.js'
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

  // 测试文件：注入 Vitest 全局变量（vi、describe、test、expect 等）
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}', 'src/test/**/*.ts'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        process: 'readonly',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────
  // Harness 自定义架构规则
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      harness: {
        rules: {
          'no-network-in-components': noNetworkInComponents,
          'no-store-in-pages': noStoreInPages,
          'no-store-in-utils': noStoreInUtils,
        },
      },
    },
    rules: {
      'harness/no-network-in-components': 'error',
      'harness/no-store-in-pages': 'error',
      'harness/no-store-in-utils': 'error',
    },
  },
  // ─────────────────────────────────────────────────────────────
]

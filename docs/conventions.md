# 编码规范

---

## 命名规范

### 文件命名
- 组件文件：PascalCase → `ChatPage.tsx`、`MessageBubble.tsx`
- Hook 文件：camelCase，以 use 开头 → `useAiChat.ts`、`useAppInit.ts`
- Store 文件：camelCase，以 Store 结尾 → `chatStore.ts`、`configStore.ts`
- API 文件：camelCase，以 Api 结尾 → `commonApi.ts`、`aiApi.ts`
- 工具函数文件：camelCase → `request.ts`、`formatDate.ts`
- 测试文件：与被测文件同名，加 `.test` 后缀 → `chatStore.test.ts`

### 变量/函数命名
- 变量和函数：camelCase → `sendMessage`、`isLoading`
- 组件：PascalCase → `ChatPage`、`MessageBubble`
- 常量：UPPER_SNAKE_CASE 或 PascalCase 对象 → `MESSAGE_MAX_LENGTH`、`QA_STATUS`
- 类型/接口：PascalCase → `Message`、`ApiResponse`

### 缩写词规则
- 缩写词（AI、ID、URL、HTTP 等）在命名中视为普通单词，只首字母大写
- `useAiChat`（不是 `useAIChat`）、`userId`（不是 `userID`）、`getHttpClient`（不是 `getHTTPClient`）

---

## 代码格式（Prettier）

项目使用 Prettier 自动格式化，配置如下：

```
有分号（semi: true）
单引号（singleQuote: true）
2 空格缩进（tabWidth: 2）
尾逗号 es5（trailingComma: "es5"）
行宽 100（printWidth: 100）
箭头函数省略括号（arrowParens: "avoid"）
```

运行 `pnpm format` 自动格式化，`pnpm format:check` 检查格式。

---

## 类型规范

- 所有 `type`、`interface`、`enum` 定义集中在 `src/types/` 目录
- 唯一例外：Zustand Store 的 interface（如 `interface ChatStore`）可以在 Store 文件内定义
- 优先使用 `interface`，需要联合类型或工具类型时用 `type`
- 禁止使用 `any`（ESLint 会 warn），用 `unknown` 替代
- import 类型时使用 `import type` 语法

```typescript
// ✅ 正确
import type { Message } from '@/types'

// ❌ 错误
import { Message } from '@/types'  // ESLint: consistent-type-imports
```

---

## 组件规范

- 使用函数式组件，不使用 class 组件
- 组件文件只负责渲染，业务逻辑放在 Hooks 层
- 组件 props 超过 5 个时，用 interface 定义并考虑拆分
- 组件文件不超过 150 行，超过则拆分

---

## Hook 规范

- 文件名以 `use` 开头
- 只返回数据和方法，不返回 JSX
- 一个 Hook 只做一件事，名称能清晰描述功能
- 返回值用对象解构（不用数组解构，除非是 useState 风格的配对）

---

## Store 规范

- 只存储需要跨组件共享的状态，局部状态用 `useState`
- Store 文件内只允许定义 Store 自身的 interface
- action 命名用动词（`addMessage`、`clearMessages`），state 命名用名词（`messages`、`isLoaded`）
- Pages/Components 可以读取 Store，但写入操作必须封装在 Hooks 层

---

## API 层规范

- 只做请求/响应转换，不包含业务判断逻辑
- 所有网络请求使用 `src/utils/request.ts` 封装的方法（`get`/`post`/`put`/`del`）
- API 函数必须有明确的 TypeScript 返回类型
- 文件名以 Api 结尾：`commonApi.ts`、`chatApi.ts`

---

## 测试规范

- 测试文件与被测文件同目录，文件名加 `.test` 后缀
- 测试描述用中文，清晰描述"做了什么 + 应该怎样"
- 每个 `describe` 的 `beforeEach` 里重置状态
- 测试 Store 更新方法时，预置多条数据，用业务 ID 查找断言
- Mock API 调用，不发真实网络请求
- `pnpm test:run` 默认屏蔽 console 输出

---

## 路径别名

使用 `@/` 指向 `src/` 目录：

```typescript
// ✅ 正确
import type { Message } from '@/types'
import { useChatStore } from '@/store/chatStore'

// ❌ 错误
import type { Message } from '../../types'
import { useChatStore } from '../store/chatStore'
```

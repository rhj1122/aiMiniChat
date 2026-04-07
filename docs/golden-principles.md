# 黄金原则

---

## 命名类

### GP-N01：缩写词在命名中视为普通单词，只首字母大写

**规则：** AI、ID、URL、HTTP 等缩写词出现在 camelCase 或 PascalCase 命名中时，只首字母大写，其余小写。

**为什么：** 保持命名风格一致。如果缩写词全大写，会出现 `getHTTPSURL`、`userIDList` 这种难以阅读的命名，也会导致 Agent 生成的代码风格不统一。

**反例：**
```
❌ useAIChat      → ✅ useAiChat
❌ AIProvider     → ✅ AiProvider
❌ chatIDList     → ✅ chatIdList
❌ getHTTPClient  → ✅ getHttpClient
❌ parseURLParams → ✅ parseUrlParams
❌ userID         → ✅ userId
```

**适用范围：** 文件名、变量名、函数名、类名、接口名、类型名。

---

## 架构类

### GP-A01：类型定义必须集中在 src/types/ 目录

**规则：** 所有 `type`、`interface`、`enum` 定义必须放在 `src/types/` 目录下。其他层的文件禁止定义可导出的类型（Store 内部的 interface 如 `ChatStore` 除外，因为它只在文件内部使用）。

**为什么：** 类型散落在各层会导致：类型重复定义、import 路径混乱、Agent 不知道类型定义在哪里。集中管理让所有层都从同一个地方 import 类型，保持一致性。

**反例：**
```typescript
// ❌ 错误：在 Store 层定义可导出的类型
// src/store/chatStore.ts
export type AnswerUpdatableFields = Partial<Pick<Answer, 'content' | 'status'>>

// ✅ 正确：类型定义放在 Types 层
// src/types/index.ts
export type AnswerUpdatableFields = Partial<Pick<Answer, 'content' | 'status'>>

// src/store/chatStore.ts
import type { AnswerUpdatableFields } from '@/types'
```

**例外：** Store 内部的 interface（如 `interface ChatStore { ... }`）不需要移到 types/，因为它只描述这个 Store 自身的结构，不会被其他文件 import。

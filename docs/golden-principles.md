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

**规则：** 所有 `type`、`interface`、`enum` 定义必须放在 `src/types/` 目录下。其他层的文件禁止定义任何类型。唯一例外是 Zustand Store 的 `create` 所需的 Store interface（如 `interface ChatStore { ... }`），因为它是 Zustand 的固定用法，只描述 Store 自身结构。

**为什么：** 类型散落在各层会导致：类型重复定义、import 路径混乱、Agent 不知道类型定义在哪里。集中管理让所有层都从同一个地方 import 类型，保持一致性。

**反例：**
```typescript
// ❌ 错误：在 Store 层定义业务类型
// src/store/chatStore.ts
type AnyRecord = Record<string, unknown>
type AnswerUpdatableFields = Partial<Pick<Answer, 'content' | 'status'>>

// ✅ 正确：业务类型放在 Types 层
// src/types/index.ts
export type AnyRecord = Record<string, unknown>

// src/store/chatStore.ts
import type { AnyRecord } from '@/types'

// ✅ 例外：Zustand Store 的 interface 可以在 Store 文件里定义
// src/store/chatStore.ts
interface ChatStore {    // 这是 create<ChatStore>() 需要的，允许
  messages: Message[]
  addMessage: (message: Message) => void
}
```

---

## 测试类

### GP-T01：测试 Store 更新方法时，必须预置多条数据验证索引正确性

**规则：** 测试 Store 的查询/更新方法时，不能只预置一条数据用 `messages[0]` 断言。必须预置多条数据（不同 ID），用业务 ID 查找目标来断言，同时验证非目标数据不受影响。

**为什么：** 只有一条数据时，`messages[0]` 永远命中，无法验证 qaId/messageId 的匹配逻辑是否正确。多条数据才能暴露索引错误。

**反例：**
```typescript
// ❌ 错误：只有一条数据，用下标访问
useChatStore.getState().addMessage(createMockMessage({ qaId: 'qa-1' }))
useChatStore.getState().updateMessage('qa-1', 'a-1', { status: 6 })
const answer = useChatStore.getState().messages[0].answers[0]  // 永远命中
expect(answer.status).toBe(6)

// ✅ 正确：预置多条数据，用 ID 查找，验证隔离性
useChatStore.getState().addMessage(createMockMessage('qa-1', 'q-1', ['a-1', 'a-2']))
useChatStore.getState().addMessage(createMockMessage('qa-2', 'q-2', ['a-3', 'a-4']))

useChatStore.getState().updateMessage('qa-1', 'a-2', { status: 6 })

// 目标被更新
expect(findAnswer('qa-1', 'a-2')?.status).toBe(6)
// 同 qa 的其他 answer 不受影响
expect(findAnswer('qa-1', 'a-1')?.status).toBe(3)
// 其他 qa 不受影响
expect(findAnswer('qa-2', 'a-3')?.status).toBe(3)
```

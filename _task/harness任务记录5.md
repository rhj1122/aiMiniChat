## 大型任务：重构chatStore

### 目标
将chatStore修改为契合目标数据结构的逻辑

### 位置
- /src/store/chatStore.ts

### 功能描述
现在的chatStore设计并不符合需求，需要修改为契合目标数据结构的逻辑。
messages数组依旧存在，但是message对象的一个实例如下：

``` typescript
const Message = {
  qaId: 'UUID',
  question: {
    messageId: 'UUID',
    createTime: Date.now(),
    sessionId: 'UUID',
    moduleType: 'main',
    content: '用户输入的文本',
    attachments: [],
    requestIdList: ['answers数组中每个answer的requestId'],
    ext: {},
  },
  answers: [
    {
      messageId: 'UUID',
      createTime: Date.now(),
      sessionId: 'UUID',
      moduleType: 'main',
      content: '大模型返回的文本更新到这里',
      contentAssets: [],
      status: 3,
      likeStatus: 0,
      requestId: 'UUID',
      ext: {},
    }
  ],
  answerActiveIndex: 0,
  fromHistory: false,
}

```

并且chatStore中需要提供，addMessage、updateMessage(指定qaId和messageId更新)、clearMessages等方法。updateMessage要支持指定某个字段进行更新，例如更新content、status、likeStatus等。不需要setLoading和isLoading。
同时要更新类型定义，类型定义在/src/types/index.ts。需要更新Message的类型定义。
同时要更新测试文件，测试文件在/src/store/chatStore.test.ts。

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考


---------------------------------------------------


# 以下为本次任务执行后的总结

## 踩过的坑

### 坑一：类型定义散落在 Store 层
Agent 在 chatStore.ts 里定义了 `type AnswerUpdatableFields` 和 `type AnyRecord`，违反了"类型定义必须集中在 src/types/"的架构规则。被纠正了两次才彻底修好。

### 坑二：Store 内部出现复杂的类型体操
Agent 写了 `Partial<Pick<import('@/types').Answer, 'content' | 'status' | ...>>` 这种内联 import 类型的写法，可读性极差。应该在 types/ 层定义好类型，Store 层直接 import 使用。

### 坑三：updateMessage 的 API 设计经历了三次重构
- 第一版：固定字段更新（只能更新 answer 的 5 个字段，不支持 question）
- 第二版：updater 函数（调用方传入更新逻辑）→ 用户觉得不好用
- 第三版：对象入参 + 内部 updater 分发（当前版本）

根因：任务描述没有明确说清楚 updateMessage 的使用场景和调用方式。

### 坑四：测试用例没有验证索引正确性
测试里用 `messages[0].answers[0]` 获取数据来断言，只能验证"函数是否生效"，不能验证"是否更新了正确的目标"。应该预置多条数据，用 qaId + messageId 查找目标来断言。

### 坑五：TypeScript 类型断言反复报错
`applyFields` 函数需要把 `Question`/`Answer` 当作 `Record<string, unknown>` 处理，TypeScript 不允许直接转换，需要 `as unknown as AnyRecord` 双重断言。来回修了三次。

### 坑六：缩写词命名不一致
Agent 生成的文件名用了 `useAIChat`、`AIProvider`（AI 全大写），不符合项目的 camelCase/PascalCase 规范。应该是 `useAiChat`、`AiProvider`。

---

## 得到的总结

1. **类型定义必须集中管理**：Store 层唯一允许的类型定义是 Zustand `create` 接受的 Store interface（如 `interface ChatStore`），其他所有 type/interface/enum 必须放 src/types/
2. **测试要验证索引正确性**：预置多条数据，用业务 ID 查找目标断言，确保只有目标被修改、其他数据不受影响
3. **任务描述要写清楚 API 的调用方式**：不能只说"支持更新某些字段"，要给出具体的调用示例，避免 Agent 反复猜测设计

---

## 更新的 Harness 规则

| 更新内容 | 更新到哪里 |
|---------|-----------|
| Store 层唯一允许的类型定义是 Store interface | 黄金原则 GP-A01 更新 |
| 所有层禁止定义 type/interface/enum（ESLint 机械检测）| ESLint 规则 `no-type-outside-types` |
| 测试 Store 更新方法时必须预置多条数据验证索引 | 黄金原则 GP-T01 新增 |

---

## 任务描述的不足

原始任务描述的问题：
1. **没有说明 updateMessage 需要支持 question 的更新**：只提到了"指定 qaId 和 messageId 更新"，但没有明确说 messageId 可以是 question 的 messageId
2. **没有给出 updateMessage 的调用示例**：只说了"支持指定某个字段进行更新"，没有说调用方式是传对象还是传函数
3. **没有说明 ext 字段的特殊更新方式**：ext 是嵌套对象，需要 `ext.xxx` 的方式更新，但任务描述里没有提到
4. **没有说明 updater 的设计要求**：内部分发逻辑、switch 结构、defaultUpdater/extUpdater 的设计都是后续补充的

---

## 反推的理想任务描述

如果任务描述写成以下这样，应该可以一次就做好：

```markdown
## 任务：重构 chatStore

### 目标
将 chatStore 修改为契合目标数据结构的逻辑

### 位置
- /src/types/index.ts（更新 Message 类型定义）
- /src/store/chatStore.ts（重写 Store）
- /src/store/chatStore.test.ts（重写测试）

### 数据结构
Message 对象结构见下方 TypeScript 定义（省略，同原始描述）

### Store 方法设计

#### addMessage(message: Message)
添加一条完整的 Message 到 messages 数组末尾。

#### updateMessage(qaId: string, messageId: string, fields: Record<string, unknown>)
通过 qaId 定位 Message，再通过 messageId 匹配 question 或 answers 中的某一项，然后按 fields 对象的 key-value 逐个更新字段。

messageId 匹配逻辑：
- 如果 messageId === question.messageId → 更新 question 的字段
- 如果 messageId === answers[n].messageId → 更新该 answer 的字段

字段更新逻辑（内部 updater 分发）：
- 普通字段（如 content、status、likeStatus）：直接赋值，使用 defaultUpdater
- ext 下的字段（如 ext.source、ext.model）：key 以 "ext." 开头时，更新 target.ext[xxx]，使用 extUpdater
- 用 switch 或条件判断选择 updater，default 使用 defaultUpdater

调用示例：
  updateMessage('qa-1', 'a-1', { content: '新内容', status: 6 })
  updateMessage('qa-1', 'a-1', { 'ext.source': 'web' })
  updateMessage('qa-1', 'q-1', { content: '修改后的问题' })

#### clearMessages()
清空 messages 数组。

### 约束
- 所有 type/interface 定义放在 src/types/index.ts，Store 文件里只允许定义 Store 自身的 interface
- 按照 AGENTS.md 和 docs/ 文档内容进行约束

### 测试要求
- 预置多条 Message 数据（不同 qaId，每条有多个 answer）
- 用 qaId + messageId 查找目标来断言，不要用 messages[0].answers[0]
- 验证更新只影响目标数据，其他数据不受影响

### 验证
运行：pnpm check && pnpm test:run
期望：全部通过
```

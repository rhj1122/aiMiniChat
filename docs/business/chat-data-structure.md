# Chat 数据结构说明

> 本文档描述 AI 对话功能的完整数据流：上行消息格式、下行消息格式、Store 数据结构及字段含义。
> Agent 在实现 Chat 相关功能时，必须先阅读本文档。

---

## 一、Store 数据结构（src/store/chatStore.ts）

Store 中的 `messages` 是一个 `Message[]` 数组，每条 `Message` 代表一次完整的问答对（QA）。

### Message 结构

```typescript
{
  qaId: string;           // 本次问答对的唯一 ID（UUID）
  question: Question;     // 用户发送的问题
  answers: Answer[];      // 大模型的回答列表（当前只用 answers[0]，数组为后续扩展预留）
  answerActiveIndex: 0;   // 当前展示的 answer 索引，固定为 0
  fromHistory: boolean;   // 是否来自历史记录
}
```

### Question 结构

```typescript
{
  messageId: string;       // 本条消息的唯一 ID（UUID）
  createTime: number;      // 创建时间戳（Date.now()）
  sessionId: string;       // 会话 ID（UUID，与 answer 的 sessionId 相同）
  moduleType: string;      // 模块类型，固定为 'main'
  content: string;         // 用户输入的文本内容
  attachments: unknown[];  // 附件列表（当前为空数组）
  requestIdList: string[]; // 对应 answers 数组中每个 answer 的 requestId
  ext: Record<string, unknown>; // 扩展字段
}
```

### Answer 结构

```typescript
{
  messageId: string;        // 本条消息的唯一 ID（UUID）
  createTime: number;       // 创建时间戳
  sessionId: string;        // 会话 ID（与 question 的 sessionId 相同）
  moduleType: string;       // 模块类型，固定为 'main'
  content: string;          // 大模型返回的文本（流式追加，初始为空字符串）
  contentAssets: unknown[]; // 内容资产（图片、文件等，当前为空数组）
  status: number;           // 回答状态（见下方状态码说明）
  likeStatus: number;       // 点赞状态：0=未操作，1=点赞，-1=踩
  requestId: string;        // 本次请求的唯一 ID（UUID）
  ext: Record<string, unknown>; // 扩展字段
}
```

### Answer 状态码（src/types/index.ts 中的 QA_STATUS）

```typescript
QA_STATUS = {
  analyzing: 3,   // 分析中（初始状态）
  thinking: 4,    // 思考中
  replying: 5,    // 回复中（流式输出阶段）
  finished: 6,    // 已完成
}
```

---

## 二、上行消息格式（发送给 WS 服务端）

通过 `src/api/asGateway.ts` 的 `sendMessage()` 发送，消息类型为 `WsMessage`。

```json
{
  "id": "uuid",
  "type": "query",
  "timestamp": "1750754721021",
  "header": {
    "sn": "设备序列号",
    "mt": "设备型号",
    "user_id": "用户ID",
    "app_id": "应用ID",
    "app_version": "应用版本",
    "device_id": "设备ID",
    "session_id": "会话ID（UUID，每次发送消息生成，用于匹配响应回调）",
    "request_id": "请求ID（UUID，对应 answer.requestId）",
    "resource_id": "main"
  },
  "data": {
    "text": "用户输入的文本",
    "attachments": []
  },
  "source": { "type": "user", "id": "user_id" },
  "target": { "type": "agent", "id": "agent_id" },
  "extend": {}
}
```

**关键字段说明：**
- `header.session_id`：每次发送消息时生成的新 UUID，用于在 WsManager 中注册回调，确保响应只分发给对应的处理函数
- `header.request_id`：对应 Store 中 `answer.requestId` 和 `question.requestIdList[0]`

---

## 三、下行消息格式（从 WS 服务端接收）

通过 `src/api/asGateway.ts` 注册的回调函数接收，消息类型同为 `WsMessage`。

```json
{
  "id": "uuid",
  "type": "task_output",
  "timestamp": "1750754721021",
  "header": {
    "session_id": "与上行消息相同的会话ID（用于路由到对应回调）",
    "request_id": "与上行消息相同的请求ID",
    ...
  },
  "data": {
    "content": "大模型流式输出的文本片段（追加到 answer.content）",
    "isEnd": true
  },
  "source": { "type": "agent", "id": "agent_id" },
  "target": { "type": "user", "id": "user_id" },
  "extend": {}
}
```

**关键字段说明：**
- `data.content`：流式文本片段，每次收到后追加（`+=`）到 Store 中对应 answer 的 `content` 字段
- `data.isEnd`：为 `true` 时表示本次回答结束，此时注销 session_id 对应的回调

---

## 四、完整数据流

```
用户输入文本
    ↓
useChat.send(content)
    ↓
1. 生成 qaId、sessionId、requestId、questionMessageId、answerMessageId
2. chatStore.addMessage()  ← 添加初始 Message（answer.content 为空，status=3）
3. asGateway.registerCallback(sessionId, handleResponse)  ← 注册响应回调
4. asGateway.sendMessage(wsMessage)  ← 发送上行消息
    ↓
WS 服务端流式返回
    ↓
handleResponse(msg) 被触发（每次收到一个文本片段）
    ↓
chatStore.updateMessage(qaId, answerMessageId, { content: msg.data.content })
← content 字段使用 appendTextUpdate（+=），实现流式追加
    ↓
msg.data.isEnd === true 时：
  chatStore.updateMessage(qaId, answerMessageId, { status: 6 })
  asGateway.unregisterCallback(sessionId)
    ↓
Chat 组件订阅 chatStore，实时重渲染，实现流式输出效果
```

---

## 五、Store 更新方法说明（src/store/chatStore.ts）

### updateMessage(qaId, messageId, fields)

通过 `qaId` 定位 Message，再通过 `messageId` 匹配 question 或 answer，按 `fields` 更新字段。

**字段更新规则（getUpdatedData 函数）：**

| key | 更新方式 | 说明 |
|-----|---------|------|
| `content` | 追加（`+=`） | 流式文本追加，不覆盖 |
| `setContent` | 覆盖 | 直接替换 content 字段 |
| `ext.xxx` | 更新 ext 子字段 | 更新 answer.ext 或 question.ext 下的指定字段 |
| 其他字段 | 覆盖 | 直接赋值（status、likeStatus 等）|

**调用示例：**
```typescript
// 追加流式文本
updateMessage(qaId, answerMessageId, { content: '新的文本片段' })

// 替换全部内容
updateMessage(qaId, answerMessageId, { setContent: '完整内容' })

// 更新状态
updateMessage(qaId, answerMessageId, { status: 6 })

// 更新 question 内容
updateMessage(qaId, questionMessageId, { content: '修改后的问题' })

// 更新 ext 字段
updateMessage(qaId, answerMessageId, { 'ext.source': 'web' })
```

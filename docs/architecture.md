# 系统架构

## 分层结构

```
Types → Config → API → Store → Hooks → Components → Pages
```

依赖方向：**只能向下**。每一层只能依赖比自己更底层的层，不能向上依赖。

**特殊层：**
- `utils/`：纯工具函数，无副作用，任何层都可以依赖，但 utils 本身不能依赖 Store、Hooks 层
- `types/`：类型定义 + 业务常量，任何层都可以依赖

---

## 各层职责

| 层级 | 目录 | 职责 | 约束 |
|------|------|------|------|
| Types | `src/types/` | 纯 TypeScript 类型定义 + 业务常量 | 不能 import 任何其他层 |
| Utils | `src/utils/` | 纯工具函数（formatDate、request.js 等）| 不能 import Store、Hooks 层 |
| Config | `src/config/` | 读取环境变量（`import.meta.env`） | 只能依赖 Types |
| API | `src/api/` | 封装所有网络请求（HTTP、WebSocket）| 只能依赖 Types、Config |
| Store | `src/store/` | Zustand 全局状态管理 | 只能依赖 Types、API |
| Hooks | `src/hooks/` | 业务逻辑，连接 Store 和 API | 只能依赖 Store、API、Types |
| Components | `src/components/` | 可复用 UI 组件 | 可读取 Store，可依赖 Hooks、Types。禁止写入 Store、禁止直接发网络请求 |
| Pages | `src/pages/` | 页面，路由入口 | 可读取 Store，可依赖 Components、Hooks。禁止写入 Store、禁止直接发网络请求 |

**注意：** Types 是最底层，所有层都可以依赖它，这是正常的向下依赖。

---

## 层级约束

### 禁止的依赖

```
❌ utils/ 层 import Store 层或 Hooks 层
   → utils 只能是纯工具函数，需要访问状态的逻辑应放在 src/hooks/

❌ Components 层直接发起网络请求（fetch、WebSocket、axios、request）
   → 必须在 src/hooks/ 中封装逻辑，Components 通过 Hooks 访问数据

❌ Pages/Components 层直接写入 Store（调用 setState、set 等写入方法）
   → 写入操作必须封装在 Hooks 层，Pages/Components 可以读取 Store

❌ Hooks 层返回 JSX 元素
   → Hooks 只返回数据和方法

❌ Types 层 import 任何其他层
   → Types 是最底层，无任何依赖

❌ API 层包含业务判断逻辑
   → 业务逻辑在 Hooks 层，API 层只做请求/响应转换

❌ Config 层包含业务常量
   → 业务常量放在 Types 层，Config 只读取环境变量
```

### 典型违规示例

```typescript
// ❌ 错误：Component 层直接发 WebSocket 请求
function ChatMessage() {
  useEffect(() => {
    const ws = new WebSocket('ws://...')  // 违规！
  }, [])
}

// ✅ 正确：通过 Hook 访问
function ChatMessage() {
  const { messages } = useAIChat()  // Hook 内部处理 WebSocket
}
```

```typescript
// ❌ 错误：Page 层直接写入 Store
function ChatPage() {
  const addMessage = useChatStore(s => s.addMessage)  // 违规！写入操作
  addMessage(...)
}

// ✅ 正确：Page 层读取 Store
function ChatPage() {
  const config = useConfigStore(s => s.config)  // 允许，只是读取
  console.log(config)
}

// ✅ 正确：写入操作通过 Hook
function ChatPage() {
  const { sendMessage } = useAiChat()  // Hook 内部封装写入操作
}
```

---

## Providers（横切关注点）

目录：`src/providers/`

| Provider | 职责 |
|----------|------|
| `AuthProvider.tsx` | 登录态管理、Token 存储 |
| `ErrorProvider.tsx` | Sentry 错误边界，全局错误捕获 |

**规则：** 全局性的横切关注点放在 Providers 层，通过 React Context 提供。

---

## AI 对话的数据流

```
用户输入
    ↓
ChatPage（Pages 层）
    ↓ 调用
useAiChat（Hooks 层）
    ↓ 调用
src/api/asGateway.ts（API 层）—— WebSocket 连接
    ↓ 流式返回
useChatStore（Store 层）—— 更新消息列表
    ↓ 响应
ChatPage 重新渲染
```

---

## 目录结构

```
src/
├── types/          ← 类型定义 + 业务常量（Message、WsMessage、QA_STATUS 等）
├── utils/
│   ├── request.ts  ← HTTP 请求工具（axios 封装，不能依赖 Store/Hooks）
│   └── websocket.ts← WebSocket 管理工具（WsManager 类，不能依赖 Store/Hooks）
├── config/         ← 环境变量（aiBaseUrl、asWsUrl 等）
├── api/
│   ├── commonApi.ts← 通用 HTTP 接口（如 getConfig）
│   └── asGateway.ts← AS Gateway WebSocket 连接管理（懒加载单例）
├── store/
│   ├── chatStore.ts← 对话消息列表
│   └── configStore.ts← 全局配置
├── hooks/
│   ├── useAiChat.ts       ← 读取对话消息
│   ├── useAppInit.ts      ← 应用初始化（获取全局配置）
│   ├── useChat.ts         ← 发送消息和接收 WS 响应
│   └── useWsConnection.ts ← WS 连接生命周期管理
├── components/
│   └── Chat/       ← 对话 UI 组件（Chat.tsx、Question/、Answer/）
├── pages/
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── ChatPage.tsx
│   └── AdminPage.tsx
└── providers/
    ├── AuthProvider.tsx
    └── ErrorProvider.tsx
```

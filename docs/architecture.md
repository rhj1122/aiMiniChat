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
| Components | `src/components/` | 可复用 UI 组件 | 只能依赖 Hooks、Types |
| Pages | `src/pages/` | 页面，路由入口 | 只能依赖 Components、Hooks |

**注意：** Types 是最底层，所有层都可以依赖它，这是正常的向下依赖。

---

## 层级约束

### 禁止的依赖

```
❌ utils/ 层 import Store 层或 Hooks 层
   → utils 只能是纯工具函数，需要访问状态的逻辑应放在 src/hooks/

❌ Components 层直接发起网络请求（fetch、WebSocket、axios、request）
   → 必须在 src/hooks/ 中封装逻辑，Components 通过 Hooks 访问数据

❌ Pages 层直接操作 Store
   → 必须通过 Hooks 层

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
// ❌ 错误：Page 层直接操作 Store
function ChatPage() {
  const addMessage = useChatStore(s => s.addMessage)  // 违规！
  addMessage(...)
}

// ✅ 正确：通过 Hook 操作
function ChatPage() {
  const { sendMessage } = useAIChat()  // Hook 内部操作 Store
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
useAIChat（Hooks 层）
    ↓ 调用
src/api/aiApi.ts（API 层）—— WebSocket 连接
    ↓ 流式返回
useChatStore（Store 层）—— 更新消息列表
    ↓ 响应
ChatPage 重新渲染
```

---

## 目录结构

```
src/
├── types/          ← 类型定义 + 业务常量（Message、User、DEFAULT_AI_CONFIG 等）
├── utils/          ← 纯工具函数（request.js、formatDate 等，不能依赖 Store/Hooks）
├── config/         ← 环境变量（aiBaseUrl 等）
├── api/
│   └── aiApi.ts    ← WebSocket 连接、消息收发
├── store/
│   └── chatStore.ts← 消息列表、loading 状态
├── hooks/
│   └── useAIChat.ts← 发送消息、流式更新逻辑
├── components/     ← 可复用组件（MessageBubble、ChatInput 等）
├── pages/
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── ChatPage.tsx
│   └── AdminPage.tsx
└── providers/
    ├── AuthProvider.tsx
    └── ErrorProvider.tsx
```

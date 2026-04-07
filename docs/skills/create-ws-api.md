# Skill：创建 WebSocket API 接口

> 本项目的 WebSocket 连接采用固定的三层架构，新增 WS 功能时按此模式实现。

## 架构模式

```
src/utils/websocket.ts     ← 通用 WS 管理工具（WsManager 类）
src/api/asGateway.ts       ← 业务 WS 封装（连接管理 + sendMessage）
src/hooks/useWsConnection.ts ← 连接生命周期 Hook（页面挂载时连接，卸载时断开）
src/hooks/useChat.ts       ← 业务逻辑 Hook（发送消息 + 注册回调 + 更新 Store）
```

## 适用场景
- 需要通过 WebSocket 与服务端通信
- 需要按 session_id 路由响应消息

## 不适用场景
- 普通 HTTP 请求 → 使用 src/utils/request.ts + src/api/xxxApi.ts

## 使用步骤

### 1. 确认类型定义（src/types/index.ts）
WsMessage、WsMessageHeader、WsMessageCallback 等类型已定义，直接 import 使用。

### 2. 发送消息（src/api/asGateway.ts）
```typescript
import { sendMessage, registerCallback, unregisterCallback } from '@/api/asGateway';

// 注册回调（按 session_id 分发）
registerCallback(sessionId, (msg) => {
  // 处理响应
});

// 发送消息
sendMessage(wsMessage);

// 响应结束后注销
unregisterCallback(sessionId);
```

### 3. 在 Hook 中封装业务逻辑
参考 `src/hooks/useChat.ts` 的实现模式：
- 生成 sessionId（每次发送消息时新建 UUID）
- 先 addMessage 到 Store
- 再 registerCallback
- 再 sendMessage
- 收到响应时 updateMessage 更新 Store
- isEnd 时 unregisterCallback

### 4. 在页面中使用
```typescript
// 页面加载时建立连接，卸载时断开
useWsConnection();

// 使用业务 Hook
const { send } = useChat();
```

## 常见错误
- 在 API 层顶层直接 `new WsManager()` → 必须用懒加载（见 asGateway.ts 的 getManager() 模式）
- 在 Components/Pages 层直接调用 `connect()` → 必须封装在 Hook 里
- 忘记在响应结束时 `unregisterCallback` → 会导致内存泄漏

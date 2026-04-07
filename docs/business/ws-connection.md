# WebSocket 连接管理说明

> 本文档描述项目中 WebSocket 连接的架构设计、关键机制和使用方式。

---

## 一、架构分层

```
src/utils/websocket.ts       ← 通用层：WsManager 类，管理单个 WS 连接
src/api/asGateway.ts         ← API 层：AS Gateway 的业务封装，单例模式
src/hooks/useWsConnection.ts ← Hooks 层：连接生命周期管理
src/hooks/useChat.ts         ← Hooks 层：发送消息和接收响应的业务逻辑
```

---

## 二、WsManager（src/utils/websocket.ts）

通用的 WebSocket 连接管理工具，核心能力：

- **连接管理**：connect / disconnect
- **消息发送**：send(rawString)
- **回调注册**：按 `session_id` 注册/注销回调，收到消息时自动路由

```typescript
const manager = new WsManager({
  url: 'ws://...',
  onStatusChange: (status) => { ... },
  onError: (event) => { ... },
});

manager.connect();
manager.registerCallback('session-id', (msg) => { ... });
manager.send(JSON.stringify(data));
manager.unregisterCallback('session-id');
manager.disconnect();
```

---

## 三、asGateway（src/api/asGateway.ts）

AS Gateway 的业务封装，使用**懒加载单例**模式：

```typescript
// ✅ 正确：懒加载，第一次调用时才 new WsManager
let _wsManager: WsManager | null = null;
function getManager(): WsManager {
  if (!_wsManager) _wsManager = new WsManager({ ... });
  return _wsManager;
}

// ❌ 错误：顶层直接实例化，导致测试无法 mock
const wsManager = new WsManager({ ... });
```

**为什么必须懒加载：** 模块顶层的 `new` 在模块加载时执行，`vi.mock` 无法拦截，导致测试失败。

导出的方法：
- `connect()` / `disconnect()` / `getStatus()`
- `registerCallback(sessionId, callback)` / `unregisterCallback(sessionId)`
- `sendMessage(message: WsMessage)`
- `_resetManager()`（仅用于测试）

---

## 四、session_id 路由机制

每次发送消息时生成一个新的 `session_id`（UUID），用于将响应消息路由到对应的回调函数：

```
发送消息时：
  生成 sessionId = crypto.randomUUID()
  registerCallback(sessionId, handleResponse)
  sendMessage({ header: { session_id: sessionId, ... }, ... })

收到响应时：
  WsManager 解析 msg.header.session_id
  找到对应的 callback 并调用
  msg.data.isEnd === true 时 unregisterCallback(sessionId)
```

这样多个并发对话可以同时进行，响应不会串台。

---

## 五、连接地址

```
开发环境：ws://localhost:3141/asConnection（.env 中的 VITE_AS_WS_URL）
```

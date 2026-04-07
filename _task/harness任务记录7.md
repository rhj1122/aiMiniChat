## 大型任务：实现websocket管理工具

### 目标
实现一个websocket管理工具，能够管理单个websocket连接，包括连接、收发消息、断开、清理等功能。（暂时不做断连重连、登录状态管理等内容，留作后续迭代更新）

### 位置
- /src/utils/websocket.ts 实现通用的websocket管理工具
- /src/api/asGateway.ts 实现asGateway的websocket连接管理

### 功能描述
实现一个简易的websocket管理工具，能够管理单个websocket连接，包括连接、收发消息、断开、重连等功能。
该websocket管理工具要支持以请求参数中的header.session_id为粒度，分别注册回调响应函数，并更新下行消息中的header.session_id，将消息只传递给对应回调响应函数。
另外还要导出一个单独的sendMessage方法，用于向ws服务端发送自定义消息，至于这个放在asGateway.ts还是websocket.ts由你决定，我想也许asGateway.ts更好（你可以根据实际情况提出意见）
ws连接地址已经有了：ws://localhost:3141/asConnection。可以写入env文件和config层

下列json为一个请求消息的基本结构：
```json
{
  "id":"uuid",
  "type": "query",
  "timestamp": "1750754721021",
  "header": {
    "sn": "333333333322222222",
    "mt": "MACBOOK AIR",
    "user_id": "12435564234",
    "app_id": "1233243554642343",
    "app_version": "1.2.3.4567",
    "device_id": "5BD5BC09-098C-43B6-A63C-8BED446380E4",
    "session_id": "2ac3ee26-4887-44a7-a3b2-bf2c3c1056fc",
    "request_id": "ecbdb79f-6f01-4041-a15d-4a6ef6946ac6",
    "resource_id":"main"
  },
  "data": {
    "text": "你好",
    "attachments": [
    ]
  },
  "source":{
    "type": "user",
    "id": "user_id",
  },
  "target":{
    "type": "agent",
    "id": "agent_id"
  },
  "extend": {
  }
}
```

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
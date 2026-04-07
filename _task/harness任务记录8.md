## 大型任务：使用asGateway发送ws消息并将响应消息写入store

### 目标
使用asGateway发送ws消息并将响应消息写入store

### 位置
- /src/pages/ChatPage.tsc
- /src/hooks/useChat.ts

### 功能描述
在 /src/pages/ChatPage.tsc 页面加载完成时，使用 /src/api/asGateway.ts 建立ws连接并保持。
在 /src/pages/ChatPage.tsc 中的input右侧添加一个发送按钮，在发送按钮点击后，调用 /src/hooks/useChat.ts （需要你实现）。
/src/hooks/useChat.ts 做三件事：
- 调用/src/store/chatStore.ts 的addMessage方法，添加一条message，格式参考如下：
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
      content: '',
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
- 获取input中的文本，用/src/api/asGateway.ts 发送出去。
- 等待消息响应，在接收到服务端响应数据之后，将流式数据调用 /src/store/chatStore.ts 中的方法更新到store里去（目前可以只更新answer的content字段）。
下列json为一个请求消息的基本结构：
```json
{
  "id":"uuid",
  "type": "task_output",
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
    "text": "我是智谱",
    "attachments": [
    ]
  },
  "source":{
    "type": "agent",
    "id": "agent_id",
  },
  "target":{
    "type": "user",
    "id": "user_id"
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
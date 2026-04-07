## 任务：重新梳理消息收发逻辑

### 目标
去掉sendMessage和streamMessage接口的流程

### 位置
- 修改src/api/aiApi.ts、src/hooks/useAIChat.ts、src/hooks/useAIChat.test.ts三个文件。

### 功能描述
去掉现有的sendMessage和streamMessage接口的全套流程，因为这不符合当前项目的需求。与AI对话的请求数据交互将使用websocket而不是https，这是后话，本期先删除这两套逻辑的全部流程即可。可以将src/api/aiApi.ts文件留空。

### 约束
- 要修改配套的test文件

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
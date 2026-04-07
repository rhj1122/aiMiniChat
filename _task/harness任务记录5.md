## 任务：重构chatStore

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
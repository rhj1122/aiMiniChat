## 大型任务：实现ai对话的UI组件渲染

### 目标
实现ai对话的UI组件渲染，并根据websocket的下行消息实时更新数据，达成流式渲染效果

### 位置
- /src/pages/ChatPage.tsc
- /src/components/Chat/Chat.tsx
- /src/components/Chat/Question/Question.tsx
- /src/components/Chat/Answer/Answer.tsx

### 功能描述
在 /src/pages/ChatPage.tsc 页面实现对话组件替换当前的<p className="text-center text-gray-400">对话内容将显示在这里</p>
现在已经可以实现在该页面输入框输入文本向后台发送，并正确获取后台响应数据，更新进入store。
目前只缺少根据 /src/store/chatStore.ts 中的messages数组将对话结果渲染在页面的逻辑。
你需要先实现 Chat、Question、Answer三个组件，其中Question和Answer为Chat的子组件，在ChatPage中使用Chat组件。
Question和Answer组件显示为对话气泡样式（参考微信），Question组件在右边，气泡内显示用户发送的文本（即messageItem.question.content，绿色气泡），Answer组件在左边，气泡内显示后端大模型吐出来的文本（即messageItem.answer[0].content，这里直接固定用answer[0]，数组是为了后续扩展用的当前不考虑，浅灰色气泡）。
在后端ws消息不断的流式输出过程中，store会持续频繁更新，要保证组件能够实时渲染，实现出流式输出的交互效果。
chatStore.ts 的messages数组，数据结构如下：
``` typescript
[
    {
        "qaId": "645eb7d7-8219-4333-bf25-b5916ec0cf04",
        "question": {
            "messageId": "cc32a9b3-d8ba-43fa-8061-f247ca536a37",
            "createTime": 1775568303859,
            "sessionId": "84a6713e-0f5b-42c6-96aa-21b366155ed8",
            "moduleType": "main",
            "content": "你是谁啊？",
            "attachments": [],
            "requestIdList": [
                "17bbcb3e-a960-4c1e-9393-329fa43d7812"
            ],
            "ext": {}
        },
        "answers": [
            {
                "messageId": "baaa2f86-25b9-4d9b-9380-4f421a90f960",
                "createTime": 1775568303859,
                "sessionId": "84a6713e-0f5b-42c6-96aa-21b366155ed8",
                "moduleType": "main",
                "content": "我是GLM大语言模型，由Z.ai团队开发和训练的AI助手。我基于大规模文本数据训练而成，旨在提供信息查询、问题解答等服务，同时保护用户隐私。\n\n我可以帮助您解答问题、提供信息或者简单交流。有什么我能帮您的吗？",
                "contentAssets": [],
                "status": 6,
                "likeStatus": 0,
                "requestId": "17bbcb3e-a960-4c1e-9393-329fa43d7812",
                "ext": {}
            }
        ],
        "answerActiveIndex": 0,
        "fromHistory": false
    }
]
```

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
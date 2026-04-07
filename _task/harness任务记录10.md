## 任务：优化Chat样式

### 目标
优化chatPage的样式
优化Chat组件及其子组件Answer的样式

### 位置
- /src/pages/chatPages 
- /src/components/Chat/chat.tsx 
- /src/components/Chat/Answer/Answer.tsx 

### 功能描述
当前chat页面内容过多时会将页面纵向撑大。优化：将chatPages的最大高度固定为100vh，内容超出部分，让中间Chat组件内部滚动。
Answer组件在等待消息回复的时候显示为一个颜色循环变化的大圆点。优化：改为三个横向并排灰色小圆点，并且颜色渐变，而且存在颜色简便的动效（类似loading效果，三个圆点类似颜色会渐变的省略号）。

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
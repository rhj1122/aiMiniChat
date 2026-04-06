## 任务：修复config请求bug

### 目标
修复config请求重复发起的bug

### 问题描述
当前在http://localhost:5173/chat页面可以看到F12的网络栏目中，页面刷新后会有两个完全相同的config请求。修复后应该只有一次请求

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
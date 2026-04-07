## 任务：实现config流程

### 目标
实现config获取的全流程

### 位置
- 在工程初始化的地方执行，是App.tx还是main.tsx由你评估

### 功能描述
工程初始化时使用 /src/api/commonApi getConfig 请求全局配置，并写入到store中去。
在/src/pages/ChatPage.tsx 加载完毕时读取store中的config数据并打印到控制台

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
## 任务：建立baseStore

### 目标
建立baseStore，用于存储一些项目级通用的信息

### 位置
- /src/store/baseStore.ts 

### 功能描述
实现一个baseStore，用于存储一些项目级的通用信息。一个userInfo对象，至少包含token、name、id三个属性。一个deviceInfo对象，至少包含deviceId、deviceName、deviceVersion等三个属性。要求这两个对象以实际存储的对象数据格式为准，允许弹性扩展，不要写死type定义，
这个baseStore要支持随时扩展其他信息存储，即除了userInfo和deviceInfo之外，后续可能随时添加其他项目级通用信息的存储（多半都是在项目启动后立即请求回来存储，然后在某些条件下重新请求刷新信息）
同时完善test文件

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
store创建的技能文档：/docs/skills/create-store.md
类似的store实现：/src/store/configStore.ts

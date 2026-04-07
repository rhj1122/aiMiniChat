## 任务：优化updateMessage流程

### 目标
将getUpdater的方式，修改为getUpdatedData

### 位置
- /src/store/chatStore的applyFields函数

### 功能描述
将applyFields函数中使用的getUpdater修改为getUpdatedData函数。当前的做法是通过getUpdater获取到updater，然后通过updater更新target。修改后的做法是不再让getUpdater返回更新函数，而是直接返回更新后的值。这样才好实现自定义的key做数据更新。比如：更新content字段有两种方式，一种是追加文本，我通过content这个key来更新。一种是替换文本，我希望通过setContent这个key来更新，但是原始数据字段中并不存在一个setContent这样的字段，所以需要修改getUpdatedData函数，让其能够支持自定义的key做数据更新。另外你还需要检查applyFields函数是否符合预期，当前的for循环中，似乎每次循环都会覆盖之前的updated值，如果一次更新多个字段的值，结果符合预期吗？

### 约束
- 按照AGENTS.md和对应的dosc/文档内容进行约束

### 验证
运行：pnpm test:run
期望：全部测试用例通过

### 参考
没有参考
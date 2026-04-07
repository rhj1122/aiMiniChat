## 任务：实现request.js

### 目标
使用axios，实现request.js。

### 位置
- 在utils目录下新建request.js文件

### 功能描述
request.js是用于通用的ajax的请求封装，要考虑日常使用的请求拦截器和响应拦截器逻辑。请求拦截器要在header中添加 Authrization和Token两个字段，值相同。可以先随便写个字符串后期再改成登录获取。
这个文件将会被 api层的绝大部分接口定义直接调用。
同时要实现配套的request.test.js。

### 约束
- 它应该是一个纯函数

### 验证
运行：npx vitest run src/utils/request.test.ts
期望：全部测试用例通过

### 参考
新文件没有参考
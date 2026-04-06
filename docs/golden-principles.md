# 黄金原则

---

## 命名类

### GP-N01：缩写词在命名中视为普通单词，只首字母大写

**规则：** AI、ID、URL、HTTP 等缩写词出现在 camelCase 或 PascalCase 命名中时，只首字母大写，其余小写。

**为什么：** 保持命名风格一致。如果缩写词全大写，会出现 `getHTTPSURL`、`userIDList` 这种难以阅读的命名，也会导致 Agent 生成的代码风格不统一。

**反例：**
```
❌ useAIChat      → ✅ useAiChat
❌ AIProvider     → ✅ AiProvider
❌ chatIDList     → ✅ chatIdList
❌ getHTTPClient  → ✅ getHttpClient
❌ parseURLParams → ✅ parseUrlParams
❌ userID         → ✅ userId
```

**适用范围：** 文件名、变量名、函数名、类名、接口名、类型名。

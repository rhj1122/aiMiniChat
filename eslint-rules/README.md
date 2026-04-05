# 自定义 ESLint 规则（Harness 架构约束）

## 已启用的规则

| 文件 | 规则名 | 说明 | 级别 |
|------|--------|------|------|
| `no-network-in-components.js` | `harness/no-network-in-components` | Components/Pages 层不能直接发起网络请求（fetch、WebSocket、axios、request）| error |
| `no-store-in-pages.js` | `harness/no-store-in-pages` | Pages 层不能直接 import Store 层 | error |
| `no-store-in-utils.js` | `harness/no-store-in-utils` | utils/ 层不能 import Store 层或 Hooks 层 | error |

## 新增规则的步骤

1. 在此目录创建规则文件 `rule-name.js`
2. 在 `eslint.config.js` 顶部 import
3. 在 `plugins.harness.rules` 中注册
4. 在 `rules` 中启用（`'error'` 或 `'warn'`）
5. 更新本文件的表格

## 规则编写规范

- 错误信息必须包含：`[规则代码]` + 原因 + 修复步骤 + 文档链接
- 使用 `context.filename`（不是 `context.getFilename()`，ESLint v10 已废弃）
- 路径判断统一用 `.replace(/\\\\/g, '/')` 处理 Windows 路径

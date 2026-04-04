# 自定义 ESLint 规则（Harness 架构约束）

> 此目录在 10.3 节填充。

## 规划中的规则

| 文件 | 规则名 | 说明 | 级别 |
|------|--------|------|------|
| `no-api-in-components.js` | `harness/no-api-in-components` | Components 层不能直接 import API 层 | error |
| `no-store-in-pages.js` | `harness/no-store-in-pages` | Pages 层不能直接 import Store 层 | error |
| `no-ai-sdk-in-components.js` | `harness/no-ai-sdk-in-components` | Components 层不能直接使用 AI SDK | error |

## 使用方式

规则写好后，在 `eslint.config.js` 中解注释对应的 import 和规则配置。

# 技术选型

> 本文档记录项目使用的技术栈和选型原因。Agent 在引入新依赖前必须先查阅本文档，避免引入重复功能的库。

---

## 已使用的库（禁止引入功能重复的替代品）

### 核心框架
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| React | 19 | UI 框架 | Vue、Svelte 等 |
| TypeScript | 6 | 类型系统 | 不允许纯 JS |
| Vite | 8 | 构建工具 | webpack、rollup |

### 状态管理
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| Zustand | 5 | 全局状态管理 | Redux、MobX、Jotai、Context |

### 路由
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| React Router | 7 | 客户端路由 | TanStack Router 等 |

### 网络请求
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| axios | 1.x | HTTP 请求 | fetch（直接使用）、ky、got |

> **重要：** 所有 HTTP 请求必须通过 `src/utils/request.ts` 封装的 `get/post/put/del` 方法，禁止在业务代码中直接使用 axios 或 fetch。

### 样式
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| Tailwind CSS | 4 | 原子化 CSS | styled-components、emotion、CSS Modules |
| Radix UI | 最新 | 无样式基础组件 | MUI、Ant Design、shadcn/ui（除非基于 Radix）|

### 测试
| 库 | 版本 | 用途 | 禁止替代 |
|----|------|------|---------|
| Vitest | 4 | 测试框架 | Jest |
| React Testing Library | 16 | 组件测试 | Enzyme |
| Playwright | 最新 | E2E 测试（按需）| Cypress |

### 代码规范
| 库 | 版本 | 用途 |
|----|------|------|
| ESLint | 10 | 代码检查（含自定义 Harness 规则）|
| Prettier | 3 | 代码格式化 |
| Husky | 9 | Git hooks（pre-commit 运行 check）|

---

## 禁止引入的库

| 类别 | 禁止的库 | 原因 |
|------|---------|------|
| 状态管理 | Redux、MobX、Recoil、Jotai | 已有 Zustand |
| HTTP | fetch（直接使用）、ky、got、superagent | 已有 axios + request.ts 封装 |
| 样式 | styled-components、emotion、CSS Modules | 已有 Tailwind |
| UI 组件库 | Ant Design、MUI、Chakra UI | 已有 Radix UI + Tailwind |
| 测试 | Jest、Enzyme | 已有 Vitest + RTL |

---

## 引入新依赖的流程

1. 先查本文档，确认没有功能重复的库
2. 在 PR 描述里说明引入原因
3. 更新本文档，记录新库的用途和禁止替代项

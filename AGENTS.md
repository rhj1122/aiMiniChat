# aiMiniChat（H5应用，包含AI对话和一些管理页面）

## 项目概述
这是一个H5应用，主要包含AI对话和一些管理页面，需要登录后使用
基于 React 19 + TypeScript，使用 Zustand 管理状态，使用 TailwindCSS + radix-ui 处理样式，Vite 构建

## 架构概览
分层架构：Types -> Config -> API -> Store -> Hooks -> Components -> Pages
依赖只能向下，不能向上。
目录结构：
  src/types/      ← 类型定义（最底层，无依赖）
  src/config/     ← 配置（环境变量和常量）
  src/api/        ← 网络请求封装
  src/store/      ← Zustand 状态管理
  src/hooks/      ← 自定义 Hook（业务逻辑）
  src/components/ ← UI 组件
  src/pages/      ← 页面
  src/providers/  ← 横切关注点（Auth 登录态、Error 错误边界）
详细架构：docs/architecture.md

## 关键规则（必须遵守）
- Pages 和 Components 层可以读取 Store，但禁止直接写入 Store（写入操作必须封装在 Hooks 层）
- 禁止在 Components 和 Pages 层直接发起网络请求（fetch、websocket），必须经过 src/api/ 层
- Hook 只返回数据和方法，不返回 JSX
- 开始实现新功能前，先搜索代码库确认是否已有类似实现
详细规则：docs/architecture.md#层级约束

## 编码规范（关键条目）
- 组件文件名用 PascalCase，Hook 文件用 camelCase（以 use 开头）
- 缩写词（AI、ID、URL 等）在命名中视为普通单词，只首字母大写：Ai、Id、Url（不是 AI、ID、URL）
完整规范：docs/conventions.md

## 常用命令
pnpm dev          # 启动开发服务器
pnpm check        # tsc 类型检查 + ESLint 代码规范检查
pnpm test:run     # 运行测试
pnpm build        # 构建

## 验证流程
修改代码后，按顺序运行：
1. pnpm check（静态检查）
2. pnpm test:run（测试）
3. pnpm build（构建验证，修改 API/类型时必须）

## PR 规范
提交 PR 时，描述必须包含：做了什么 / 为什么 / 改动范围 / 验证结果
模板：docs/pr-template.md

## 文档
docs/README.md（所有文档的入口）


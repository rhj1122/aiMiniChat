# Skill：验证代码修改

## 适用场景
- 修改了任何 src/ 下的代码后
- 提交 PR 之前

## 标准验证流程

修改代码后，按以下顺序运行：

```bash
# 步骤一：静态检查（必须）
pnpm check
# 包含 tsc 类型检查 + ESLint 代码规范检查（含 Harness 架构规则）
# 如果有错误，先修复所有错误再继续

# 步骤二：运行测试（必须）
pnpm test:run
# 如果有测试失败，修复后再继续

# 步骤三：构建验证（修改了 API 层、类型定义、配置时必须）
pnpm build
```

## 快速验证（小改动时）

```bash
pnpm check && pnpm test:run
```

## 常见错误

- 只跑了 `pnpm check` 没跑测试 → 逻辑 bug 漏掉了
- 只跑了测试没跑 `pnpm check` → 类型错误或架构违规漏掉了
- 修改了类型定义但没跑 `pnpm build` → 构建时才发现问题

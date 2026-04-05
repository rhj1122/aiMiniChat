/**
 * 规则：no-store-in-pages
 * 检测 src/pages/ 下是否直接 import src/store/ 的模块
 *
 * [ARCH-002] Pages 层不能直接导入 Store 层。
 * 原因：Store 操作必须封装在 Hooks 层，Pages 层通过 Hooks 访问状态，
 *       这样可以保持页面组件的简洁，Store 操作逻辑可复用。
 * 修复：
 *   1. 在 src/hooks/ 中创建 useXxx Hook 封装 Store 操作
 *   2. 在 Page 中调用该 Hook，而不是直接使用 Store
 * 参考：docs/architecture.md#层级约束
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Pages 层不能直接导入 Store 层',
    },
    messages: {
      noStoreInPages:
        '[ARCH-002] Pages 层不能直接导入 Store 层。\n' +
        '原因：Store 操作必须封装在 Hooks 层，Pages 通过 Hooks 访问状态。\n' +
        '修复：在 src/hooks/ 创建 useXxx Hook 封装 Store 操作，在 Page 中调用该 Hook。\n' +
        '参考：docs/architecture.md#层级约束',
    },
  },
  create(context) {
    const filePath = context.filename.replace(/\\/g, '/')
    const isInPages = filePath.includes('/src/pages/')

    if (!isInPages) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const importsFromStore =
          importPath.includes('/store/') ||
          importPath.includes('../store') ||
          importPath.startsWith('@/store')

        if (importsFromStore) {
          context.report({ node, messageId: 'noStoreInPages' })
        }
      },
    }
  },
}

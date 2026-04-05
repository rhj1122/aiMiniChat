/**
 * 规则：no-store-in-utils
 * 检测 src/utils/ 下是否 import 了 Store 层或 Hooks 层
 *
 * [ARCH-003] utils/ 层不能依赖 Store 层或 Hooks 层。
 * 原因：utils/ 只能是纯工具函数（无副作用，无业务依赖），
 *       如果需要访问状态或业务数据，应该放在 src/hooks/ 而不是 src/utils/。
 * 修复：
 *   将依赖 Store/Hooks 的逻辑移到 src/hooks/ 中创建对应的 useXxx Hook
 * 参考：docs/architecture.md#utils层约束
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'utils/ 层不能依赖 Store 层或 Hooks 层',
    },
    messages: {
      noStoreInUtils:
        '[ARCH-003] utils/ 层不能 import Store 层或 Hooks 层。\n' +
        '原因：utils/ 只能是纯工具函数，不能有业务依赖。\n' +
        '修复：将依赖状态的逻辑移到 src/hooks/ 中创建 useXxx Hook。\n' +
        '参考：docs/architecture.md#utils层约束',
    },
  },
  create(context) {
    const filePath = context.filename.replace(/\\/g, '/')
    const isInUtils = filePath.includes('/src/utils/')

    if (!isInUtils) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        const importsStore =
          importPath.includes('/store/') ||
          importPath.includes('../store') ||
          importPath.startsWith('@/store')

        const importsHooks =
          importPath.includes('/hooks/') ||
          importPath.includes('../hooks') ||
          importPath.startsWith('@/hooks')

        if (importsStore || importsHooks) {
          context.report({ node, messageId: 'noStoreInUtils' })
        }
      },
    }
  },
}

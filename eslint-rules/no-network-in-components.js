/**
 * 规则：no-network-in-components
 * 检测 src/components/ 和 src/pages/ 下是否直接发起网络请求
 *
 * [ARCH-001] Components/Pages 层不能直接发起网络请求。
 * 原因：网络请求必须封装在 src/api/ 层，Components/Pages 通过 Hooks 层访问数据，
 *       这样可以解耦 UI 和数据获取逻辑，便于测试和复用。
 * 修复：
 *   1. 在 src/api/ 中创建对应的请求函数（使用 src/utils/request.js）
 *   2. 在 src/hooks/ 中创建 useXxx Hook 调用该函数
 *   3. 在 Component/Page 中调用该 Hook
 * 参考：docs/architecture.md#层级约束
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Components/Pages 层不能直接发起网络请求',
    },
    messages: {
      noNetworkInComponents:
        '[ARCH-001] Components/Pages 层不能直接发起网络请求。\n' +
        '原因：网络请求必须封装在 src/api/ 层，通过 Hooks 层访问。\n' +
        '修复：在 src/api/ 创建请求函数 → 在 src/hooks/ 创建 Hook → 在组件中调用 Hook。\n' +
        '参考：docs/architecture.md#层级约束',
    },
  },
  create(context) {
    const filePath = context.filename.replace(/\\/g, '/')
    const isInComponentsOrPages =
      filePath.includes('/src/components/') || filePath.includes('/src/pages/')

    if (!isInComponentsOrPages) return {}

    // 直接使用网络请求的包名
    const NETWORK_PACKAGES = ['axios', 'ky', 'got', 'superagent']

    return {
      // 检测 new WebSocket(...)
      NewExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'WebSocket') {
          context.report({ node, messageId: 'noNetworkInComponents' })
        }
      },
      // 检测 fetch(...)
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
          context.report({ node, messageId: 'noNetworkInComponents' })
        }
      },
      // 检测直接 import axios / request 工具
      ImportDeclaration(node) {
        const importPath = node.source.value

        // 直接 import axios 等网络库
        const importsNetworkLib = NETWORK_PACKAGES.some(pkg => importPath === pkg)

        // 直接 import utils/request（应该只有 api/ 层能用）
        const importsRequest =
          importPath.includes('/utils/request') ||
          importPath.startsWith('@/utils/request')

        if (importsNetworkLib || importsRequest) {
          context.report({ node, messageId: 'noNetworkInComponents' })
        }
      },
    }
  },
}

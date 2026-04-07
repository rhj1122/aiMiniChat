/**
 * 规则：no-type-outside-types
 * 检测 src/types/ 以外的层是否定义了可导出的 type、interface、enum
 *
 * [ARCH-004] 类型定义必须集中在 src/types/ 目录下。
 * 原因：类型散落在各层会导致重复定义、import 路径混乱。
 *       集中管理让所有层都从同一个地方 import 类型，保持一致性。
 * 修复：
 *   将类型定义移到 src/types/ 目录下对应的文件中，然后在当前文件 import 使用。
 * 参考：docs/golden-principles.md#GP-A01
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: '类型定义必须集中在 src/types/ 目录下',
    },
    messages: {
      noTypeOutsideTypes:
        '[ARCH-004] 类型定义必须集中在 src/types/ 目录下。\n' +
        '原因：类型散落在各层会导致重复定义和 import 混乱。\n' +
        '修复：将此类型定义移到 src/types/ 目录下，然后 import 使用。\n' +
        '参考：docs/golden-principles.md#GP-A01',
    },
  },
  create(context) {
    const filePath = context.filename.replace(/\\/g, '/')

    // 只检查这些目录
    const restrictedDirs = ['/src/pages/', '/src/components/', '/src/hooks/', '/src/config/', '/src/utils/', '/src/api/']
    const isInRestrictedDir = restrictedDirs.some(dir => filePath.includes(dir))

    if (!isInRestrictedDir) return {}

    // 检测所有 type / interface / enum 定义（不管是否 export）
    return {
      TSTypeAliasDeclaration(node) {
        context.report({ node, messageId: 'noTypeOutsideTypes' })
      },
      TSInterfaceDeclaration(node) {
        context.report({ node, messageId: 'noTypeOutsideTypes' })
      },
      TSEnumDeclaration(node) {
        context.report({ node, messageId: 'noTypeOutsideTypes' })
      },
    }
  },
}

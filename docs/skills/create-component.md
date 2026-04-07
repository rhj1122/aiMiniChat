# Skill：创建新组件

## 适用场景
- 需要新建一个 React UI 组件

## 使用步骤

### 1. 确认组件放在正确的目录
```
可复用组件 → src/components/XxxYyy.tsx
页面组件   → src/pages/XxxPage.tsx
```

### 2. 创建组件文件
```typescript
// src/components/MessageBubble.tsx
// 文件名用 PascalCase

export default function MessageBubble() {
  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
}
```

### 3. 创建测试文件（同目录）
```typescript
// src/components/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import MessageBubble from './MessageBubble';

describe('MessageBubble', () => {
  test('应该正确渲染', () => {
    render(<MessageBubble />);
    // 断言
  });
});
```

### 4. 验证
```bash
pnpm check && pnpm test:run
```

## 不适用场景
- 业务逻辑不要写在组件里 → 放在 src/hooks/
- 类型定义不要写在组件文件里 → 放在 src/types/

## 常见错误
- 在组件里直接 fetch 或调用 API → 必须通过 Hooks 层
- 在组件里直接写入 Store → 写入操作封装在 Hooks 层
- 文件名用了 camelCase → 组件文件必须用 PascalCase
- 缩写词全大写（AIChat）→ 应该只首字母大写（AiChat）

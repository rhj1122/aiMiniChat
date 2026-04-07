# Skill：创建新 API 接口

## 适用场景
- 需要对接一个新的后端接口

## 使用步骤

### 1. 确认类型定义
在 `src/types/` 中定义请求和响应的类型（如果还没有）。

### 2. 创建或更新 API 文件
```
位置：src/api/xxxApi.ts
命名：camelCase，以 Api 结尾
```

```typescript
// src/api/chatApi.ts

import { get, post } from '@/utils/request';
import type { ApiResponse, Message } from '@/types';

export function getMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
  return get(`/messages?sessionId=${sessionId}`);
}

export function sendMessage(data: { content: string }): Promise<ApiResponse<Message>> {
  return post('/messages', data);
}
```

### 3. 创建测试文件（同目录）
```typescript
// src/api/chatApi.test.ts

import { getMessages, sendMessage } from './chatApi';
import { get, post } from '@/utils/request';

vi.mock('@/utils/request', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

describe('chatApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getMessages 应该调用 get', async () => {
    vi.mocked(get).mockResolvedValue({ data: [] });
    await getMessages('session-1');
    expect(get).toHaveBeenCalledWith('/messages?sessionId=session-1');
  });
});
```

### 4. 验证
```bash
pnpm check && pnpm test:run
```

## 不适用场景
- 不要在 API 层写业务判断逻辑 → 业务逻辑放 Hooks 层
- 不要在 API 层定义类型 → 类型放 src/types/

## 常见错误
- API 函数里包含了 if/else 业务判断 → API 层只做请求/响应转换
- 返回类型用了 any → 必须有明确的 TypeScript 返回类型
- 直接用 axios 而不是 request 工具 → 必须使用 src/utils/request.ts 的 get/post/put/del

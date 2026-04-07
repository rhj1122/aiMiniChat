// src/api/commonApi.test.ts

import { getConfig } from './commonApi';
import { get } from '@/utils/request';

// Mock request 工具
vi.mock('@/utils/request', () => ({
  get: vi.fn(),
}));

describe('commonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getConfig 应该调用 get("/config")', async () => {
    const mockResponse = {
      data: {
        appName: 'aiMiniChat',
        version: '1.0.0',
      },
    };
    vi.mocked(get).mockResolvedValue(mockResponse);

    const result = await getConfig();

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/config');
    expect(result).toEqual(mockResponse);
  });

  test('getConfig 请求失败时应该抛出错误', async () => {
    vi.mocked(get).mockRejectedValue(new Error('请求失败'));

    await expect(getConfig()).rejects.toThrow('请求失败');
  });
});

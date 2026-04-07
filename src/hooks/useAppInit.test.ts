// src/hooks/useAppInit.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useAppInit } from './useAppInit';
import { useConfigStore } from '@/store/configStore';
import { getConfig } from '@/api/commonApi';

vi.mock('@/api/commonApi', () => ({
  getConfig: vi.fn(),
}));

describe('useAppInit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useConfigStore.setState({ config: null, isLoaded: false });
  });

  test('应该调用 getConfig 并将结果写入 configStore', async () => {
    const mockConfig = { appName: 'aiMiniChat', version: '1.0.0' };
    vi.mocked(getConfig).mockResolvedValue({ data: mockConfig });

    renderHook(() => useAppInit());

    await waitFor(() => {
      expect(useConfigStore.getState().isLoaded).toBe(true);
    });

    expect(getConfig).toHaveBeenCalledTimes(1);
    expect(useConfigStore.getState().config).toEqual(mockConfig);
  });

  test('已加载时不应该重复请求', async () => {
    useConfigStore.setState({ config: { appName: 'test' }, isLoaded: true });

    renderHook(() => useAppInit());

    expect(getConfig).not.toHaveBeenCalled();
  });

  test('getConfig 失败时 isLoaded 应该保持 false', async () => {
    vi.mocked(getConfig).mockRejectedValue(new Error('网络错误'));

    renderHook(() => useAppInit());

    // 等待异步操作完成
    await waitFor(() => {
      expect(getConfig).toHaveBeenCalledTimes(1);
    });

    expect(useConfigStore.getState().isLoaded).toBe(false);
  });
});

// src/store/configStore.test.ts

import { useConfigStore } from './configStore';

describe('configStore', () => {
  beforeEach(() => {
    useConfigStore.setState({ config: null, isLoaded: false });
  });

  test('初始状态 config 为 null，isLoaded 为 false', () => {
    const { config, isLoaded } = useConfigStore.getState();
    expect(config).toBeNull();
    expect(isLoaded).toBe(false);
  });

  test('setConfig 应该设置 config 并将 isLoaded 置为 true', () => {
    const mockConfig = { appName: 'aiMiniChat', version: '1.0.0' };
    const { setConfig } = useConfigStore.getState();

    setConfig(mockConfig);

    const { config, isLoaded } = useConfigStore.getState();
    expect(config).toEqual(mockConfig);
    expect(isLoaded).toBe(true);
  });
});

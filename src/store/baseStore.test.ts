// src/store/baseStore.test.ts

import { useBaseStore } from './baseStore';

describe('baseStore', () => {
  beforeEach(() => {
    useBaseStore.setState({ userInfo: null, deviceInfo: null });
  });

  test('初始状态 userInfo 和 deviceInfo 均为 null', () => {
    const { userInfo, deviceInfo } = useBaseStore.getState();
    expect(userInfo).toBeNull();
    expect(deviceInfo).toBeNull();
  });

  test('setUserInfo 应该设置 userInfo', () => {
    const mockUser = { token: 'abc123', name: '张三', id: 'u001' };
    useBaseStore.getState().setUserInfo(mockUser);
    expect(useBaseStore.getState().userInfo).toEqual(mockUser);
  });

  test('setUserInfo 支持弹性扩展字段', () => {
    const mockUser = { token: 'abc123', name: '张三', id: 'u001', role: 'admin', extra: 42 };
    useBaseStore.getState().setUserInfo(mockUser);
    expect(useBaseStore.getState().userInfo).toEqual(mockUser);
  });

  test('setDeviceInfo 应该设置 deviceInfo', () => {
    const mockDevice = { deviceId: 'd001', deviceName: 'iPhone 15', deviceVersion: 'iOS 17' };
    useBaseStore.getState().setDeviceInfo(mockDevice);
    expect(useBaseStore.getState().deviceInfo).toEqual(mockDevice);
  });

  test('setDeviceInfo 支持弹性扩展字段', () => {
    const mockDevice = {
      deviceId: 'd001',
      deviceName: 'iPhone 15',
      deviceVersion: 'iOS 17',
      platform: 'mobile',
    };
    useBaseStore.getState().setDeviceInfo(mockDevice);
    expect(useBaseStore.getState().deviceInfo).toEqual(mockDevice);
  });

  test('clearUserInfo 应该将 userInfo 置为 null', () => {
    useBaseStore.getState().setUserInfo({ token: 'abc', name: '李四', id: 'u002' });
    useBaseStore.getState().clearUserInfo();
    expect(useBaseStore.getState().userInfo).toBeNull();
  });

  test('clearDeviceInfo 应该将 deviceInfo 置为 null', () => {
    useBaseStore
      .getState()
      .setDeviceInfo({ deviceId: 'd002', deviceName: 'Pixel 8', deviceVersion: 'Android 14' });
    useBaseStore.getState().clearDeviceInfo();
    expect(useBaseStore.getState().deviceInfo).toBeNull();
  });

  test('userInfo 和 deviceInfo 互不影响', () => {
    useBaseStore.getState().setUserInfo({ token: 'tok', name: '王五', id: 'u003' });
    useBaseStore.getState().clearDeviceInfo();
    expect(useBaseStore.getState().userInfo).not.toBeNull();
    expect(useBaseStore.getState().deviceInfo).toBeNull();
  });
});

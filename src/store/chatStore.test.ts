import { useChatStore } from "./chatStore";

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      isLoading: false,
    });
  });

  test('测试addMessage添加元素', () => {
    const { addMessage } = useChatStore.getState();

    addMessage({
      id: 'abc',
      role: 'user',
      content: 'aaa',
      timestamp: Date.now(),
      isStreaming: true,
    });

    const { messages } = useChatStore.getState();

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('aaa');
  });

  test('测试updateLastMessage更新元素', () => {
    const { addMessage, updateLastMessage } = useChatStore.getState();

    addMessage({
      id: 'abc',
      role: 'user',
      content: 'aaa',
      timestamp: Date.now(),
      isStreaming: true,
    });

    addMessage({
      id: 'abc',
      role: 'user',
      content: 'bbb',
      timestamp: Date.now(),
      isStreaming: true,
    });

    updateLastMessage('ccc');

    const { messages } = useChatStore.getState();

    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe('aaa');
    expect(messages[1].content).toBe('ccc');
  });

  test('测试clearMessages清空元素', () => {
    const { addMessage, clearMessages } = useChatStore.getState();

    addMessage({
      id: 'abc',
      role: 'user',
      content: 'aaa',
      timestamp: Date.now(),
      isStreaming: true,
    });

    clearMessages();

    const { messages } = useChatStore.getState();

    expect(messages).toHaveLength(0);
  });

  test('测试setLoading修改状态', () => {
    const { setLoading, isLoading } = useChatStore.getState();

    expect(isLoading).toBe(false);

    setLoading(true);

    expect(useChatStore.getState().isLoading).toBe(true);
  });

  afterEach(() => {
    // 好像不需要做什么
  });
});

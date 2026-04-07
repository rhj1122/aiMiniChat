import '@testing-library/jest-dom';

// 通过环境变量控制是否屏蔽 console 输出
// pnpm test:run    → 正常打印
// pnpm test:silent → 屏蔽 console
if (process.env.VITEST_SILENT === 'true') {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
}

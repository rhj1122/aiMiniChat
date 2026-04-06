import { render, screen } from '@testing-library/react'
import LoginPage from './LoginPage'

describe('测试LoginPage', () => {
  test('渲染登录标题', () => {
    render(<LoginPage />)
    expect(screen.getByText('登录')).toBeInTheDocument()
  })
});

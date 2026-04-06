import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AiProvider } from '@/providers/AiProvider'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import ChatPage from '@/pages/ChatPage'
import AdminPage from '@/pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <AiProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AiProvider>
    </BrowserRouter>
  )
}

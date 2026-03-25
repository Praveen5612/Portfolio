import { createContext, useState, useEffect, useContext } from 'react'
import { authApi } from '../services/auth.api.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(res => setAdmin(res.data))
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('admin_data') })
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('admin_data', JSON.stringify(res.data.admin))
    setAdmin(res.data.admin)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin_data')
    setAdmin(null)
  }

  const updateAdmin = (data) => setAdmin(prev => ({ ...prev, ...data }))

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  // Actions
  async function register(name, email, password, passwordConfirmation) {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    setAuth(data.token, data.user)
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    setAuth(data.token, data.user)
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      clearAuth()
    }
  }

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function clearAuth() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isLoggedIn, isAdmin, register, login, logout }
})
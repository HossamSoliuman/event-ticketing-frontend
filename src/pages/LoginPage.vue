<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold mb-2">Welcome back</h1>
        <p class="text-zinc-500">Sign in to your account</p>
      </div>

      <div class="card p-8">
        <p v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
          {{ error }}
        </p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input v-model="form.email" type="email" required class="input" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input v-model="form.password" type="password" required class="input" placeholder="••••••••" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary w-full mt-2">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-amber-400 hover:underline font-medium">Sign up</RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

const form    = ref({ email: '', password: '' })
const loading = ref(false)
const error   = ref('')

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    await auth.login(form.value.email, form.value.password)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e.response?.data?.errors?.email?.[0] || e.response?.data?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>

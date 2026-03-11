<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold mb-2">Create account</h1>
        <p class="text-zinc-500">Start booking tickets today</p>
      </div>

      <div class="card p-8">
        <div v-if="errors.general" class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
          {{ errors.general }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Full name</label>
            <input v-model="form.name" type="text" required class="input" placeholder="John Doe" />
            <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input v-model="form.email" type="email" required class="input" placeholder="you@example.com" />
            <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input v-model="form.password" type="password" required class="input" placeholder="Min. 8 characters" />
            <p v-if="errors.password" class="text-red-400 text-xs mt-1">{{ errors.password[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Confirm password</label>
            <input v-model="form.password_confirmation" type="password" required class="input" placeholder="••••••••" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary w-full mt-2">
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="text-center text-sm text-zinc-500 mt-6">
          Already have an account?
          <RouterLink to="/login" class="text-amber-400 hover:underline font-medium">Sign in</RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth   = useAuthStore()
const router = useRouter()

const form    = ref({ name: '', email: '', password: '', password_confirmation: '' })
const loading = ref(false)
const errors  = ref({})

async function handleRegister() {
  loading.value = true
  errors.value  = {}
  try {
    await auth.register(form.value.name, form.value.email, form.value.password, form.value.password_confirmation)
  } catch (e) {
    if (e.response?.data?.errors) {
      errors.value = e.response.data.errors
    } else {
      errors.value = { general: e.response?.data?.message || 'Registration failed.' }
    }
    loading.value = false
    return
  }
  loading.value = false
  router.push('/')
}
</script>
<template>
  <div class="min-h-screen flex flex-col">

    <!-- Navbar -->
    <nav class="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
          </div>
          <span class="font-bold text-lg tracking-tight" style="font-family: 'Syne', sans-serif">Ticketly</span>
        </RouterLink>

        <!-- Nav links -->
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="text-sm text-zinc-400 hover:text-white transition">Events</RouterLink>

          <template v-if="auth.isLoggedIn">
            <RouterLink to="/my-orders" class="text-sm text-zinc-400 hover:text-white transition">My Orders</RouterLink>
            <div class="flex items-center gap-3 ml-2">
              <span class="text-sm text-zinc-500">{{ auth.user?.name }}</span>
              <button @click="handleLogout"
                      class="text-sm border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white px-4 py-1.5 rounded-lg transition">
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <RouterLink to="/login" class="text-sm text-zinc-400 hover:text-white transition">Login</RouterLink>
            <RouterLink to="/register"
                        class="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-4 py-1.5 rounded-lg transition">
              Sign up
            </RouterLink>
          </template>
        </div>

      </div>
    </nav>

    <!-- Page content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-zinc-800 py-6 text-center text-sm text-zinc-600">
      Ticketly &copy; {{ new Date().getFullYear() }}
    </footer>

  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth   = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

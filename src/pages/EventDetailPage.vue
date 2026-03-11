<template>
  <div class="max-w-5xl mx-auto px-6 py-12">

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="h-72 bg-zinc-800 rounded-2xl"></div>
      <div class="h-8 bg-zinc-800 rounded w-1/2"></div>
      <div class="h-4 bg-zinc-800 rounded w-1/3"></div>
    </div>

    <div v-else-if="event" class="grid grid-cols-1 lg:grid-cols-3 gap-10">

      <!-- Left: Event info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image -->
        <div class="rounded-2xl overflow-hidden h-72">
          <img v-if="event.image_url" :src="event.image_url" :alt="event.title"
               class="w-full h-full object-cover">
          <div v-else class="w-full h-full bg-zinc-800"></div>
        </div>

        <h1 class="text-4xl font-extrabold">{{ event.title }}</h1>

        <div class="flex flex-wrap gap-4 text-sm text-zinc-400">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            {{ event.venue }}
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ formatDate(event.date) }}
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
            {{ event.available_tickets }} tickets remaining
          </div>
        </div>

        <div class="text-zinc-400 leading-relaxed border-t border-zinc-800 pt-6">
          {{ event.description }}
        </div>
      </div>

      <!-- Right: Purchase card -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-24">
          <div class="text-3xl font-extrabold text-amber-400 mb-1">{{ event.price_display }}</div>
          <p class="text-zinc-500 text-sm mb-6">per ticket</p>

          <div v-if="event.is_sold_out" class="text-center py-4">
            <span class="text-red-400 font-semibold">This event is sold out</span>
          </div>

          <template v-else>
            <!-- Quantity -->
            <label class="block text-sm font-medium text-zinc-400 mb-2">Quantity</label>
            <div class="flex items-center gap-3 mb-6">
              <button @click="qty = Math.max(1, qty - 1)"
                      class="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xl font-bold transition">−</button>
              <span class="text-xl font-bold w-8 text-center">{{ qty }}</span>
              <button @click="qty = Math.min(event.available_tickets, qty + 1)"
                      class="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xl font-bold transition">+</button>
            </div>

            <!-- Total -->
            <div class="flex justify-between text-sm mb-6 border-t border-zinc-800 pt-4">
              <span class="text-zinc-400">Total</span>
              <span class="font-bold text-white">${{ ((event.price * qty) / 100).toFixed(2) }}</span>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>

            <!-- CTA -->
            <button @click="handleBuy" :disabled="buying"
                    class="btn-primary w-full text-center">
              {{ buying ? 'Processing...' : 'Buy Tickets' }}
            </button>

            <p v-if="!auth.isLoggedIn" class="text-xs text-zinc-600 mt-3 text-center">
              <RouterLink to="/login" class="text-amber-400 hover:underline">Login</RouterLink>
              to purchase tickets
            </p>
          </template>
        </div>
      </div>

    </div>

    <div v-else class="text-center py-24 text-zinc-500">Event not found.</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const event  = ref(null)
const loading = ref(true)
const qty    = ref(1)
const buying = ref(false)
const error  = ref('')

async function fetchEvent() {
  try {
    const { data } = await api.get(`/events/${route.params.id}`)
    event.value = data.data.event
  } finally {
    loading.value = false
  }
}

async function handleBuy() {
  if (!auth.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  buying.value = true
  error.value  = ''

  try {
    // 1. Create the order
    const { data: orderData } = await api.post('/orders', {
      event_id: event.value.id,
      quantity: qty.value,
    })
    const order = orderData.data.order

    // 2. Navigate to payment page with order info
    router.push({
      path: '/payment',
      query: { order_id: order.id, amount: order.total_amount, label: order.total_amount_display },
    })
  } catch (e) {
    error.value = e.response?.data?.message || 'Something went wrong.'
  } finally {
    buying.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(fetchEvent)
</script>

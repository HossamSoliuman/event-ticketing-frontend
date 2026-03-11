<template>
  <div class="max-w-4xl mx-auto px-6 py-12">

    <h1 class="text-4xl font-extrabold mb-8">My Orders</h1>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card h-24 animate-pulse bg-zinc-800/50"></div>
    </div>

    <!-- Orders list -->
    <div v-else-if="orders.length" class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="card p-6 flex flex-col sm:flex-row sm:items-center gap-4">

        <!-- Event info -->
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono text-zinc-600">#{{ order.id }}</span>
            <span :class="statusClass(order.status)"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
          <h3 class="font-bold text-lg">{{ order.event?.title || 'Event' }}</h3>
          <div class="text-sm text-zinc-500 mt-1 flex flex-wrap gap-3">
            <span>{{ order.event?.venue }}</span>
            <span v-if="order.event?.date">· {{ formatDate(order.event.date) }}</span>
          </div>
        </div>

        <!-- Order details -->
        <div class="text-right flex-shrink-0">
          <div class="text-xl font-bold text-amber-400">{{ order.total_amount_display }}</div>
          <div class="text-sm text-zinc-500">{{ order.quantity }} ticket(s)</div>
          <div class="text-xs text-zinc-700 mt-1">{{ formatDate(order.created_at) }}</div>
        </div>

      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-24">
      <p class="text-zinc-500 text-lg mb-4">You haven't purchased any tickets yet.</p>
      <RouterLink to="/" class="btn-primary">Browse Events</RouterLink>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 mt-8">
      <button v-for="page in pagination.last_page" :key="page"
              @click="fetchOrders(page)"
              :class="page === pagination.current_page
                ? 'bg-amber-400 text-zinc-900 font-bold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'"
              class="w-10 h-10 rounded-lg text-sm transition">
        {{ page }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const orders     = ref([])
const loading    = ref(true)
const pagination = ref({ current_page: 1, last_page: 1 })

async function fetchOrders(page = 1) {
  loading.value = true
  try {
    const { data } = await api.get('/orders', { params: { page } })
    orders.value     = data.data.orders
    pagination.value = data.data.pagination
  } finally {
    loading.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status) {
  const map = {
    paid:     'bg-green-500/15 text-green-400',
    pending:  'bg-yellow-500/15 text-yellow-400',
    failed:   'bg-red-500/15 text-red-400',
    refunded: 'bg-zinc-500/20 text-zinc-400',
  }
  return map[status] || 'bg-zinc-500/20 text-zinc-400'
}

onMounted(fetchOrders)
</script>

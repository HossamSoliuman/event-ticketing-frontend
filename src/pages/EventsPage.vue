<template>
  <div class="max-w-6xl mx-auto px-6 py-12">

    <!-- Hero -->
    <div class="mb-12">
      <h1 class="text-5xl font-extrabold tracking-tight mb-3">
        Upcoming <span class="text-amber-400">Events</span>
      </h1>
      <p class="text-zinc-400 text-lg">Discover and book tickets for the best events near you.</p>
    </div>

    <!-- Search -->
    <div class="mb-8">
      <input v-model="search" @input="debouncedFetch" type="text"
             placeholder="Search events, venues..."
             class="input max-w-md" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card h-72 animate-pulse bg-zinc-800/50"></div>
    </div>

    <!-- Events grid -->
    <div v-else-if="events.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink v-for="event in events" :key="event.id"
                  :to="`/events/${event.id}`"
                  class="card group hover:border-zinc-600 transition-all duration-300">

        <!-- Image -->
        <div class="relative h-44 overflow-hidden">
          <img v-if="event.image_url" :src="event.image_url" :alt="event.title"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div v-else class="w-full h-full bg-zinc-800 flex items-center justify-center">
            <svg class="w-12 h-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div v-if="event.is_sold_out" class="absolute inset-0 bg-zinc-950/80 flex items-center justify-center">
            <span class="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">SOLD OUT</span>
          </div>
          <div class="absolute top-3 right-3 bg-amber-400 text-zinc-900 text-sm font-bold px-3 py-1 rounded-lg">
            {{ event.price_display }}
          </div>
        </div>

        <!-- Info -->
        <div class="p-5">
          <h3 class="font-bold text-lg mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {{ event.title }}
          </h3>
          <div class="flex items-center gap-1.5 text-zinc-500 text-sm mb-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <span class="truncate">{{ event.venue }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-zinc-500 text-sm">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>{{ formatDate(event.date) }}</span>
          </div>
          <div class="mt-3 text-xs text-zinc-600">{{ event.available_tickets }} tickets left</div>
        </div>
      </RouterLink>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-24">
      <p class="text-zinc-500 text-lg">No events found.</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 mt-12">
      <button v-for="page in pagination.last_page" :key="page"
              @click="fetchEvents(page)"
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

const events     = ref([])
const loading    = ref(true)
const search     = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })
let debounceTimer = null

function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchEvents(1), 400)
}

async function fetchEvents(page = 1) {
  loading.value = true
  try {
    const { data } = await api.get('/events', { params: { page, search: search.value, per_page: 9 } })
    events.value     = data.data.events
    pagination.value = data.data.pagination
  } finally {
    loading.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => fetchEvents())
</script>

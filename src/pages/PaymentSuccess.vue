<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">

      <!-- Success icon -->
      <div class="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <h1 class="text-4xl font-extrabold mb-3">Payment Confirmed!</h1>
      <p class="text-zinc-400 mb-2">
        Your tickets for order <span class="text-amber-400 font-semibold">#{{ orderId }}</span> are confirmed.
      </p>
      <p class="text-zinc-500 text-sm mb-8">A confirmation has been recorded. Enjoy the event! 🎉</p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <RouterLink to="/my-orders" class="btn-primary">View My Orders</RouterLink>
        <RouterLink to="/" class="btn-outline">Browse More Events</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
const orderId = useRoute().query.order_id
</script>

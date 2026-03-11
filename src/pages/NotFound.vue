<template>
  <div class="min-h-[80vh] flex items-center justify-center text-center px-4">
    <div>
      <p class="text-8xl font-extrabold text-zinc-800 mb-4">404</p>
      <h1 class="text-3xl font-bold mb-3">Page not found</h1>
      <p class="text-zinc-500 mb-8">The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn-primary">Go home</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

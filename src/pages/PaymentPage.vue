<template>
  <div class="max-w-lg mx-auto px-6 py-12">

    <RouterLink to="/" class="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to events
    </RouterLink>

    <h1 class="text-3xl font-extrabold mb-2">Complete Payment</h1>
    <p class="text-zinc-500 mb-8">Order #{{ orderId }} — {{ amountDisplay }}</p>

    <div class="card p-6 space-y-6">

      <!-- Stripe Elements mount point -->
      <div>
        <label class="block text-sm font-medium text-zinc-400 mb-3">Card details</label>
        <div id="payment-element" class="bg-zinc-800 rounded-xl p-4 min-h-[56px]"></div>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
        {{ error }}
      </p>

      <!-- Pay button -->
      <button @click="handlePayment" :disabled="!stripeReady || paying"
              class="btn-primary w-full">
        {{ paying ? 'Processing payment...' : `Pay ${amountDisplay}` }}
      </button>

      <!-- Test card hint -->
      <p class="text-xs text-zinc-600 text-center">
        Test card: <span class="font-mono text-zinc-500">4242 4242 4242 4242</span> · any future date · any CVC
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import api from '../services/api'

const route  = useRoute()
const router = useRouter()

const orderId     = route.query.order_id
const amountDisplay = route.query.label || ''

const stripeReady = ref(false)
const paying      = ref(false)
const error       = ref('')

let stripe, elements

onMounted(async () => {
  if (!orderId) {
    router.push('/')
    return
  }

  try {
    // 1. Load Stripe.js
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY)

    // 2. Get the client_secret from our backend
    const { data } = await api.post('/payments/create-intent', { order_id: Number(orderId) })
    const clientSecret = data.data.client_secret

    // 3. Mount Stripe Elements
    elements = stripe.elements({ clientSecret, appearance: stripeAppearance })
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')
    paymentElement.on('ready', () => { stripeReady.value = true })
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to initialize payment.'
  }
})

async function handlePayment() {
  paying.value = true
  error.value  = ''

  try {
    // 4. Confirm the payment via Stripe.js (collects card details)
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment/success` },
      redirect: 'if_required',
    })

    if (stripeError) {
      error.value = stripeError.message
      paying.value = false
      return
    }

    // 5. Server-side verification
    await api.post('/payments/confirm', {
      payment_intent_id: paymentIntent.id,
      order_id: Number(orderId),
    })

    // 6. Redirect to success
    router.push({ path: '/payment/success', query: { order_id: orderId } })

  } catch (e) {
    error.value = e.response?.data?.message || 'Payment failed. Please try again.'
    paying.value = false
  }
}

// Dark theme for Stripe Elements
const stripeAppearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#fbbf24',
    colorBackground: '#18181b',
    colorText: '#f4f4f5',
    colorDanger: '#f87171',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '12px',
  },
}
</script>

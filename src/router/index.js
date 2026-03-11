import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Pages — lazily imported so each page is a separate JS chunk
const EventsPage       = () => import('../pages/EventsPage.vue')
const EventDetailPage  = () => import('../pages/EventDetailPage.vue')
const LoginPage        = () => import('../pages/LoginPage.vue')
const RegisterPage     = () => import('../pages/RegisterPage.vue')
const PaymentPage      = () => import('../pages/PaymentPage.vue')
const PaymentSuccess   = () => import('../pages/PaymentSuccess.vue')
const MyOrdersPage     = () => import('../pages/MyOrdersPage.vue')
const NotFound         = () => import('../pages/NotFound.vue')

const routes = [
  { path: '/',               component: EventsPage },
  { path: '/events/:id',     component: EventDetailPage },
  { path: '/login',          component: LoginPage,      meta: { guestOnly: true } },
  { path: '/register',       component: RegisterPage,   meta: { guestOnly: true } },
  { path: '/payment',        component: PaymentPage,    meta: { requiresAuth: true } },
  { path: '/payment/success', component: PaymentSuccess, meta: { requiresAuth: true } },
  { path: '/my-orders',      component: MyOrdersPage,   meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guards
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { path: '/' }
  }
})

export default router

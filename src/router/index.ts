import { createRouter, createWebHistory } from 'vue-router'
import type { League } from '@/types'
import HomeView from '@/views/HomeView.vue'
import LeagueView from '@/views/LeagueView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/league/:id/:slug',
      name: 'league',
      component: LeagueView,
      props: () => ({ league: window.history.state.league as League | undefined }),
    },
  ],
})

export default router

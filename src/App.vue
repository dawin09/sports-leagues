<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('route-forward')
let historyPosition = window.history.state?.position ?? 0

watch(
  () => route.path,
  () => {
    const nextPosition = window.history.state?.position ?? historyPosition

    transitionName.value = nextPosition < historyPosition ? 'route-back' : 'route-forward'
    historyPosition = nextPosition
  },
  { flush: 'sync' },
)
</script>

<template>
  <header>
    <img src="/sporty-logo.jpeg" alt="Sports Leagues Explorer Logo" width="100" height="100" />
    <h1>Sports Leagues</h1>
    <small>Explore sports leagues from across the globe.</small>
  </header>
  <RouterView v-slot="{ Component, route: currentRoute }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="currentRoute.path" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin: 0;
  }
}
</style>

<style lang="scss">
.route-forward-enter-active,
.route-forward-leave-active,
.route-back-enter-active,
.route-back-leave-active {
  width: 100%;
  transition:
    transform 300ms ease,
    opacity 300ms ease;
}

.route-forward-enter-to,
.route-forward-leave-from,
.route-back-enter-to,
.route-back-leave-from {
  opacity: 1;
}

.route-forward-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.route-forward-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.route-back-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.route-back-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .route-forward-enter-active,
  .route-forward-leave-active,
  .route-back-enter-active,
  .route-back-leave-active {
    transition: none;
  }
}
</style>

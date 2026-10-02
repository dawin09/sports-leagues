<script setup lang="ts">
import type { League } from '@/types'
import LeagueItem from './LeagueItem.vue'

const SKELETON_COUNT = 5

defineProps({
  leagues: {
    type: Array as () => League[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'select-league': (league: League) => league,
})
</script>

<template>
  <div class="leagues-grid" :aria-busy="isLoading">
    <template v-if="isLoading">
      <LeagueItem v-for="index in SKELETON_COUNT" :key="`league-skeleton-${index}`" is-loading />
    </template>

    <p v-else-if="leagues.length === 0">No leagues found.</p>

    <template v-else>
      <LeagueItem
        v-for="league in leagues"
        :key="league.idLeague"
        :league="league"
        @select-league="emit('select-league', $event)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-rows: repeat(2, minmax(200px, auto));
  grid-auto-rows: minmax(200px, auto);
  gap: 16px;
  overflow-y: auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .leagues-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .leagues-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

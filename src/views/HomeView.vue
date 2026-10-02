<script setup lang="ts">
import { useLeaguesStore } from '@/stores/leagues'
import { useRouter } from 'vue-router'
import LeaguesList from '@/components/LeaguesList.vue'
import LeagueFilters from '@/components/LeagueFilters.vue'
import type { League } from '@/types'

const leaguesStore = useLeaguesStore()
const router = useRouter()

void leaguesStore.fetchLeagues()

function createSlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function navigateToLeague(league: League) {
  void router.push({
    name: 'league',
    params: { slug: createSlug(league.strLeague), id: league.idLeague },
    state: { league: { ...league } },
  })
}
</script>

<template>
  <main>
    <LeagueFilters
      :sports-list="leaguesStore.sportsList"
      :selected-sport="leaguesStore.selectedSport"
      :search-query="leaguesStore.searchQuery"
      @update:selectedSport="(value) => (leaguesStore.selectedSport = value)"
      @update:searchQuery="(value) => (leaguesStore.searchQuery = value)"
    />
    <LeaguesList
      :is-loading="leaguesStore.isLoading"
      :leagues="leaguesStore.filteredLeagues"
      class="leagues-list"
      @select-league="navigateToLeague"
    />
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .leagues-list {
    flex: 1;
  }
}
</style>

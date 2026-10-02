import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter, type LocationQuery, type LocationQueryValue } from 'vue-router'
import type { League, AllLeaguesResponse } from '@/types'

const API_URL = 'https://www.thesportsdb.com/api/v1/json/3'

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getQueryValue(value: LocationQueryValue | LocationQueryValue[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

export const useLeaguesStore = defineStore('leagues', () => {
  const route = useRoute()
  const router = useRouter()
  const leagues = ref<League[]>([])
  const hasFetchedLeagues = ref(false)
  const searchQuery = ref(getQueryValue(route.query.search))
  const selectedSport = ref(getQueryValue(route.query.sport) || 'all')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function setFiltersFromQuery(query: LocationQuery) {
    searchQuery.value = getQueryValue(query.search)
    selectedSport.value = getQueryValue(query.sport) || 'all'
  }

  function updateRouteFromFilters() {
    const search = searchQuery.value.trim()
    const currentSearch = getQueryValue(route.query.search)
    const currentSport = getQueryValue(route.query.sport) || 'all'

    if (search === currentSearch && selectedSport.value === currentSport) {
      return
    }

    const query = { ...route.query }

    if (search) {
      query.search = search
    } else {
      delete query.search
    }

    if (selectedSport.value !== 'all') {
      query.sport = selectedSport.value
    } else {
      delete query.sport
    }

    void router.replace({ query })
  }

  watch(
    () => route.query,
    (query) => setFiltersFromQuery(query),
  )
  watch([searchQuery, selectedSport], updateRouteFromFilters)

  const sportsList = computed(() => {
    const sports = new Set(leagues.value.map((league) => league.strSport))
    return Array.from(sports).sort()
  })

  const filteredLeagues = computed(() => {
    let filteredLeagues = leagues.value

    if (selectedSport.value !== 'all') {
      filteredLeagues = filteredLeagues.filter((league) => league.strSport === selectedSport.value)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim().toLowerCase()
      filteredLeagues = filteredLeagues.filter((league) =>
        league.strLeague.toLowerCase().includes(query),
      )
    }

    return filteredLeagues
  })

  async function fetchLeagues() {
    if (hasFetchedLeagues.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      await delay(1000) // Simulate network delay for demonstration purposes

      const response = await fetch(`${API_URL}/all_leagues.php`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AllLeaguesResponse = await response.json()
      leagues.value = data.leagues
      hasFetchedLeagues.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch leagues'
      console.error('Error fetching leagues:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    leagues,
    hasFetchedLeagues,
    searchQuery,
    selectedSport,
    isLoading,
    error,

    filteredLeagues,
    sportsList,

    fetchLeagues,
  }
})

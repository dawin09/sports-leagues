import type { League, Season, SeasonBadgeResponse } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const API_URL = 'https://www.thesportsdb.com/api/v1/json/3'

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const useSeasonBadgesStore = defineStore('seasonBadges', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const seasonsByLeague = ref<Record<string, Season[]>>({})
  const selectedLeague = ref<League | null>(null)
  const seasons = computed(() => {
    if (!selectedLeague.value) {
      return []
    }

    return seasonsByLeague.value[selectedLeague.value.idLeague] ?? []
  })

  async function fetchSeasonBadges(leagueId: string) {
    if (Object.hasOwn(seasonsByLeague.value, leagueId)) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      await delay(1000) // Simulate network delay for demonstration purposes

      const response = await fetch(`${API_URL}/search_all_seasons.php?badge=1&id=${leagueId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SeasonBadgeResponse = await response.json()

      seasonsByLeague.value[leagueId] = data.seasons ?? []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch season badges'
      console.error('Error fetching season badges:', err)
    } finally {
      isLoading.value = false
    }
  }

  function setSelectedLeague(league: League) {
    selectedLeague.value = league
    void fetchSeasonBadges(league.idLeague)
  }

  return {
    selectedLeague,
    setSelectedLeague,
    seasons,
    seasonsByLeague,
    isLoading,
    error,
  }
})

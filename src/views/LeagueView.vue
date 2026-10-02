<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { League } from '@/types'
import { useSeasonBadgesStore } from '@/stores/season-badges'
import { useLeaguesStore } from '@/stores/leagues'
import { ref } from 'vue'
import SeasonBadgesList from '@/components/SeasonBadgesList.vue'

const props = defineProps({
  league: {
    type: Object as () => League,
    required: false,
  },
})

const router = useRouter()
const route = useRoute()
const seasonBadgesStore = useSeasonBadgesStore()
const leaguesStore = useLeaguesStore()
const league = ref(props.league)

async function loadLeague() {
  if (props.league) {
    seasonBadgesStore.setSelectedLeague(props.league)
    return
  }

  await leaguesStore.fetchLeagues()
  league.value = leaguesStore.leagues.find((league) => league.idLeague === route.params.id)

  if (league.value) {
    seasonBadgesStore.setSelectedLeague(league.value)
  }
}

void loadLeague()
</script>

<template>
  <main class="league-view">
    <div v-if="league" class="league-header">
      <button type="button" class="back-button" aria-label="Back to leagues" @click="router.back()">
        {{ '<' }}
      </button>
      <div class="league-title">
        <h1>{{ league.strLeague }}</h1>
        <p>{{ league.strSport }}</p>
        <p v-if="league.strLeagueAlternate">Also known as: {{ league.strLeagueAlternate }}</p>
      </div>
    </div>
    <div class="season-badges">
      <h4>Season badges</h4>
      <SeasonBadgesList
        :badges="seasonBadgesStore.seasons"
        :is-loading="seasonBadgesStore.isLoading"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.league-view {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }

  .league-header {
    display: flex;
    align-items: baseline;
    gap: 15px;

    .back-button {
      color: var(--primary-color);
      background: transparent;
      font-size: 1.5rem;
      padding: 5px 13px;
      font-weight: bold;
      border: 1px solid var(--primary-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .league-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;

      h1 {
        color: var(--primary-color);
      }

      p {
        margin: 0;
        font-size: 1rem;
        color: #666;
      }
    }

    @media (max-width: 768px) {
      gap: 10px;

      .back-button {
        align-self: center;
      }

      .league-title {
        h1 {
          font-size: 1.3em;
        }
      }
    }
  }

  .season-badges {
    width: 100%;
    padding-left: 55px;
    padding-top: 20px;

    @media (max-width: 768px) {
      padding-left: 0;
    }
  }
}
</style>

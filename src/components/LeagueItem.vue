<script setup lang="ts">
import { computed } from 'vue'
import type { League } from '@/types'

const leagueLogos: Record<string, string> = {
  'English League Championship': '/leagues-logos/english-league-championship.webp',
  'English Premier League': '/leagues-logos/english-premier-league.webp',
  'German Bundesliga': '/leagues-logos/german-bundesliga.webp',
  'Italian Serie A': '/leagues-logos/italian-serie-a.webp',
  'Scottish Premier League': '/leagues-logos/scottish-premier-league.webp',
  'French Ligue 1': '/leagues-logos/ligue-1.png',
  'Spanish La Liga': '/leagues-logos/la-liga.webp',
  'Greek Super League 1': '/leagues-logos/greek-super-league-1.webp',
  'Dutch Eredivisie': '/leagues-logos/dutch-eredivisie.webp',
  'Belgian Pro League': '/leagues-logos/belgian-pro-league.webp',
}

const props = defineProps({
  league: {
    type: Object as () => League,
    default: undefined,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'select-league': (league: League) => league,
})

const leagueLogo = computed(() => (props.league ? leagueLogos[props.league.strLeague] : undefined))
</script>

<template>
  <div v-if="isLoading" class="league-item league-item--loading" aria-hidden="true">
    <span class="skeleton skeleton-logo"></span>
    <span class="skeleton skeleton-title"></span>
    <span class="skeleton skeleton-sport"></span>
  </div>

  <button v-else-if="league" class="league-item" @click="emit('select-league', league)">
    <img
      v-if="leagueLogo"
      class="league-logo"
      :src="leagueLogo"
      :alt="`${league.strLeague} logo`"
    />
    <h4>{{ league.strLeague }}</h4>
    <p>{{ league.strSport }}</p>
    <p v-if="league.strLeagueAlternate">Also known as: {{ league.strLeagueAlternate }}</p>
  </button>
</template>

<style scoped lang="scss">
.league-item {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  transition:
    transform 0.2s,
    border-color 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  min-height: 200px;

  &--loading {
    align-items: center;
    border-color: #e2e2e2;
    cursor: default;
  }

  .league-logo {
    width: 100%;
    height: 100px;
    margin-bottom: 12px;
    object-fit: contain;
  }

  h4 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    transition: color 0.2s;
  }

  p {
    margin: 8px 0 0;
    font-size: 0.75rem;
    color: #666;
    transition: color 0.2s;
  }

  &:hover,
  &:focus-visible {
    transform: scale(1.03);
    border-color: var(--primary-color);

    h4,
    p {
      color: var(--primary-color);
    }
  }
}

.skeleton {
  display: block;
  border-radius: var(--border-radius);
  background: linear-gradient(90deg, #ededed 25%, #f7f7f7 50%, #ededed 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s ease-in-out infinite;

  &-logo {
    width: 70%;
    height: 100px;
    margin-bottom: 16px;
  }

  &-title {
    width: 65%;
    height: 20px;
  }

  &-sport {
    width: 35%;
    height: 12px;
    margin-top: 10px;
  }
}

@keyframes skeleton-loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>

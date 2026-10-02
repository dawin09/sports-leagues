<script setup lang="ts">
import type { Season } from '@/types'

const SKELETON_COUNT = 5

defineProps({
  badges: {
    type: Array as () => Season[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="badges-grid" :aria-busy="isLoading">
    <template v-if="isLoading">
      <figure
        v-for="index in SKELETON_COUNT"
        :key="`season-skeleton-${index}`"
        class="badge-skeleton"
        aria-hidden="true"
      >
        <span class="skeleton skeleton-badge"></span>
        <span class="skeleton skeleton-caption"></span>
      </figure>
    </template>

    <template v-else>
      <figure v-for="season in badges" :key="season.strSeason">
        <img
          class="badge-image"
          :src="season.strBadge || '/season-badge-placeholder.svg'"
          :alt="
            season.strBadge
              ? `Badge for ${season.strSeason}`
              : `No badge available for ${season.strSeason}`
          "
          loading="lazy"
        />
        <figcaption>{{ season.strSeason }}</figcaption>
      </figure>
    </template>
  </div>
</template>

<style scoped lang="scss">
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 20px 0;

  figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0;
    background-color: #e6e4e4;
    padding: 15px;
    border-radius: var(--border-radius);
    transition: transform 0.2s;

    .badge-image {
      width: 110px;
      height: 110px;
      object-fit: contain;
      border-radius: 8px;
      margin-bottom: 8px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    figcaption {
      font-size: 0.9rem;
      color: #333;
    }

    &:not(.badge-skeleton):hover {
      transform: scale(1.05);
      border: 1px solid var(--primary-color);
    }
  }
}

.badge-skeleton {
  justify-content: center;
  min-height: 190px;
}

.skeleton {
  display: block;
  border-radius: var(--border-radius);
  background: linear-gradient(90deg, #d8d8d8 25%, #eeeeee 50%, #d8d8d8 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s ease-in-out infinite;

  &-badge {
    width: 110px;
    height: 110px;
    margin-bottom: 14px;
    border-radius: 50%;
  }

  &-caption {
    width: 65%;
    height: 14px;
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

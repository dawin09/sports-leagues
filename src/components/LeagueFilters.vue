<template>
  <div class="league-filters">
    <input
      :value="searchQuery"
      type="text"
      name="query-input"
      placeholder="Search leagues..."
      @input="(event) => emit('update:searchQuery', (event.target as HTMLInputElement).value)"
    />
    <select
      name="sports-filter"
      :value="selectedSport"
      @change="(event) => emit('update:selectedSport', (event.target as HTMLSelectElement).value)"
    >
      <option value="all">All Sports</option>
      <option v-for="sport in sportsList" :key="sport" :value="sport">{{ sport }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps({
  sportsList: {
    type: Array as () => string[],
    required: true,
  },
  selectedSport: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits({
  'update:selectedSport': (value: string) => typeof value === 'string',
  'update:searchQuery': (value: string) => typeof value === 'string',
})
</script>

<style scoped lang="scss">
.league-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: min(700px, calc(100% - 40px));
  margin: 0 auto;
  height: 40px;

  input {
    flex: 1;
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 10px;
  }

  select {
    min-width: 30%;
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 10px;
  }
}
</style>

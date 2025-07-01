<template>
  <div class="filter-section">
    <div class="filter-group">
      <label for="sortBy" class="filter-label">Sort by:</label>
      <select :value="sortBy" @change="$emit('update:sortBy', $event.target.value)" id="sortBy" class="filter-select">
        <option value="latest">Latest</option>
        <option value="rating-high">Highest Rated</option>
        <option value="rating-low">Lowest Rated</option>
        <option value="most-reviewed">Most Reviewed</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="selectedCategory" class="filter-label">Category:</label>
      <select :value="selectedCategory" @change="$emit('update:selectedCategory', $event.target.value)" id="selectedCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="(name, key) in categories" :key="key" :value="key">
          {{ name }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label for="ratingFilter" class="filter-label">Rating:</label>
      <select :value="ratingFilter" @change="$emit('update:ratingFilter', $event.target.value)" id="ratingFilter" class="filter-select">
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
        <option value="2">2+ Stars</option>
        <option value="1">1+ Stars</option>
      </select>
    </div>
  </div>
</template>

<script>
// Remove <script setup> and use a regular <script> tag
import { categoriesMap } from '../../constants/dummydata';
export default {
  // Define props here using the 'props' option
  props: {
    sortBy: String,
    selectedCategory: String,
    ratingFilter: [String, Number],
  },
  // Define emits here using the 'emits' option
  emits: ['update:sortBy', 'update:selectedCategory', 'update:ratingFilter'],

  // Data, methods, computed properties, etc., would go here.
  // For the categories map, you can make it a computed property or directly reference it.
  data() {
    return {
      // If you needed reactive local state, it would go here
    };
  },
  computed: {
    // You can expose categoriesMap through a computed property or directly reference it in the template
    categories() {
      return categoriesMap; // Expose the imported map to the template
    }
  },
  methods: {
    // If you had any methods, they would be defined here
  }
};
</script>

<style scoped>
/* Scoped styles for CompanyFilters */
.filter-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl); /* Using a variable from base.css */
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm); /* Using a variable from base.css */
  text-align: left;
}

.filter-label {
  font-weight: var(--font-weight-semibold); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  font-size: var(--font-size-md); /* Using a variable from base.css */
  text-align: left;
}

.filter-select {
  border: 1px solid var(--color-border); /* Using a variable from base.css */
  border-radius: var(--border-radius-md); /* Using a variable from base.css */
  padding: 12px 16px;
  font-size: var(--font-size-md); /* Using a variable from base.css */
  background: var(--color-background); /* Using a variable from base.css */
  color: var(--color-text); /* Using a variable from base.css */
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition-ease); /* Using a variable from base.css */
  font-weight: var(--font-weight-regular); /* Using a variable from base.css */
}

.filter-select:focus {
  border-color: var(--color-primary); /* Using a variable from base.css */
  outline: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .filter-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md); /* Using a variable from base.css */
  }
}
</style>
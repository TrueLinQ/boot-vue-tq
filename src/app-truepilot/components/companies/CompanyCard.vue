<template>
  <div class="company-card" @click="$emit('viewCompany', company)">
    <div class="company-header">
      <div class="company-logo">
        <img :src="company.logo" alt="logo" />
      </div>
      <div class="company-title-section">
        <h3 class="company-name">{{ company.name }}</h3>
        <span class="company-category">{{ getCategoryName(company.category) }}</span>
      </div>
    </div>

    <div class="rating-section">
      <div class="stars-display">
        <StarIcon
          v-for="i in 5"
          :key="i"
          :size="16"
          :class="['star-small', i <= company.rating ? 'star-filled' : 'star-empty']"
        />
      </div>
      <span class="rating-text">{{ company.rating.toFixed(1) }}</span>
      <span class="review-count">({{ company.reviewCount }} reviews)</span>
    </div>

    <p class="company-description">{{ company.description }}</p>

    <div class="company-stats">
      <div class="stat-item">
        <span class="stat-label">Founded:</span>
        <span class="stat-value">{{ company.founded }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Employees:</span>
        <span class="stat-value">{{ company.employees }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Star as StarIcon } from "lucide-vue";
import { categoriesMap } from "../../constants/dummydata";

export default {
  components: {
    StarIcon // You'd need to explicitly register components here
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  emits: ['viewCompany'], // Emits are just listed as strings or objects
  methods: {
    getCategoryName(category) {
      return categoriesMap[category] || category;
    },
    // If you had other methods, they'd go here
  }
};
</script>

<style scoped>
/* Scoped styles for CompanyCard */
.company-card {
  background: var(--color-background); /* Using a variable from base.css */
  border: 2px solid var(--color-border); /* Using a variable from base.css */
  border-radius: var(--border-radius-lg); /* Using a variable from base.css */
  padding: var(--spacing-lg); /* Using a variable from base.css */
  transition: var(--transition-ease); /* Using a variable from base.css */
  cursor: pointer;
  display: flex; /* Make it a flex container */
  flex-direction: column; /* Stack children vertically */
}

.company-card:hover {
  border-color: var(--color-primary); /* Using a variable from base.css */
  transform: translateY(-2px);
  box-shadow: var(--shadow-md); /* Using a variable from base.css */
}

.company-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md); /* Using a variable from base.css */
  margin-bottom: var(--spacing-md); /* Using a variable from base.css */
}

.company-logo {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.company-logo img {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-sm); /* Using a variable from base.css */
  object-fit: cover;
}

.company-title-section {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.company-name {
  font-size: var(--font-size-lg); /* Using a variable from base.css */
  font-weight: var(--font-weight-semibold); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  margin: 0 0 var(--spacing-xs) 0; /* Using a variable from base.css */
  line-height: 1.3;
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow */
}

.company-category {
  display: inline-block;
  background: var(--color-gray-light); /* Using a variable from base.css */
  color: var(--color-text-dark); /* Using a variable from base.css */
  padding: 4px 8px;
  border-radius: var(--border-radius-xs); /* Using a variable from base.css */
  font-size: var(--font-size-xs); /* Using a variable from base.css */
  font-weight: var(--font-weight-medium); /* Using a variable from base.css */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm); /* Using a variable from base.css */
  margin-bottom: var(--spacing-md); /* Using a variable from base.css */
  flex-wrap: wrap;
}

.stars-display {
  display: flex;
  gap: 2px;
}

.star-small.star-filled {
  color: var(--color-primary); /* Using a variable from base.css */
  fill: var(--color-primary); /* Using a variable from base.css */
}

.star-small.star-empty {
  color: var(--color-gray); /* Using a variable from base.css */
}

.rating-text {
  font-weight: var(--font-weight-semibold); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  font-size: var(--font-size-sm); /* Using a variable from base.css */
}

.review-count {
  color: var(--color-text-light); /* Using a variable from base.css */
  font-size: var(--font-size-sm); /* Using a variable from base.css */
}

.company-description {
  color: var(--color-text-light); /* Using a variable from base.css */
  font-size: var(--font-size-sm); /* Using a variable from base.css */
  line-height: 1.5;
  margin: 0 0 var(--spacing-md) 0; /* Using a variable from base.css */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  flex-grow: 1; /* Allows description to take up available space */
}

.company-stats {
  display: flex;
  gap: var(--spacing-md); /* Using a variable from base.css */
  flex-wrap: wrap;
  margin-top: auto; /* Pushes stats to the bottom of the card */
}

.stat-item {
  display: flex;
  gap: 4px;
  font-size: var(--font-size-xs); /* Using a variable from base.css */
}

.stat-label {
  color: var(--color-text-light); /* Using a variable from base.css */
  font-weight: var(--font-weight-medium); /* Using a variable from base.css */
}

.stat-value {
  color: var(--color-heading); /* Using a variable from base.css */
  font-weight: var(--font-weight-semibold); /* Using a variable from base.css */
}
</style>
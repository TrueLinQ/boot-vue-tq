<template>
  <div class="rating-overview-section">
    <div class="rating-summary">
      <div class="overall-rating">
        <span class="rating-number">{{ company.rating.toFixed(1) }}</span>
        <div class="rating-stars">
          <Star
            v-for="i in 5"
            :key="i"
            :size="20"
            :class="['star', i <= company.rating ? 'star-filled' : 'star-empty']"
          />
        </div>
        <span class="total-reviews">{{ company.reviewCount }} reviews</span>
      </div>
    </div>

    <!-- Rating Distribution -->
    <div class="rating-distribution">
      <h3>Rating Distribution</h3>
      <div class="rating-bars">
        <div
          v-for="rating in [5, 4, 3, 2, 1]"
          :key="rating"
          class="rating-bar-row"
          @click="$emit('filter-by-rating', rating)"
          :class="{ active: selectedRatingFilter === rating }"
        >
          <span class="rating-label">{{ rating }} stars</span>
          <div class="rating-bar-container">
            <div 
              class="rating-bar-fill" 
              :style="{ width: getRatingPercentage(rating) + '%' }"
            ></div>
          </div>
          <span class="rating-count">{{ getRatingCount(rating) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Star } from "lucide-vue";

export default {
  name: "CompanyRating",
  components: {
    Star,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
    selectedRatingFilter: {
      type: Number,
      default: null,
    },
  },
  emits: ['filter-by-rating'],
  methods: {
    getRatingCount(rating) {
      return this.reviews.filter(review => review.rating === rating).length;
    },

    getRatingPercentage(rating) {
      if (this.reviews.length === 0) return 0;
      return (this.getRatingCount(rating) / this.reviews.length) * 100;
    },
  },
};
</script>

<style scoped>
.rating-overview-section {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
}

.rating-summary {
  margin-bottom: var(--spacing-xxl);
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.rating-number {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
}

.rating-stars {
  display: flex;
  gap: var(--spacing-xs);
}

.star.star-filled {
  color: var(--color-primary);
  fill: var(--color-primary);
}

.star.star-empty {
  color: var(--color-gray);
}

.total-reviews {
  font-size: var(--font-size-md);
  color: var(--color-light-text);
  font-weight: var(--font-weight-medium);
}

.rating-distribution h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  margin: 0 0 var(--spacing-lg) 0;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-ease);
}

.rating-bar-row:hover {
  background: var(--color-light-background);
}

.rating-bar-row.active {
  background: var(--color-gray-light);
  border: 1px solid var(--color-primary);
}

.rating-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-dark);
  min-width: 60px;
}

.rating-bar-container {
  flex: 1;
  height: 8px;
  background: var(--color-border);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.rating-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-light-text);
  min-width: 30px;
  text-align: right;
}

@media (max-width: 768px) {
  .rating-overview-section {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .overall-rating {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .rating-number {
    font-size: 36px;
  }
}
</style>
<template>
  <div class="reviews-section-wrapper">
    <!-- Reviews Filter Section -->
    <div class="reviews-filter-section">
      <div class="filter-header">
        <h2>Reviews ({{ reviews.length }})</h2>
        <div class="filter-controls">
          <select :value="reviewSort" @change="$emit('update-sort', $event.target.value)" class="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <button 
            v-if="selectedRatingFilter" 
            @click="$emit('clear-rating-filter')" 
            class="clear-filter-btn"
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-section">
      <div v-if="paginatedReviews.length === 0" class="no-reviews">
        <div class="no-reviews-icon">💬</div>
        <h3>No reviews found</h3>
        <p>Be the first to write a review for this company!</p>
      </div>

      <div v-else class="reviews-list">
        <ReviewCard
          v-for="review in paginatedReviews"
          :key="review.id"
          :review="review"
          @toggle-helpful="$emit('toggle-helpful', review.id)"
        />
      </div>

      <!-- Pagination -->
      <PaginationControls
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @prev-page="$emit('prev-page')"
        @next-page="$emit('next-page')"
        @go-to-page="page => $emit('go-to-page', page)"
      />
    </div>
  </div>
</template>

<script>
import ReviewCard from '../ui/ReviewCard.vue';
import PaginationControls from '../ui/PaginationControls.vue';

export default {
  name: "CompanyReviews",
  components: {
    ReviewCard,
    PaginationControls,
  },
  props: {
    reviews: {
      type: Array,
      required: true,
    },
    reviewSort: {
      type: String,
      required: true,
    },
    selectedRatingFilter: {
      type: Number,
      default: null,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['update-sort', 'clear-rating-filter', 'toggle-helpful', 'prev-page', 'next-page', 'go-to-page'],
  computed: {
    paginatedReviews() {
      const reviewsPerPage = 5;
      const start = (this.currentPage - 1) * reviewsPerPage;
      const end = start + reviewsPerPage;
      return this.reviews.slice(start, end);
    },
  },
};
</script>

<style scoped>
.reviews-section-wrapper {
  margin-bottom: var(--spacing-xxl);
}

/* Reviews Filter */
.reviews-filter-section {
  margin-bottom: var(--spacing-xl);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  margin: 0;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.filter-select {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  background: var(--color-white);
  color: var(--color-heading);
  cursor: pointer;
  transition: var(--transition-ease);
}

.filter-select:focus {
  border-color: var(--color-primary);
  outline: none;
}

.clear-filter-btn {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-light-text);
  cursor: pointer;
  transition: var(--transition-ease);
  font-weight: var(--font-weight-medium);
}

.clear-filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Reviews Section */
.reviews-section {
  margin-bottom: var(--spacing-xxl);
}

.no-reviews {
  text-align: center;
  padding: var(--spacing-xxxl) var(--spacing-lg);
  color: var(--color-light-text);
}

.no-reviews-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.no-reviews h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  margin: 0 0 var(--spacing-sm) 0;
}

.no-reviews p {
  font-size: var(--font-size-md);
  margin: 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: space-between;
  }
}
</style>
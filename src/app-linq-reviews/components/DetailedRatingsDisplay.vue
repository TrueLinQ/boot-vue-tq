<template>
  <div class="detailed-ratings-display">
    <div class="ratings-list">
      <div v-for="rating in ratings" :key="rating.id" class="rating-item">
        <div class="rating-header">
          <span class="rating-label">{{ rating.label }}</span>
          <div class="rating-stars">
            <span 
              v-for="i in 5" 
              :key="i" 
              class="star-small" 
              :class="{ filled: i <= parseInt(rating.value) }"
            >
              ★
            </span>
          </div>
        </div>
        
        <!-- Tags as chips -->
        <div v-if="rating.tags && rating.tags.length > 0" class="tags-container">
          <span v-for="tag in rating.tags" :key="tag.id" class="tag-chip">
            {{ tag.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailedRatingsDisplay",
  props: {
    ratings: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.detailed-ratings-display {
  margin-bottom: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.ratings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.rating-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.rating-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.rating-stars {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.star-small {
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1;
}

.star-small.filled {
  color: #FFD700;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  display: inline-block;
  padding: 4px 10px;
  /* background: #fff;*/
  border: 1px solid #ff4d4d;
  border-radius: 12px;
  font-size: 0.75rem;
  /* color: #666; */
  font-weight: 400;
  line-height: 1.4;
  background: #ffe5e5;
  border-color: #ff4d4d;
  color: #b30000;
}

@media (max-width: 480px) {
  .rating-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .rating-stars {
    width: 100%;
  }
}
</style>
<template>
  <div class="detailed-ratings">
    <div class="detailed-ratings-header">
      <h3>Tell us more about your experience</h3>
      <p>Rate each category and select relevant issues</p>
    </div>

    <div v-for="(category, index) in categories" :key="category.id" class="category-card"
      :style="{ animationDelay: `${index * 0.1}s` }">
      <div class="category-header">
        <label class="category-label">{{ category.label }}</label>
        <div class="category-rating">
          <button v-for="star in 5" :key="star" type="button" class="star-button-small"
            :class="{ active: star <= (ratings[category.id]?.value || 0) }" @click="updateRating(category.id, star)">
            ★
          </button>
        </div>
      </div>

      <div v-if="category.tags && category.tags.length > 0" class="tags-container">
        <p class="tags-label">Select issues (optional):</p>
        <div class="tags-grid">
          <button v-for="tag in category.tags" :key="tag.id" type="button" class="tag-chip"
            :class="{ selected: isTagSelected(category.id, tag.id) }" @click="toggleTag(category.id, tag.id)">
            {{ tag.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailedRatings",
  props: {
    categories: {
      type: Array,
      required: true,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      ratings: {},
    };
  },

  watch: {
    categories: {
      immediate: true,
      handler(newCategories) {
        if (newCategories.length > 0 && Object.keys(this.ratings).length === 0) {
          this.initializeRatingsWithValues();
        }
      },
    },
    value: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length > 0) {
          this.ratings = JSON.parse(JSON.stringify(newValue));
        }
      },
    },
  },

  // RENAME initializeRatings TO initializeRatingsWithValues AND UPDATE:
  methods: {
    initializeRatingsWithValues() {
      if (this.categories.length > 0) {
        const initialRatings = {};

        this.categories.forEach((cat) => {
          // Check if there's a pre-filled value from parent
          if (this.value && this.value[cat.id]) {
            initialRatings[cat.id] = {
              value: this.value[cat.id].value || 0,
              tagIds: [...(this.value[cat.id].tagIds || [])],
            };
          } else {
            initialRatings[cat.id] = {
              value: 0,
              tagIds: [],
            };
          }
        });

        this.ratings = initialRatings;
        this.$emit("input", JSON.parse(JSON.stringify(this.ratings)));
        console.log("Initialized ratings with values:", this.ratings);
      }
    },




    // initializeRatings() {
    //   if (this.categories.length > 0) {
    //     const initialRatings = {};
    //     this.categories.forEach((cat) => {
    //       initialRatings[cat.id] = {
    //         value: 0,
    //         tagIds: [],
    //       };
    //     });
    //     this.ratings = initialRatings;

    //     // Emit plain object without Observer wrapper
    //     this.$emit("input", JSON.parse(JSON.stringify(this.ratings)));
    //     console.log("Initialized ratings:", this.ratings);
    //   }
    // },

    updateRating(categoryId, value) {
      if (!this.ratings[categoryId]) {
        this.ratings[categoryId] = { value: 0, tagIds: [] };
      }
      this.ratings[categoryId].value = value;

      // Use Vue.set for reactivity and emit plain object
      this.$set(this.ratings, categoryId, { ...this.ratings[categoryId] });
      this.$emit("input", JSON.parse(JSON.stringify(this.ratings)));
      console.log("Updated rating:", categoryId, value, this.ratings);
    },

    toggleTag(categoryId, tagId) {
      if (!this.ratings[categoryId]) {
        this.ratings[categoryId] = { value: 0, tagIds: [] };
      }

      const tagIds = [...(this.ratings[categoryId].tagIds || [])];
      const index = tagIds.indexOf(tagId);

      if (index > -1) {
        tagIds.splice(index, 1);
      } else {
        tagIds.push(tagId);
      }

      this.ratings[categoryId].tagIds = tagIds;

      // Use Vue.set for reactivity and emit plain object
      this.$set(this.ratings, categoryId, { ...this.ratings[categoryId] });
      this.$emit("input", JSON.parse(JSON.stringify(this.ratings)));
      console.log("Toggled tag:", categoryId, tagId, this.ratings);
    },

    isTagSelected(categoryId, tagId) {
      return this.ratings[categoryId]?.tagIds?.includes(tagId) || false;
    },
  },
};
</script>

<style scoped>
.detailed-ratings {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.detailed-ratings-header {
  margin-bottom: 1.5rem;
}

.detailed-ratings-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.25rem 0;
}

.detailed-ratings-header p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.category-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  animation: slideUpFade 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
}

.category-rating {
  display: flex;
  gap: 0.25rem;
}

.star-button-small {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  line-height: 1;
}

.star-button-small:hover,
.star-button-small.active {
  color: #ffd700;
}

.tags-container {
  margin-top: 0.75rem;
}

.tags-label {
  font-size: 0.8125rem;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-chip {
  padding: 0.5rem 0.875rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 1.25rem;
  font-size: 0.8125rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tag-chip:hover {
  border-color: #999;
  background: #f5f5f5;
}

.tag-chip.selected {
  background: #ffe5e5;
  border-color: #ff4d4d;
  color: #b30000;
}

@media (max-width: 640px) {
  .category-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-rating {
    width: 100%;
  }

  .star-button-small {
    font-size: 1.75rem;
  }
}
</style>

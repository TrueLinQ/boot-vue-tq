<template>
  <div class="connections-container">
    <div class="connections-card">
      <div class="header">
        <div class="header-top">
          <div>
            <h2>Reviews</h2>
            <p>See what people are saying</p>
          </div>

          <!-- Sort Dropdown -->
          <div class="sort-dropdown">
            <select id="sort-select" v-model="selectedSort" @change="handleSortChange" class="sort-select">
              <option value="latest-desc">Latest</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="most_helpful-desc">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Review Tabs -->
      <div class="tabs-container">
        <button @click="switchTab('all')" :class="['tab-button', activeTab === 'all' ? 'tab-active' : '']">
          All Reviews
        </button>
        <button @click="switchTab('my')" :class="['tab-button', activeTab === 'my' ? 'tab-active' : '']">
          My Reviews
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && reviews.length === 0" class="loading-state">
        <p>Loading reviews...</p>
      </div>

      <!-- All Reviews Tab -->
      <div v-else-if="activeTab === 'all'">
        <div v-if="reviews.length === 0" class="empty-state">
          <p>No reviews yet</p>
        </div>
        <div v-else>
          <div class="connections-grid">
            <ReviewCard v-for="review in reviews" :key="`${review.id}-${review.updatedAt}`" :review="review"
              :can-edit="false" :is-updating="false" @react="handleReactToReview" />
          </div>

          <!-- Load More Button for All Reviews -->
          <div v-if="canLoadMore" class="load-more-container">
            <button @click="loadMore" :disabled="loading" class="btn btn-secondary load-more-btn">
              <template v-if="loading">Loading...</template>
              <template v-else>Load More</template>
            </button>
          </div>
        </div>
      </div>

      <!-- My Reviews Tab -->
      <div v-else-if="activeTab === 'my'">
        <div v-if="reviews.length === 0" class="empty-state">
          <p>You haven't written any reviews yet</p>
        </div>
        <div v-else>
          <div class="connections-grid my">
            <ReviewCard v-for="review in reviews" :key="`${review.id}-${review.updatedAt}`" :review="review"
              :can-edit="true" :is-updating="updatingReviewId === review.id" @update="handleUpdateReview"
              @delete="confirmDelete" @react="handleReactToReview" />
          </div>

          <!-- Load More Button for My Reviews -->
          <div v-if="canLoadMore" class="load-more-container">
            <button @click="loadMore" :disabled="loading" class="btn btn-secondary load-more-btn">
              <template v-if="loading">Loading...</template>
              <template v-else>Load More</template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteModal :show="showDeleteModal" :is-deleting="deletingReview" @confirm="deleteReview" @cancel="cancelDelete" />
  </div>
</template>

<script>
import ReviewCard from "./ReviewCard.vue";
import DeleteModal from "./DeleteModal.vue";
import { updateReview, deleteReview, reactToReview } from "../api/reviewCrud";
import { getReviews } from "../api/reviewCrud";

export default {
  name: "CompanyReviews",
  components: {
    ReviewCard,
    DeleteModal,
  },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  emit: ["loading"],
  data() {
    return {
      activeTab: "all",
      loading: false,
      error: null,
      reviews: [],
      totalCount: 0,
      myReviewsCount: 0,
      pageSize: 10,
      startIndex: 0,
      showDeleteModal: false,
      reviewToDelete: null,
      deletingReview: false,
      updatingReviewId: null,
      selectedSort: "latest-desc",
      sortBy: "latest",
      sortOrder: 0,
    };
  },
  computed: {
    canLoadMore() {
      return this.reviews.length < this.totalCount && this.totalCount > 0;
    },
  },
  methods: {
    handleSortChange() {
      const [sortBy, sortOrder] = this.selectedSort.split('-');
      this.sortBy = sortBy;
      this.sortOrder = sortOrder === 'asc' ? 1 : 0;

      this.startIndex = 0;
      this.reviews = [];
      this.totalCount = 0;
      this.loadReviews(false);
    },

    async handleReactToReview(reviewId) {
      try {
        const response = await reactToReview(reviewId);

        if (response) {
          const index = this.reviews.findIndex((r) => r.id === reviewId);
          if (index > -1) {
            const currentReview = this.reviews[index];
            const wasReacted = currentReview.reactedByUser;
            const currentCount = currentReview.helpfulCount || 0;

            // Toggle reaction state
            const updatedReview = {
              ...currentReview,
              reactedByUser: !wasReacted,
              helpfulCount: wasReacted ? Math.max(0, currentCount - 1) : currentCount + 1,
            };

            this.reviews.splice(index, 1, updatedReview);
          }
        }
      } catch (error) {
        this.error = `Failed to react to review: ${error.message}`;
        console.error("React to review error:", error);
        alert(`Failed to react to review. Please try again.`);
      }
    },

    async loadReviews(loadMore = false) {
      this.loading = true;
      this.error = null;

      let currentStartIndex;

      if (!loadMore) {
        currentStartIndex = 0;
        this.reviews = [];
        this.totalCount = 0;
      } else {
        currentStartIndex = this.startIndex;
      }

      try {
        const params = {
          pageSize: this.pageSize,
          startIndex: currentStartIndex,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        };

        const options = {
          byUser: this.activeTab === "my",
        };

        const response = await getReviews(this.organizationId, options, params);

        if (response && response.data && response.data.results) {
          const result = response.data.results[0];

          if (result && result.review && Array.isArray(result.review)) {
            const newReviews = result.review;

            if (loadMore) {
              this.reviews = [...this.reviews, ...newReviews];
            } else {
              this.reviews = newReviews;
            }

            this.totalCount = result.totalCount || 0;

            if (this.activeTab === "my") {
              this.myReviewsCount = this.totalCount;
            }

            if (!loadMore) {
              this.startIndex = 1;
            } else {
              this.startIndex += 1;
            }
          } else {
            if (!loadMore) {
              this.reviews = [];
              this.totalCount = 0;
              this.startIndex = 0;
            }
          }
        } else {
          if (!loadMore) {
            this.reviews = [];
            this.totalCount = 0;
            this.startIndex = 0;
          }
        }
      } catch (error) {
        this.error = `Failed to load reviews: ${error.message}`;
        console.error("Reviews fetch error:", error);

        if (!loadMore) {
          this.reviews = [];
          this.totalCount = 0;
          this.startIndex = 0;
        }
      } finally {
        this.loading = false;
      }
    },

    loadMore() {
      this.loadReviews(true);
    },

    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.startIndex = 0;
        this.reviews = [];
        this.totalCount = 0;
        this.selectedSort = "latest-desc";
        this.sortBy = "latest";
        this.sortOrder = 0;
        this.loadReviews(false);
      }
    },

    // async handleUpdateReview(reviewId, reviewData) {
    //   this.updatingReviewId = reviewId;
    //   this.error = null;

    //   try {
    //     const response = await updateReview(reviewId, reviewData);

    //     if (response && response.data) {
    //       const index = this.reviews.findIndex((r) => r.id === reviewId);
    //       if (index > -1) {
    //         const updatedReview = {
    //           ...this.reviews[index],
    //           overAllRating: reviewData.overAllratings,
    //           title: reviewData.title,
    //           description: reviewData.description,
    //           updatedAt: new Date().toISOString(),
    //         };

    //         this.reviews.splice(index, 1, updatedReview);
    //       }
    //       this.$nextTick(() => {
    //         this.updatingReviewId = null;
    //       });
    //     }
    //   } catch (error) {
    //     this.error = `Failed to update review: ${error.message}`;
    //     console.error("Update review error:", error);
    //     alert(`Failed to update review: ${error.message}`);
    //     throw error;
    //   } finally {
    //     this.updatingReviewId = null;
    //   }
    // },


    // async handleUpdateReview(reviewId, reviewData) {
    //   this.updatingReviewId = reviewId;
    //   this.error = null;

    //   try {
    //     const response = await updateReview(reviewId, reviewData);

    //     if (response && response.data) {
    //       const index = this.reviews.findIndex((r) => r.id === reviewId);
    //       if (index > -1) {
    //         const updatedReview = {
    //           ...this.reviews[index],
    //           overAllRating: reviewData.overAllratings,
    //           title: reviewData.title,
    //           description: reviewData.description,
    //           ratings: reviewData.ratings || this.reviews[index].ratings, // ADD THIS
    //           updatedAt: new Date().toISOString(),
    //         };

    //         this.reviews.splice(index, 1, updatedReview);
    //       }
    //       this.$nextTick(() => {
    //         this.updatingReviewId = null;
    //       });
    //     }
    //   } catch (error) {
    //     this.error = `Failed to update review: ${error.message}`;
    //     console.error("Update review error:", error);
    //     alert(`Failed to update review: ${error.message}`);
    //     throw error;
    //   } finally {
    //     this.updatingReviewId = null;
    //   }
    // },


    async handleUpdateReview(reviewId, reviewData) {
      this.updatingReviewId = reviewId;
      this.error = null;

      try {
        // Make the API call
        const response = await updateReview(reviewId, reviewData);

        if (response && response.data) {
          // Keep the "Saving..." state visible for a moment
          await new Promise(resolve => setTimeout(resolve, 500));

          // Then refresh the reviews list
          await this.loadReviews(false);
        }
      } catch (error) {
        this.error = `Failed to update review: ${error.message}`;
        console.error("Update review error:", error);
        alert(`Failed to update review: ${error.message}`);
        throw error;
      } finally {
        // Only clear the updating state after everything is done
        this.updatingReviewId = null;
      }
    },
    confirmDelete(reviewId) {
      this.reviewToDelete = reviewId;
      this.showDeleteModal = true;
    },

    async deleteReview() {
      if (this.deletingReview) return;

      this.deletingReview = true;
      this.error = null;

      try {
        const response = await deleteReview(this.reviewToDelete);

        if (response) {
          const index = this.reviews.findIndex((r) => r.id === this.reviewToDelete);
          if (index > -1) {
            this.reviews.splice(index, 1);
            this.totalCount -= 1;
            if (this.activeTab === "my") {
              this.myReviewsCount -= 1;
            }
          }

          this.cancelDelete();
        }
      } catch (error) {
        this.error = `Failed to delete review: ${error.message}`;
        console.error("Delete review error:", error);
        this.cancelDelete();
      } finally {
        this.deletingReview = false;
      }
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.reviewToDelete = null;
    },
  },

  mounted() {
    this.loadReviews(false);
  },

  watch: {
    organizationId(newId, oldId) {
      if (newId !== oldId) {
        this.startIndex = 0;
        this.reviews = [];
        this.totalCount = 0;
        this.myReviewsCount = 0;
        this.selectedSort = "latest-desc";
        this.sortBy = "latest";
        this.sortOrder = 0;
        this.loadReviews(false);
      }
    },
  },
};
</script>

<style scoped>
.connections-container {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.header {
  margin-bottom: 30px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  margin: 0;
}

/* Sort Dropdown */
.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-dropdown label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  font-size: 0.875rem;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  min-width: 180px;
}

.sort-select:hover {
  border-color: #999;
}

.sort-select:focus {
  border-color: #007bff;
}

/* Tabs */
.tabs-container {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.tab-button {
  padding: 12px 0;
  margin-right: 32px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #1a1a1a;
}

.tab-active {
  color: #000;
  border-bottom-color: #000;
}

/* States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: #666;
}

.loading-state p,
.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.connections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.connections-grid.my {
  grid-template-columns: repeat(1, 1fr);

}

/* Load More */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 0 24px 24px 24px;
}

.load-more-btn {
  min-width: 120px;
}

/* Buttons */
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #007bff;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover:not(:disabled) {
  background: #e8e8e8;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .connections-container {
    padding: 12px;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-dropdown {
    justify-content: space-between;
  }

  .sort-select {
    flex: 1;
    min-width: auto;
  }

  .connections-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .header {
    padding: 20px 16px 12px 16px;
  }

  .tabs-container {
    padding: 0 16px;
    overflow-x: auto;
  }

  .tab-button {
    flex-shrink: 0;
  }
}
</style>
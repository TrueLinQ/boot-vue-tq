<template>
  <div class="app">
    <div class="container">
      <!-- Search Section -->
      <div class="search-card">
        <div class="search-section">
          <div class="search-bar">
            <CompanySearch 
              :simple-search="true" 
              @company-selected="handleCompanySelected"
            />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search reviews by company, reviewer, or keywords..."
              class="search-input"
              @keyup.enter="performSearch(false)"
            />
            <div class="search-filter-container">
              <!-- <button @click="performSearch(false)" class="search-btn" :disabled="loading">
                <Loader v-if="loading" class="loader-icon" :size="18" />
                <Search v-else :size="18" />
              </button> -->
            </div>
          </div>

          <!-- Active Company Filter Chip -->
          <div v-if="selectedCompany" class="filter-chip">
            <span>Company: {{ selectedCompany.name }}</span>
            <button @click="clearCompanyFilter" class="chip-close">×</button>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilters" class="filter-section">
            <div class="filter-group">
              <label class="filter-label">Rating</label>
              <select v-model="selectedRating" @change="performSearch(false)" class="filter-select">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Sort By</label>
              <select v-model="sortBy" @change="performSearch(false)" class="filter-select">
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            <div class="filter-group">
              <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-card">
        <div class="results-header">
          <div class="results-title-section">
            <h3>
              {{
                loading && reviews.length === 0
                  ? "Loading..."
                  : `${totalCount} Review${totalCount !== 1 ? "s" : ""} Found`
              }}
            </h3>
            <div class="header-actions">
              <!-- Small Tab Toggle -->
              <div class="tab-toggle-small">
                <button @click="switchTab('all')" class="tab-btn-small" :class="{ active: activeTab === 'all' }">
                  All Reviews
                </button>
                <button @click="switchTab('my')" class="tab-btn-small" :class="{ active: activeTab === 'my' }">
                  My Reviews
                </button>
              </div>
              <button @click="writeReview" class="btn btn-primary create-profile-btn">
                <span>Write a Review</span>
                <ArrowRight :size="16" />
              </button>
            </div>
          </div>
          <p v-if="(searchQuery || selectedRating || selectedCompany) && !loading">Showing results for your search criteria</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading && reviews.length === 0" class="loading-state">
          <p>Loading reviews...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="performSearch(false)" class="btn btn-primary">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="reviews.length === 0" class="empty-state">
          <p>
            {{ activeTab === "my" ? "You haven't written any reviews yet" : "No reviews found matching your criteria" }}
          </p>
          <button v-if="searchQuery || selectedRating || selectedCompany" @click="clearFilters" class="btn btn-secondary">
            Clear Filters
          </button>
        </div>

        <!-- Review Cards -->
        <div v-else class="professionals-grid">
          <div v-for="review in reviews" :key="review.id" class="professional-card">
            <div class="card-header">
              <!-- Organization Logo or Initials -->
              <div class="professional-avatar" v-if="review.organizationDetails?.logo">
                <img :src="review.organizationDetails.logo" :alt="review.organizationDetails.name" class="avatar-img" />
              </div>
              <div class="professional-avatar" v-else>
                {{ getInitials(review.organizationDetails?.name) }}
              </div>

              <div class="professional-info">
                <h4>{{ review.organizationDetails?.name || "Unknown Company" }}</h4>
                <p class="profession">{{ review.userName || "Anonymous" }}</p>
              </div>
            </div>

            <!-- Rating -->
            <div class="rating-section">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (review.overAllRating || 0) }"
                  >★</span
                >
              </div>
              <span class="review-date">{{ formatDate(review.updatedAt) }}</span>
            </div>

            <!-- Review Title -->
            <h5 v-if="review.title" class="review-title">{{ review.title }}</h5>

            <!-- Review Text with See More / Inline Edit -->
            <div class="review-content">
              <!-- View Mode -->
              <template v-if="editingReviewId !== review.id">
                <p class="description" :class="{ expanded: expandedReviews.includes(review.id) }">
                  {{ review.description }}
                </p>
                <button
                  v-if="review.description && review.description.length > 150"
                  @click="toggleReviewExpansion(review.id)"
                  class="see-more-btn"
                >
                  {{ expandedReviews.includes(review.id) ? "See Less" : "See More" }}
                </button>
              </template>

              <!-- Edit Mode - Inline within the review text area -->
              <template v-else>
                <div class="inline-edit-rating">
                  <div class="stars-input">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="star-input"
                      :class="{ filled: i <= editingData.rating }"
                      @click="editingData.rating = i"
                      >★</span
                    >
                  </div>
                </div>

                <input v-model="editingData.title" class="form-input-inline" placeholder="Review title..." />

                <textarea
                  v-model="editingData.description"
                  class="form-textarea-inline"
                  rows="4"
                  placeholder="Write your review..."
                ></textarea>

                <div class="inline-edit-actions">
                  <button @click="cancelInlineEdit" class="btn btn-secondary btn-sm" :disabled="savingEdit">
                    Cancel
                  </button>
                  <button @click="saveInlineEdit(review.id)" class="btn btn-primary btn-sm" :disabled="savingEdit">
                    <Loader v-if="savingEdit" class="loader-icon" :size="14" />
                    <span>{{ savingEdit ? "Saving..." : "Save" }}</span>
                  </button>
                </div>
              </template>
            </div>

            <!-- Card Actions - Only for My Reviews -->
            <div class="card-actions" v-if="activeTab === 'my' && editingReviewId !== review.id">
              <button @click="toggleEditMode(review.id)" class="btn btn-icon" title="Edit">
                <Edit2 :size="16" />
              </button>
              <button @click="confirmDelete(review.id)" class="btn btn-icon btn-danger" title="Delete">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="load-more">
          <button @click="loadMore" class="btn btn-primary" :disabled="loading">
            <Loader v-if="loading" class="loader-icon" :size="18" />
            <span>{{ loading ? "Loading..." : "Load More Reviews" }}</span>
          </button>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Delete Review</h3>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this review? This action cannot be undone.</p>
          </div>
          <div class="modal-actions">
            <button @click="cancelDelete" class="btn btn-secondary" :disabled="deletingReview">Cancel</button>
            <button @click="deleteReview" class="btn btn-danger-solid" :disabled="deletingReview">
              <Loader v-if="deletingReview" class="loader-icon" :size="14" />
              <span>{{ deletingReview ? "Deleting..." : "Delete" }}</span>
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
<script>
import { Search, Loader, ArrowRight, Funnel, Edit2, Trash2 } from "lucide-vue";
import { getReviews, getReviewsByOrganization } from "../api/reivewGet";
import { updateReview, deleteReview } from "../api/reviewCrud";
import CompanySearch from "../components/SearchDropdown.vue";

export default {
  components: {
    CompanySearch,
    // Search,
    Loader,
    ArrowRight,
    // Funnel,
    Edit2,
    Trash2,
  },
  data() {
    return {
      activeTab: "all",
      searchQuery: "",
      showFilters: false,
      selectedRating: "",
      sortBy: "recent",
      loading: false,
      error: null,
      expandedReviews: [],
      showDeleteModal: false,
      reviewToDelete: null,
      editingReviewId: null,
      editingData: {
        rating: 0,
        title: "",
        description: "",
      },
      savingEdit: false,
      deletingReview: false,

      // Company filter
      selectedCompany: null,

      // API data
      reviews: [],
      totalCount: 0,
      pageSize: 10,
      startIndex: 0,
    };
  },

  computed: {
    canLoadMore() {
      return this.reviews.length < this.totalCount && this.totalCount > 0;
    },
  },

  methods: {
    handleCompanySelected(company) {
      this.selectedCompany = company;
      // Reset pagination and fetch reviews for this company
      this.startIndex = 0;
      this.reviews = [];
      this.totalCount = 0;
      this.performSearch(false);
    },

    clearCompanyFilter() {
      this.selectedCompany = null;
      // Reset and reload reviews without company filter
      this.startIndex = 0;
      this.reviews = [];
      this.totalCount = 0;
      this.performSearch(false);
    },

    async performSearch(loadMore = false) {
      this.loading = true;
      this.error = null;

      // Determine the correct startIndex (page number) for this API call
      let currentStartIndex;

      if (!loadMore) {
        // For new search, always start from page 0
        currentStartIndex = 0;
        this.reviews = [];
        this.totalCount = 0;
      } else {
        // For load more, use current page number
        currentStartIndex = this.startIndex;
      }

      try {
        let response;

        // If a company is selected, use getReviewsByOrganization
        if (this.selectedCompany && this.selectedCompany.id) {
          const params = {
            pageSize: this.pageSize,
            startIndex: currentStartIndex,
          };

          console.log("Fetching reviews for organization:", this.selectedCompany.id, "with params:", params);
          response = await getReviewsByOrganization(this.selectedCompany.id, params);
        } else {
          // Otherwise use the regular getReviews
          const params = {
            pageSize: this.pageSize,
            startIndex: currentStartIndex,
          };

          const options = {
            search: this.searchQuery.trim() || "",
            byUser: this.activeTab === "my",
          };

          console.log("Fetching reviews with params:", params, "and options:", options);
          response = await getReviews(options, params);
        }

        if (response && response.data && response.data.results) {
          const result = response.data.results[0];

          if (result && result.review && Array.isArray(result.review)) {
            let newReviews = result.review;

            // If fetching by organization, add company details to each review
            if (this.selectedCompany && this.selectedCompany.id) {
              newReviews = newReviews.map(review => ({
                ...review,
                organizationDetails: {
                  name: this.selectedCompany.name,
                  logo: this.selectedCompany.logo,
                }
              }));
            }

            if (loadMore) {
              // Append new reviews to existing list
              this.reviews = [...this.reviews, ...newReviews];
            } else {
              // Replace reviews list for new search
              this.reviews = newReviews;
            }

            // Update totalCount
            this.totalCount = result.totalCount || 0;

            // Update startIndex (page number) for next pagination call
            if (!loadMore) {
              // For new search, next page will be page 1
              this.startIndex = 1;
            } else {
              // For load more, increment page number by 1
              this.startIndex += 1;
            }

            console.log(
              `Loaded ${newReviews.length} reviews from page ${currentStartIndex}. Total: ${this.reviews.length}/${this.totalCount}. Next page: ${this.startIndex}`
            );
          } else {
            // Handle empty result case
            if (!loadMore) {
              this.reviews = [];
              this.totalCount = 0;
              this.startIndex = 0;
            }
          }
        } else {
          // Handle empty response case
          if (!loadMore) {
            this.reviews = [];
            this.totalCount = 0;
            this.startIndex = 0;
          }
        }
      } catch (error) {
        this.error = `Failed to load reviews: ${error.message}`;
        console.error("Reviews fetch error:", error);

        // Reset data on error only for new search
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
      this.performSearch(true);
    },

    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        // Reset pagination and reload
        this.startIndex = 0;
        this.reviews = [];
        this.totalCount = 0;
        this.performSearch(false);
      }
    },

    toggleFilters() {
      this.showFilters = !this.showFilters;
    },

    clearFilters() {
      this.searchQuery = "";
      this.selectedRating = "";
      this.sortBy = "recent";
      this.selectedCompany = null;
      // Reset pagination state before performing search
      this.startIndex = 0;
      this.reviews = [];
      this.totalCount = 0;
      this.performSearch(false);
    },

    toggleReviewExpansion(id) {
      const index = this.expandedReviews.indexOf(id);
      if (index > -1) {
        this.expandedReviews.splice(index, 1);
      } else {
        this.expandedReviews.push(id);
      }
    },

    toggleEditMode(reviewId) {
      if (this.editingReviewId === reviewId) {
        this.cancelInlineEdit();
      } else {
        const review = this.reviews.find((r) => r.id === reviewId);
        if (review) {
          this.editingReviewId = reviewId;
          this.editingData = {
            rating: review.overAllRating || 0,
            title: review.title || "",
            description: review.description || "",
          };
        }
      }
    },

    async saveInlineEdit(reviewId) {
      if (this.savingEdit) return;

      // Validate inputs
      if (!this.editingData.rating || this.editingData.rating < 1 || this.editingData.rating > 5) {
        this.error = "Please provide a rating between 1 and 5 stars";
        return;
      }

      if (!this.editingData.description || this.editingData.description.trim().length === 0) {
        this.error = "Please write a review description";
        return;
      }

      this.savingEdit = true;
      this.error = null;

      try {
        const reviewData = {
          overAllratings: this.editingData.rating,
          title: this.editingData.title,
          description: this.editingData.description,
        };

        const response = await updateReview(reviewId, reviewData);

        if (response && response.data) {
          // Update the review in the local list
          const index = this.reviews.findIndex((r) => r.id === reviewId);
          if (index > -1) {
            this.reviews[index] = {
              ...this.reviews[index],
              overAllRating: this.editingData.rating,
              title: this.editingData.title,
              description: this.editingData.description,
            };
          }

          console.log("Review updated successfully");
          this.cancelInlineEdit();
        }
      } catch (error) {
        this.error = `Failed to update review: ${error.message}`;
        console.error("Update review error:", error);
      } finally {
        this.savingEdit = false;
      }
    },

    cancelInlineEdit() {
      this.editingReviewId = null;
      this.editingData = {
        rating: 0,
        title: "",
        description: "",
      };
    },

    confirmDelete(id) {
      this.reviewToDelete = id;
      this.showDeleteModal = true;
    },

    async deleteReview() {
      if (this.deletingReview) return;

      this.deletingReview = true;
      this.error = null;

      try {
        const response = await deleteReview(this.reviewToDelete);

        if (response) {
          // Remove the review from the local list
          const index = this.reviews.findIndex((r) => r.id === this.reviewToDelete);
          if (index > -1) {
            this.reviews.splice(index, 1);
            this.totalCount -= 1;
          }

          console.log("Review deleted successfully");
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

    writeReview() {
      this.$router.push("/create");
    },

    getInitials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    formatDate(dateString) {
      if (!dateString) return "Date unknown";

      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return `${diffSec} seconds ago`;
      if (diffMin < 60) return `${diffMin} minutes ago`;
      if (diffHr < 24) return `${diffHr} hours ago`;

      if (diffDay === 0) return "Today";
      if (diffDay === 1) return "Yesterday";
      if (diffDay < 7) return `${diffDay} days ago`;
      if (diffDay < 30) return `${Math.floor(diffDay / 7)} weeks ago`;
      if (diffDay < 365) return `${Math.floor(diffDay / 30)} months ago`;

      return `${Math.floor(diffDay / 365)} years ago`;
    },
  },

  mounted() {
    // Load reviews on component mount
    this.performSearch(false);
  },
};
</script>
<style scoped>
/* Add this to your existing styles */
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 16px;
  font-size: 14px;
  color: #1976d2;
  margin-top: 8px;
}

.chip-close {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #1976d2;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.chip-close:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

/* Add this to your existing styles */
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 16px;
  font-size: 14px;
  color: #1976d2;
  margin-top: 8px;
}

.chip-close {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #1976d2;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

/* Search Card Styles */
.search-card {
  margin-bottom: 20px;
}

.search-filter-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
   width: 100%;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: inherit;
    transition: border-color 0.2s;
    background: white;
    position: relative;
    z-index: 1;
}

.search-input:focus {
  outline: none;
  border-color: #000;
}

.search-input::placeholder {
  color: #999;
}

.search-btn,
.filter-btn {
  padding: 16px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 50px;
  font-size: 1.2rem;
}

.filter-btn:hover {
  background: #eee;
  color: #333;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Filter Section */
.filter-section {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group:last-child {
  justify-self: end;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.filter-select {
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #000;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #000;
}

/* Results Card */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.results-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.results-header {
  margin-bottom: 30px;
}

.results-title-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 16px;
}

.results-title-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  padding-top: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Small Tab Toggle */
.tab-toggle-small {
  display: flex;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.tab-btn-small {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn-small.active {
  background: #000;
  color: #fff;
}

.tab-btn-small:hover:not(.active) {
  color: #333;
  background: #f5f5f5;
}

.create-profile-btn {
  font-size: 0.9rem;
  padding: 10px 18px;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 6px;
}

.results-header p {
  color: #666;
  font-size: 0.9rem;
  margin: 8px 0 0 0;
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.loading-state p,
.empty-state p {
  margin: 0 0 16px 0;
  font-size: 1rem;
}

/* Review Cards Grid */
.professionals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.professional-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.professional-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.professional-avatar {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 16px;
  flex-shrink: 0;
}

.professional-info {
  flex-grow: 1;
  min-width: 0;
}

.professional-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  word-wrap: break-word;
}

.profession {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

/* Rating Section */
.rating-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #e0e0e0;
  font-size: 1.1rem;
}

.star.filled {
  color: #000000;
}

.review-date {
  color: #999;
  font-size: 0.85rem;
}

/* Review Content */
.review-content {
  margin-bottom: 16px;
}

.description {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description.expanded {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
}

.see-more-btn {
  background: none;
  border: none;
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 8px;
  text-decoration: underline;
}

.see-more-btn:hover {
  color: #333;
}

/* Inline Edit Styles */
.inline-edit-rating {
  margin-bottom: 12px;
}

.form-textarea-inline {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
  margin-bottom: 12px;
}

.form-textarea-inline:focus {
  outline: none;
  border-color: #000;
}

.inline-edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-sm {
  padding: 8px 14px;
  font-size: 0.85rem;
}

/* Card Actions */
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
}

.btn-primary {
  background: #000;
  color: #fff;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: #000;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  border-color: #ccc;
  background: #f8f8f8;
}

.btn-icon {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 10px;
  min-width: 40px;
}

.btn-icon:hover {
  background: #e8e8e8;
  border-color: #ccc;
}

.btn-danger {
  background: #fee;
  color: #c33;
  border-color: #fcc;
}

.btn-danger:hover {
  background: #fdd;
  color: #a22;
  border-color: #faa;
}

.btn-icon.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.btn-danger-solid {
  background: #dc3545;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger-solid:hover {
  background: #c82333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  height: 250px;
}

.modal-large {
  max-width: 600px;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #000;
}

.stars-input {
  display: flex;
  gap: 4px;
}

.star-input {
  color: #e0e0e0;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star-input:hover,
.star-input.filled {
  color: #000;
}

/* Load More */
.load-more {
  text-align: center;
  padding: 20px 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }

  .search-card,
  .results-card {
    padding: 20px;
  }

  .professionals-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .results-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .tab-toggle-small {
    width: 100%;
  }

  .tab-btn-small {
    flex: 1;
  }

  .create-profile-btn {
    width: 100%;
  }

  .modal {
    max-width: 100%;
    margin: 0 16px;
  }
}

@media (max-width: 480px) {
  .professional-card {
    padding: 16px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>

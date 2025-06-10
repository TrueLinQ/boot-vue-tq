<template>
  <div class="company-detail-container">
    <Header />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Back Button -->
          
          <!-- Company Header -->
          <div class="company-header-section">
            <div class="company-main-info">
              <div class="company-logo-large">
                <img :src="company.logo" :alt="company.name + ' logo'" />
              </div>
              <div class="company-details">
                <h1 class="company-title">{{ company.name }}</h1>
                <span class="company-category-badge">{{ getCategoryName(company.category) }}</span>
                <div class="company-meta">
                  <span class="meta-item">Founded: {{ company.founded }}</span>
                  <span class="meta-divider">•</span>
                  <span class="meta-item">{{ company.employees }} employees</span>
                </div>
                <p class="company-description">{{ company.description }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="showWriteReview = true" class="btn-primary">
                <Edit3 :size="16" />
                Write Review
              </button>
              <button @click="visitWebsite" class="btn-secondary">
                <ExternalLink :size="16" />
                Visit Website
              </button>
            </div>
          </div>

          <!-- Stats Image -->
          <!-- <div class="stats-image">
            <img src="./LovingDoodle.png" alt="Company Reviews Illustration" />
          </div> -->

          <!-- Overall Rating Section -->
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
                  @click="filterByRating(rating)"
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

          <!-- Reviews Filter Section -->
          <div class="reviews-filter-section">
            <div class="filter-header">
              <h2>Reviews ({{ filteredReviews.length }})</h2>
              <div class="filter-controls">
                <select v-model="reviewSort" class="filter-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
                <button 
                  v-if="selectedRatingFilter" 
                  @click="clearRatingFilter" 
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
              <div
                v-for="review in paginatedReviews"
                :key="review.id"
                class="review-card"
              >
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">
                      {{ review.author.charAt(0).toUpperCase() }}
                    </div>
                    <div class="reviewer-details">
                      <span class="reviewer-name">{{ review.author }}</span>
                      <span class="review-date">{{ formatDate(review.date) }}</span>
                    </div>
                  </div>
                  <div class="review-rating">
                    <div class="review-stars">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :size="14"
                        :class="['star-small', i <= review.rating ? 'star-filled' : 'star-empty']"
                      />
                    </div>
                    <span class="rating-text">{{ review.rating }}.0</span>
                  </div>
                </div>

                <div class="review-content">
                  <h4 class="review-title">{{ review.title }}</h4>
                  <p class="review-text">{{ review.content }}</p>
                </div>

                <div class="review-actions">
                  <button 
                    @click="toggleHelpful(review.id)" 
                    :class="['helpful-btn', { active: review.isHelpful }]"
                  >
                    <ThumbsUp :size="14" />
                    Helpful ({{ review.helpfulCount }})
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalReviewPages > 1" class="pagination-section">
              <button 
                @click="currentReviewPage--" 
                :disabled="currentReviewPage === 1" 
                class="pagination-btn"
              >
                Previous
              </button>

              <div class="pagination-numbers">
                <button
                  v-for="page in visibleReviewPages"
                  :key="page"
                  @click="currentReviewPage = page"
                  :class="['pagination-number', { active: page === currentReviewPage }]"
                >
                  {{ page }}
                </button>
              </div>

              <button 
                @click="currentReviewPage++" 
                :disabled="currentReviewPage === totalReviewPages" 
                class="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Write Review Modal -->
    <div v-if="showWriteReview" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Write a Review for {{ company.name }}</h3>
          <button @click="closeModal" class="close-btn">
            <X :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Rating</label>
            <div class="rating-input">
              <Star
                v-for="i in 5"
                :key="i"
                :size="24"
                :class="['star-clickable', i <= newReview.rating ? 'star-filled' : 'star-empty']"
                @click="newReview.rating = i"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Review Title</label>
            <input
              v-model="newReview.title"
              type="text"
              placeholder="Summarize your experience..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Your Review</label>
            <textarea
              v-model="newReview.content"
              placeholder="Tell others about your experience with this company..."
              class="form-textarea"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Your Name</label>
            <input
              v-model="newReview.author"
              type="text"
              placeholder="Your name"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button @click="submitReview" class="btn-primary" :disabled="!isReviewValid">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Star, Edit3, ExternalLink, ArrowLeft, ThumbsUp, X } from "lucide-vue";
import Header from "./Header.vue";

export default {
  name: "CompanyDetail",
  components: {
    Star,
    Edit3,
    ExternalLink,
    // ArrowLeft,
    ThumbsUp,
    X,
    Header,
  },
  data() {
    return {
      showWriteReview: false,
      selectedRatingFilter: null,
      reviewSort: "newest",
      currentReviewPage: 1,
      reviewsPerPage: 5,
      
      newReview: {
        rating: 0,
        title: "",
        content: "",
        author: "",
      },

      // Sample company data
      company: {
        id: 1,
        name: "TechCorp Solutions",
        logo: "https://via.placeholder.com/120x120/000000/FFFFFF?text=TC",
        category: "technology",
        rating: 4.5,
        reviewCount: 128,
        description: "Leading software development company specializing in enterprise solutions and cloud technologies. We help businesses transform their operations through innovative digital solutions.",
        founded: "2015",
        employees: "500-1000",
        website: "https://techcorp-solutions.com",
      },

      // Sample reviews data
      reviews: [
        {
          id: 1,
          author: "Sarah Johnson",
          rating: 5,
          title: "Excellent service and support",
          content: "TechCorp has been instrumental in our digital transformation. Their team is knowledgeable, responsive, and delivers quality solutions on time. Highly recommend their services.",
          date: new Date("2024-03-15"),
          helpfulCount: 12,
          isHelpful: false,
        },
        {
          id: 2,
          author: "Mike Chen",
          rating: 4,
          title: "Great results, minor communication issues",
          content: "The end product exceeded our expectations, but there were some communication gaps during the project. Overall, very satisfied with the outcome.",
          date: new Date("2024-03-10"),
          helpfulCount: 8,
          isHelpful: false,
        },
        {
          id: 3,
          author: "Emily Rodriguez",
          rating: 5,
          title: "Professional and innovative",
          content: "Working with TechCorp was a pleasure. They brought innovative ideas to our project and executed them flawlessly. The team is highly professional and skilled.",
          date: new Date("2024-03-05"),
          helpfulCount: 15,
          isHelpful: true,
        },
        {
          id: 4,
          author: "David Thompson",
          rating: 3,
          title: "Good service but pricey",
          content: "The quality of work is good, but the pricing is on the higher side compared to competitors. Service delivery was satisfactory.",
          date: new Date("2024-02-28"),
          helpfulCount: 6,
          isHelpful: false,
        },
        {
          id: 5,
          author: "Lisa Wang",
          rating: 5,
          title: "Outstanding customer support",
          content: "Their customer support team is outstanding. They were always available to help and went above and beyond to ensure our satisfaction.",
          date: new Date("2024-02-20"),
          helpfulCount: 11,
          isHelpful: false,
        },
        {
          id: 6,
          author: "James Miller",
          rating: 4,
          title: "Solid technical expertise",
          content: "TechCorp's technical team demonstrated solid expertise in handling complex requirements. The project was delivered successfully with minimal issues.",
          date: new Date("2024-02-15"),
          helpfulCount: 9,
          isHelpful: false,
        },
        {
          id: 7,
          author: "Rachel Green",
          rating: 2,
          title: "Delayed delivery",
          content: "While the final product was acceptable, the project was significantly delayed beyond the agreed timeline. Better project management needed.",
          date: new Date("2024-02-10"),
          helpfulCount: 4,
          isHelpful: false,
        },
        {
          id: 8,
          author: "Tom Anderson",
          rating: 5,
          title: "Exceptional problem-solving skills",
          content: "When we encountered technical challenges, TechCorp's team showed exceptional problem-solving skills. They found creative solutions quickly.",
          date: new Date("2024-02-05"),
          helpfulCount: 13,
          isHelpful: false,
        },
      ],
    };
  },
  computed: {
    filteredReviews() {
      let filtered = [...this.reviews];
      
      // Apply rating filter
      if (this.selectedRatingFilter) {
        filtered = filtered.filter(review => review.rating === this.selectedRatingFilter);
      }
      
      // Apply sorting
      switch (this.reviewSort) {
        case "newest":
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "highest":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "lowest":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "helpful":
          filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
      }
      
      return filtered;
    },

    totalReviewPages() {
      return Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    },

    paginatedReviews() {
      const start = (this.currentReviewPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.filteredReviews.slice(start, end);
    },

    visibleReviewPages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentReviewPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalReviewPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },

    isReviewValid() {
      return this.newReview.rating > 0 && 
             this.newReview.title.trim() && 
             this.newReview.content.trim() && 
             this.newReview.author.trim();
    },
  },
  methods: {
    getCategoryName(category) {
      const categories = {
        technology: "Technology",
        healthcare: "Healthcare",
        finance: "Finance",
        retail: "Retail",
        education: "Education",
        food: "Food & Beverage",
        automotive: "Automotive",
        "real-estate": "Real Estate",
      };
      return categories[category] || category;
    },

    getRatingCount(rating) {
      return this.reviews.filter(review => review.rating === rating).length;
    },

    getRatingPercentage(rating) {
      if (this.reviews.length === 0) return 0;
      return (this.getRatingCount(rating) / this.reviews.length) * 100;
    },

    filterByRating(rating) {
      if (this.selectedRatingFilter === rating) {
        this.selectedRatingFilter = null;
      } else {
        this.selectedRatingFilter = rating;
      }
      this.currentReviewPage = 1;
    },

    clearRatingFilter() {
      this.selectedRatingFilter = null;
      this.currentReviewPage = 1;
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    },

    toggleHelpful(reviewId) {
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        if (review.isHelpful) {
          review.helpfulCount--;
          review.isHelpful = false;
        } else {
          review.helpfulCount++;
          review.isHelpful = true;
        }
      }
    },

    visitWebsite() {
      window.open(this.company.website, '_blank');
    },

    goBack() {
      console.log("Navigate back to companies list");
      // Handle navigation back to companies list
    },

    closeModal() {
      this.showWriteReview = false;
      this.resetReviewForm();
    },

    resetReviewForm() {
      this.newReview = {
        rating: 0,
        title: "",
        content: "",
        author: "",
      };
    },

    submitReview() {
      if (!this.isReviewValid) return;
      
      const review = {
        id: Date.now(),
        ...this.newReview,
        date: new Date(),
        helpfulCount: 0,
        isHelpful: false,
      };
      
      this.reviews.unshift(review);
      this.company.reviewCount++;
      
      // Recalculate overall rating
      const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      this.company.rating = totalRating / this.reviews.length;
      
      this.closeModal();
      console.log("Review submitted:", review);
    },
  },
  watch: {
    selectedRatingFilter() {
      this.currentReviewPage = 1;
    },
    reviewSort() {
      this.currentReviewPage = 1;
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.company-detail-container {
  min-height: 100vh;
  background: #fff;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.container {
  margin-top: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

/* Back Button */
.back-section {
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.back-btn:hover {
  border-color: #000000;
  color: #000000;
}

/* Company Header */
.company-header-section {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
}

.company-main-info {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.company-logo-large {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.company-logo-large img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.company-details {
  flex: 1;
  min-width: 0;
}

.company-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.company-category-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.meta-divider {
  color: #d1d5db;
}

.company-description {
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #000000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #000000;
  color: #fff;
  transform: translateY(-1px);
}

/* Stats Image */
.stats-image {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.stats-image img {
  max-width: 292px;
  height: auto;
  object-fit: contain;
}

/* Rating Overview */
.rating-overview-section {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
}

.rating-summary {
  margin-bottom: 32px;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.star.star-filled {
  color: #000;
  fill: #000;
}

.star.star-empty {
  color: #d1d5db;
}

.total-reviews {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.rating-distribution h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.rating-bar-row:hover {
  background: #f9fafb;
}

.rating-bar-row.active {
  background: #f3f4f6;
  border: 1px solid #000000;
}

.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 60px;
}

.rating-bar-container {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background: #000000;
  transition: width 0.3s ease;
}

.rating-count {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

/* Reviews Filter */
.reviews-filter-section {
  margin-bottom: 24px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: #000000;
  outline: none;
}

.clear-filter-btn {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.clear-filter-btn:hover {
  border-color: #000000;
  color: #000000;
}

/* Reviews Section */
.reviews-section {
  margin-bottom: 40px;
}

.no-reviews {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-reviews-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-reviews h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.no-reviews p {
  font-size: 16px;
  margin: 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 0;
  transition: border-color 0.2s ease;
}

.review-card:hover {
  border-color: #d1d5db;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.reviewer-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: #666;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.star-small.star-filled {
  color: #000;
  fill: #000;
}

.star-small.star-empty {
  color: #d1d5db;
}

.rating-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.review-content {
  margin-bottom: 16px;
  text-align: left;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.helpful-btn:hover {
  border-color: #000000;
  color: #000000;
}

.helpful-btn.active {
  background: #000000;
  color: #fff;
  border-color: #000000;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e5e5;
}

.pagination-btn {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #000000;
  color: #000000;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  border-color: #000000;
  color: #000000;
}

.pagination-number.active {
  background: #000000;
  color: #fff;
  border-color: #000000;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.close-btn:hover {
  color: #000000;
}

.modal-body {
  padding: 0 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.rating-input {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.star-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-clickable:hover {
  transform: scale(1.1);
}

.star-clickable.star-filled {
  color: #000;
  fill: #000;
}

.star-clickable.star-empty {
  color: #d1d5db;
}

.form-input {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background: #fff;
  color: #1a1a1a;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #000000;
  outline: none;
}

.form-textarea {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background: #fff;
  color: #1a1a1a;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-textarea:focus {
  border-color: #000000;
  outline: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e5e5;
  margin-top: 24px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .company-header-section {
    padding: 24px 20px;
  }

  .company-main-info {
    flex-direction: column;
    gap: 16px;
  }

  .company-logo-large {
    align-self: center;
    width: 80px;
    height: 80px;
  }

  .company-title {
    font-size: 24px;
    text-align: center;
  }

  .company-meta {
    justify-content: center;
  }

  .company-description {
    text-align: center;
  }

  .action-buttons {
    justify-content: center;
  }

  .rating-overview-section {
    padding: 24px 20px;
  }

  .overall-rating {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .filter-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: space-between;
  }

  .review-header {
    flex-direction: column;
    gap: 12px;
  }

  .review-rating {
    align-self: flex-start;
  }

  .pagination-section {
    flex-wrap: wrap;
    gap: 12px;
  }

  .pagination-numbers {
    order: -1;
  }

  .modal-content {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 480px) {
  .company-title {
    font-size: 20px;
  }

  .rating-number {
    font-size: 36px;
  }

  .pagination-numbers {
    gap: 2px;
  }

  .pagination-number {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
}
</style>
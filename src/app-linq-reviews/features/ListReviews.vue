<template>
  <div class="app">
    <div class="container">
      <!-- Search Section -->
      <div class="search-card">
        <div class="search-section">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search reviews by company, reviewer, or keywords..."
              class="search-input"
              @keyup.enter="performSearch"
            />
            <div class="search-filter-container">
              <button @click="performSearch" class="search-btn" :disabled="loading">
                <Loader v-if="loading" class="loader-icon" :size="18" />
                <Search v-else :size="18" />
              </button>
              <button @click="toggleFilters" class="filter-btn" :class="{ active: showFilters }">
                <Funnel :size="18" />
              </button>
            </div>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilters" class="filter-section">
            <div class="filter-group">
              <label class="filter-label">Rating</label>
              <select v-model="selectedRating" @change="performSearch" class="filter-select">
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
              <select v-model="sortBy" @change="performSearch" class="filter-select">
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
              {{ loading ? 'Loading...' : `${filteredReviews.length} Review${filteredReviews.length !== 1 ? 's' : ''} Found` }}
            </h3>
            <div class="header-actions">
              <!-- Small Tab Toggle -->
              <div class="tab-toggle-small">
                <button 
                  @click="activeTab = 'all'" 
                  class="tab-btn-small" 
                  :class="{ active: activeTab === 'all' }"
                >
                  All Reviews
                </button>
                <button 
                  @click="activeTab = 'my'" 
                  class="tab-btn-small" 
                  :class="{ active: activeTab === 'my' }"
                >
                  My Reviews
                </button>
              </div>
              <button @click="writeReview" class="btn btn-primary create-profile-btn">
                <span>Write a Review</span>
                <ArrowRight :size="16" />
              </button>
            </div>
          </div>
          <p v-if="(searchQuery || selectedRating) && !loading">Showing results for your search criteria</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <p>Loading reviews...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredReviews.length === 0" class="empty-state">
          <p>{{ activeTab === 'my' ? 'You haven\'t written any reviews yet' : 'No reviews found matching your criteria' }}</p>
          <button v-if="searchQuery || selectedRating" @click="clearFilters" class="btn btn-secondary">
            Clear Filters
          </button>
        </div>

        <!-- Review Cards -->
        <div v-else class="professionals-grid">
          <div v-for="review in filteredReviews" :key="review.id" class="professional-card">
            <div class="card-header">
              <div class="professional-avatar">
                {{ review.reviewerInitials }}
              </div>
              <div class="professional-info">
                <h4>{{ review.reviewerName }}</h4>
                <p class="profession">{{ review.companyName }}</p>
              </div>
            </div>

            <!-- Rating -->
            <div class="rating-section">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
              </div>
              <span class="review-date">{{ review.date }}</span>
            </div>

            <p class="description">{{ review.review }}</p>

            

            <div class="card-actions">
              <button @click="viewReview(review.id)" class="btn btn-secondary">View Full Review</button>
              <button @click="markHelpful(review.id)" class="btn btn-primary">
                <span>Helpful</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="load-more">
          <button @click="loadMore" class="btn btn-primary" :disabled="loading">
            <span>{{ loading ? 'Loading...' : 'Load More Reviews' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, Loader, ArrowRight, Funnel } from "lucide-vue";

export default {
  components: {
    Search,
    Loader,
    ArrowRight,
    Funnel
  },
  data() {
    return {
      activeTab: 'all', // 'all' or 'my'
      searchQuery: '',
      showFilters: false,
      selectedRating: '',
      sortBy: 'recent',
      loading: false,
      canLoadMore: true,
      
      // Dummy reviews data
      allReviews: [
        {
          id: 1,
          reviewerName: 'Sarah Johnson',
          reviewerInitials: 'SJ',
          companyName: 'Tech Solutions Inc.',
          rating: 5,
          date: '2 days ago',
          review: 'Exceptional service! The team was professional, responsive, and delivered beyond our expectations. Would highly recommend to anyone looking for quality consulting services.',
          helpful: 12,
          replies: 3,
          isMine: false
        },
        {
          id: 2,
          reviewerName: 'Michael Chen',
          reviewerInitials: 'MC',
          companyName: 'Digital Marketing Pro',
          rating: 4,
          date: '1 week ago',
          review: 'Great experience overall. The project was completed on time and the communication was excellent. Minor issues were quickly resolved. Very satisfied with the outcome.',
          helpful: 8,
          replies: 1,
          isMine: false
        },
        {
          id: 3,
          reviewerName: 'Emma Davis',
          reviewerInitials: 'ED',
          companyName: 'Creative Design Studio',
          rating: 5,
          date: '2 weeks ago',
          review: 'Outstanding work! They understood our vision perfectly and created something that exceeded our expectations. The attention to detail and creativity was remarkable.',
          helpful: 15,
          replies: 5,
          isMine: true
        },
        {
          id: 4,
          reviewerName: 'John Anderson',
          reviewerInitials: 'JA',
          companyName: 'Business Consulting Group',
          rating: 3,
          date: '3 weeks ago',
          review: 'Decent service but there were some delays in communication. The final deliverable was good, but the process could have been smoother. Room for improvement in project management.',
          helpful: 5,
          replies: 2,
          isMine: true
        }
      ]
    };
  },
  
  computed: {
    filteredReviews() {
      let reviews = this.activeTab === 'my' 
        ? this.allReviews.filter(r => r.isMine)
        : this.allReviews;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        reviews = reviews.filter(r => 
          r.reviewerName.toLowerCase().includes(query) ||
          r.companyName.toLowerCase().includes(query) ||
          r.review.toLowerCase().includes(query)
        );
      }
      
      // Apply rating filter
      if (this.selectedRating) {
        reviews = reviews.filter(r => r.rating === parseInt(this.selectedRating));
      }
      
      // Apply sorting
      if (this.sortBy === 'helpful') {
        reviews = [...reviews].sort((a, b) => b.helpful - a.helpful);
      } else if (this.sortBy === 'rating') {
        reviews = [...reviews].sort((a, b) => b.rating - a.rating);
      }
      
      return reviews;
    }
  },
  
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    
    performSearch() {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    
    clearFilters() {
      this.searchQuery = '';
      this.selectedRating = '';
      this.sortBy = 'recent';
    },
    
    viewReview(id) {
      console.log('View review:', id);
      // Add your navigation logic here
    },
    
    markHelpful(id) {
      const review = this.allReviews.find(r => r.id === id);
      if (review) {
        review.helpful++;
      }
    },
    
    writeReview() {
      console.log('Write a review');
      // Add your navigation logic here
    },
    
    loadMore() {
      this.loading = true;
      // Simulate loading more reviews
      setTimeout(() => {
        this.loading = false;
        this.canLoadMore = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
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
}

.search-input {
  flex: 1;
  padding: 16px 16px 16px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  color: #000;
  transition: border-color 0.2s ease;
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

/* Description */
.description {
  color: #333;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Meta Info */
.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.85rem;
}

.icon {
  font-size: 1rem;
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
  gap: 4px;
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
  flex: 1;
}

.btn-secondary:hover {
  border-color: #ccc;
  background: #f8f8f8;
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
}

@media (max-width: 480px) {
  .professional-card {
    padding: 16px;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
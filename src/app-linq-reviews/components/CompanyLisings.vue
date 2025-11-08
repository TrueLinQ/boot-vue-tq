<template>
  <!-- <FullScreenLoader v-if="loading" /> -->
  <div class="listings-container">
    <div class="listings-card">
      <div class="header">
        <div class="header-top">
          <div>
            <h2>Browse Companies</h2>
            <p>Discover and explore businesses</p>
          </div>
          
          <!-- Sort Dropdown -->
          <div class="sort-dropdown">
            <select 
              v-model="selectedSort" 
              @change="handleSortChange"
              class="sort-select"
            >
              <option value="latest-desc">Latest</option>
              <option value="ratings-desc">Highest Rated</option>
              <option value="ratings-asc">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && companies.length === 0" class="loading-state">
        <p>Loading companies...</p>
      </div>

      <!-- Error State -->
      <div v-if="error && companies.length === 0" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadCompanies(false)" class="btn btn-primary retry-button">
          Try Again
        </button>
      </div>

      <!-- Companies Grid -->
      <div v-if="!loading || companies.length > 0" class="companies-grid">
        <div 
          v-for="company in companies" 
          :key="company.id"
          class="company-card"
          @click="navigateToCompany(company.id)"
        >
          <div class="company-logo">
            <img 
              v-if="company.logo" 
              :src="company.logo" 
              :alt="company.name"
              @error="handleImageError"
            />
            <div v-else class="logo-placeholder">
              {{ getInitials(company.name) }}
            </div>
          </div>
          
          <div class="company-info">
            <h3 class="company-name">{{ company.name }}</h3>
            
            <div class="company-meta">
              <div v-if="company.overAllRating" class="rating">
                <span class="star">★</span>
                <span class="rating-value">{{ company.overAllRating }}</span>
              </div>
              
              <div v-if="company.claimed" class="claimed-badge">
                Claimed
              </div>
            </div>
            
            <div v-if="company.category" class="company-category">
              {{ company.category }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && companies.length === 0 && !error" class="empty-state">
        <p>No companies found</p>
      </div>

      <!-- Load More Button -->
      <div v-if="canLoadMore" class="load-more-container">
        <button 
          @click="loadMore" 
          :disabled="loading"
          class="btn btn-secondary load-more-btn"
        >
          <template v-if="loading">Loading...</template>
          <template v-else>Load More</template>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllBusinesses } from '../api/businessCrud';

export default {
  name: "CompanyListings",

  components: {
    // FullScreenLoader,
  },
  
  data() {
    return {
      companies: [],
      loading: false,
      error: null,
      pageSize: 12,
      startIndex: 0,
      totalCount: 0,
      selectedSort: "ratings-desc",
      sortBy: "ratings",
      sortOrder: 0,
    };
  },
  
  computed: {
    canLoadMore() {
      return this.companies.length < this.totalCount && this.totalCount > 0;
    },
  },
  
  methods: {
    handleSortChange() {
      const [sortBy, sortOrder] = this.selectedSort.split('-');
      this.sortBy = sortBy;
      this.sortOrder = sortOrder === 'asc' ? 1 : 0;
      
      this.startIndex = 0;
      this.companies = [];
      this.totalCount = 0;
      this.loadCompanies(false);
    },
    
    async loadCompanies(loadMore = false) {
      this.loading = true;
      this.error = null;

      let currentStartIndex;

      if (!loadMore) {
        currentStartIndex = 0;
        this.companies = [];
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

        const response = await getAllBusinesses(params);

        if (response && response.data && response.data.results) {
          const result = response.data.results[0];

          if (result && result.response && Array.isArray(result.response)) {
            const newCompanies = result.response;

            if (loadMore) {
              this.companies = [...this.companies, ...newCompanies];
            } else {
              this.companies = newCompanies;
            }

            this.totalCount = result.totalCount || 0;

            if (!loadMore) {
              this.startIndex = 1;
            } else {
              this.startIndex += 1;
            }
          } else {
            if (!loadMore) {
              this.companies = [];
              this.totalCount = 0;
              this.startIndex = 0;
            }
          }
        } else {
          if (!loadMore) {
            this.companies = [];
            this.totalCount = 0;
            this.startIndex = 0;
          }
        }
      } catch (error) {
        this.error = `Failed to load companies: ${error.message}`;
        console.error("Companies fetch error:", error);

        if (!loadMore) {
          this.companies = [];
          this.totalCount = 0;
          this.startIndex = 0;
        }
      } finally {
        this.loading = false;
          this.$emit("loading-change", false); // This correctly sets loading to false

      }
    },
    
    loadMore() {
      this.loadCompanies(true);
    },
    
    navigateToCompany(companyId) {
      this.$router.push(`/company/${companyId}`);
    },
    
    getInitials(name) {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },
    
    handleImageError(event) {
      event.target.style.display = 'none';
      event.target.parentElement.innerHTML = `
        <div class="logo-placeholder">
          ${this.getInitials(event.target.alt)}
        </div>
      `;
    },
  },
  
  mounted() {
        this.$emit("loading-change", true); 

    this.loadCompanies(false);
  },
};
</script>

<style scoped>
.listings-container {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
   width: 100%;
}

.listings-card {
  width: 100%;
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

/* Companies Grid */
.companies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.company-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.company-card:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.company-logo {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.25rem;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.company-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin: 0;
  line-height: 1.3;
  word-break: break-word;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: #ffc107;
  font-size: 1rem;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.claimed-badge {
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
}

.company-category {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: #666;
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 0 0 16px 0;
  font-size: 1rem;
}

.retry-button {
  margin-top: 8px;
}

/* Load More */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 24px 0 0 0;
}

.load-more-btn {
  min-width: 120px;
}

/* Buttons */
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
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
  .listings-container {
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

  .companies-grid {
    grid-template-columns: repeat(2,1fr)
  }

  .header {
    padding: 20px 16px 12px 16px;
  }

  .company-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }
  .header h2 {
    font-size: 1.35rem;
  }

  .company-card {
    padding: 16px;
  }
}
</style>
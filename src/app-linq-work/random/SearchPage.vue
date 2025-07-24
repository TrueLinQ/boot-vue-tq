<template>
  <div class="app">
    <div class="container">
      <!-- Search Section -->
      <div class="search-card">
        <div class="header">
          <h2>Search Professionals</h2>
          <p>Find and connect with professionals in your field</p>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by name, profession, or skills..."
              class="search-input"
              @keyup.enter="performSearch(false)"
            />
            <button @click="performSearch(false)" class="search-btn" :disabled="loading">
              <Loader v-if="loading" class="loader-icon" :size="18" />
              <Search v-else :size="18" />
            </button>
          </div>

          <!-- Filter Section -->
          <div class="filter-section">
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <select v-model="selectedCategory" @change="performSearch(false)" class="filter-select">
                <option value="">All Categories</option>
                <option value="CONSULTANT">Consultant</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div class="filter-group">
              <button @click="clearFilters" class="btn btn-secondary">Clear All Filters</button>
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
                loading && professionals.length === 0
                  ? "Searching..."
                  : `${totalCount} Professional${totalCount !== 1 ? "s" : ""} Found`
              }}
            </h3>
            <button @click="goToCreateProfile" class="btn btn-primary create-profile-btn">
              <span>Join as Professional</span>
              <ArrowRight :size="16" />
            </button>
          </div>
          <p v-if="(searchQuery || selectedCategory) && !loading">Showing results for your search criteria</p>
        </div>

        <!-- Loading State (Initial Load) -->
        <div v-if="loading && professionals.length === 0" class="loading-state">
          <p>Loading professionals...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="performSearch(false)" class="btn btn-primary">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="professionals.length === 0 && !loading" class="empty-state">
          <p>No professionals found matching your criteria</p>
          <button v-if="searchQuery || selectedCategory" @click="clearFilters" class="btn btn-secondary">
            Clear Filters
          </button>
        </div>

        <!-- Professional Cards -->
        <div v-else class="professionals-grid">
          <div v-for="professional in professionals" :key="professional.id" class="professional-card">
            <div class="card-header">
              <div class="professional-avatar">
                {{ getInitials(professional.businessDetails?.title) }}
                  
              </div>
              <div class="professional-info">
                <h4>{{ professional.businessDetails?.title }}</h4>
                <p class="profession">{{ professional.title }}</p>
              </div>
            </div>

            <p class="description">{{ professional.description }}</p>

            <div class="meta-info">
              <span class="category">{{ professional.category }}</span>
            </div>

            <div class="card-actions">
              <button @click="viewProfile(professional.id)" class="btn btn-secondary">View Profile</button>

              <!-- Connection Logic -->
              <div class="connection-section">
                <!-- Connected Badge -->
                <span v-if="professional.areConnected" class="connected-badge"> Connected </span>

                <!-- Connect Button -->
                <button
                  v-else-if="professional.canSendRequest"
                  @click="connect(professional.userId)"
                  class="btn btn-primary"
                  :disabled="connectingIds.includes(professional.userId)"
                >
                  <Loader v-if="connectingIds.includes(professional.userId)" class="loader-icon" :size="16" />
                  <span>{{ connectingIds.includes(professional.userId) ? "Connecting..." : "Connect" }}</span>
                </button>

                <!-- Pending Badge -->
                <span v-else class="pending-badge"> Pending </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="load-more">
          <button @click="loadMore" class="btn btn-primary" :disabled="loading">
            <Loader v-if="loading" class="loader-icon" :size="18" />
            <span>{{ loading ? "Loading..." : "Load More Professionals" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, Loader,ArrowRight } from "lucide-vue";
import { searchProfessionals, sendConnection } from "../api/profileCreate";

export default {
  name: "SearchProfessionals",
  components: {
    Search,
    Loader,
    ArrowRight
  },
  data() {
    return {
      searchQuery: "",
      selectedCategory: "",
      loading: false,
      error: null,

      professionals: [],
      totalCount: 0,
      pageSize: 20,
      startIndex: 0,

      connectingIds: [],

      // Default params
      radius: 10,
      defaultLat: 10.0889,
      defaultLng: 76.3273,
    };
  },
  computed: {
    canLoadMore() {
      return this.professionals.length < this.totalCount && this.totalCount > 0;
    },
  },
  methods: {
    async performSearch(loadMore = false) {
      this.loading = true;
      this.error = null;

      // Determine the correct startIndex (page number) for this API call
      let currentStartIndex;

      if (!loadMore) {
        // For new search, always start from page 0
        currentStartIndex = 0;
        this.professionals = [];
        this.totalCount = 0;
      } else {
        // For load more, use current page number
        currentStartIndex = this.startIndex;
      }

      try {
        const params = {
          radius: this.radius,
          pageSize: this.pageSize,
          startIndex: currentStartIndex, // This is the page number (0, 1, 2, 3...)
        };

        if (this.searchQuery.trim()) {
          params.searchStr = this.searchQuery.trim();
        }

        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }

        console.log("Searching with params:", params);
        const response = await searchProfessionals(params);

        if (response && response.data && response.data.results) {
          const result = response.data.results[0];

          if (result && result.profileDetails && Array.isArray(result.profileDetails)) {
            const newProfessionals = result.profileDetails;

            if (loadMore) {
              // Append new professionals to existing list
              this.professionals = [...this.professionals, ...newProfessionals];
            } else {
              // Replace professionals list for new search
              this.professionals = newProfessionals;
            }

            // Update totalCount (should be the same for both cases)
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
              `Loaded ${newProfessionals.length} professionals from page ${currentStartIndex}. Total: ${this.professionals.length}/${this.totalCount}. Next page: ${this.startIndex}`
            );
          } else {
            // Handle empty result case
            if (!loadMore) {
              this.professionals = [];
              this.totalCount = 0;
              this.startIndex = 0; // Reset to page 0 for empty results
            }
          }
        } else {
          // Handle empty response case
          if (!loadMore) {
            this.professionals = [];
            this.totalCount = 0;
            this.startIndex = 0; // Reset to page 0 for empty response
          }
        }
      } catch (error) {
        this.error = `Search failed: ${error.message}`;
        console.error("Search error:", error);

        // Reset data on error only for new search
        if (!loadMore) {
          this.professionals = [];
          this.totalCount = 0;
          this.startIndex = 0;
        }
      } finally {
        this.loading = false;
      }
    },

    goToProfile() {
      this.$router.push("/work/profile");
    },
    goToCreateProfile() {
      this.$router.push("/create");
    },

    loadMore() {
      this.performSearch(true);
    },

    clearFilters() {
      this.searchQuery = "";
      this.selectedCategory = "";
      // Reset pagination state before performing search
      this.startIndex = 0;
      this.professionals = [];
      this.totalCount = 0;
      this.performSearch(false); // Explicitly pass false
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

    viewProfile(professionalId) {
      console.log("View profile for professional:", professionalId);
      this.$router.push(`/profile/${professionalId}`);
    },

    async connect(professionalId) {
      console.log("Connect with professional:", professionalId);

      // Add to connecting state
      this.connectingIds.push(professionalId);

      try {
        // Call the connection API
        await sendConnection({ userId: professionalId });

        // Update the professional's connection status
        const professional = this.professionals.find((p) => p.userId === professionalId);
        if (professional) {
          // After sending connection request, it becomes pending
          professional.canSendRequest = false;
          // Note: areConnected will be true only after the other person accepts
        }

        console.log("Connection request sent successfully!");

        // Optional: Show success message
        this.$toast?.success("Connection request sent!");
      } catch (error) {
        console.error("Connect error:", error);

        // Show error message
        this.$toast?.error(`Failed to send connection request: ${error.message}`);

        // Or use alert if no toast system
        alert(`Failed to send connection request: ${error.message}`);
      } finally {
        // Remove from connecting state
        this.connectingIds = this.connectingIds.filter((userId) => userId !== professionalId);
      }
    },

    // Debug method to check current state
    checkState() {
      console.log("Current state:", {
        startIndex: this.startIndex,
        professionals: this.professionals.length,
        totalCount: this.totalCount,
        searchQuery: this.searchQuery,
        selectedCategory: this.selectedCategory,
      });
    },
  },

  mounted() {
    this.performSearch(false); // Explicitly pass false for initial load
  },
};
</script>

<style scoped>

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-card,
.results-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.header {
  margin-bottom: 30px;
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

.search-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #666;
  z-index: 1;
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

.search-btn {
  padding: 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 50px;
}

.search-btn:hover:not(:disabled) {
  background: #333;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loader-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* create profile */
.results-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 16px;
}

.create-profile-btn {
  font-size: 0.9rem;
  padding: 12px 20px;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 6px; /* Space between icon and text */
}

.results-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 16px;
}

.create-profile-btn {
  font-size: 0.9rem;
  padding: 12px 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Mobile Responsive for the new button */
@media (max-width: 768px) {
  .results-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .create-profile-btn {
    align-self: stretch;
    text-align: center;
  }
}

.filter-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
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

.results-header {
  margin-bottom: 30px;
}

.results-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.results-header p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  margin: 0 auto;
  color: #000;
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

.error-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.error-state p {
  margin-bottom: 16px;
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 1rem;
}

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
  margin-bottom: 16px;
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

.description {
  color: #333;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0 0 16px 0;
  word-wrap: break-word;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.category {
  background: #f0f0f0;
  color: #666;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.verified-badge {
  background: #e8f5e8;
  color: #2d7d2d;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

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

.connected-badge {
  background: #e8f5e8;
  color: #2d7d2d;
  font-size: 0.85rem;
  padding: 11px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  display: flex;
  justify-content: center;
}

.pending-badge {
  display: flex;
  background: #fff4e5;
  color: #d9822b;
  font-size: 0.85rem;
  padding: 11px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  justify-content: center;
}

.cannot-connect {
  background: #f5f5f5;
  color: #999;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

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
    padding: 24px;
  }

  .professionals-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .search-bar {
    flex-direction: column;
    gap: 16px;
  }

  .search-input {
    padding: 16px 16px 16px 52px;
  }

  .search-btn {
    align-self: stretch;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .professional-card {
    padding: 16px;
  }

  .card-actions {
    flex-direction: column;
  }

  .professional-avatar {
    width: 48px;
    height: 48px;
    font-size: 0.9rem;
  }
}
</style>

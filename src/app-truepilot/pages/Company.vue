<template>
  <div class="companies-container">
    <Header />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header -->
          <div class="header-section">
            <h1>Browse Companies</h1>
            <p>Discover and explore companies based on authentic reviews</p>
          </div>

          <div class="stats-image">
            <img src="./LovingDoodle.png" alt="Companies Illustration" />
          </div>

          <!-- Search and Filter Section -->
          <div class="search-filter-section">
            <!-- Search Bar -->
            <div class="search-container">
              <div class="search-input-wrapper">
                <Search class="search-icon" :size="20" />
                <input v-model="searchQuery" type="text" class="search-input" placeholder="Search companies..." />
              </div>
            </div>

            <!-- Filter Options -->
            <div class="filter-section">
              <div class="filter-group">
                <label class="filter-label">Sort by:</label>
                <select v-model="sortBy" class="filter-select">
                  <option value="latest">Latest</option>
                  <option value="rating-high">Highest Rated</option>
                  <option value="rating-low">Lowest Rated</option>
                  <option value="most-reviewed">Most Reviewed</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Category:</label>
                <select v-model="selectedCategory" class="filter-select">
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="food">Food & Beverage</option>
                  <option value="automotive">Automotive</option>
                  <option value="real-estate">Real Estate</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Rating:</label>
                <select v-model="ratingFilter" class="filter-select">
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Results Info -->
          <div class="results-info">
            <span class="results-count">{{ filteredCompanies.length }} companies found</span>
            <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
          </div>

          <!-- Companies Grid -->
          <div class="companies-grid">
            <div
              v-for="company in paginatedCompanies"
              :key="company.id"
              class="company-card"
              @click="viewCompany(company)"
            >
              <!-- Company Header with Logo and Title -->
              <div class="company-header">
                <div class="company-logo">
                  <img :src="company.logo" alt="logo" />
                </div>
                <div class="company-title-section">
                  <h3 class="company-name">{{ company.name }}</h3>
                  <span class="company-category">{{ getCategoryName(company.category) }}</span>
                </div>
              </div>

              <!-- Rating Section -->
              <div class="rating-section">
                <div class="stars-display">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :size="16"
                    :class="['star-small', i <= company.rating ? 'star-filled' : 'star-empty']"
                  />
                </div>
                <span class="rating-text">{{ company.rating.toFixed(1) }}</span>
                <span class="review-count">({{ company.reviewCount }} reviews)</span>
              </div>

              <!-- Company Description -->
              <p class="company-description">{{ company.description }}</p>

              <!-- Company Stats -->
              <div class="company-stats">
                <div class="stat-item">
                  <span class="stat-label">Founded:</span>
                  <span class="stat-value">{{ company.founded }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Employees:</span>
                  <span class="stat-value">{{ company.employees }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-section">
            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Previous</button>

            <div class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="['pagination-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
            </div>

            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
          </div>

          <!-- No Results -->
          <div v-if="filteredCompanies.length === 0" class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>No companies found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Star, Search } from "lucide-vue";
import Header from "./Header.vue";

export default {
  name: "CompaniesSection",
  components: {
    Star,
    Search,
    Header,
  },
  data() {
    return {
      searchQuery: "",
      sortBy: "latest",
      selectedCategory: "",
      ratingFilter: "",
      currentPage: 1,
      itemsPerPage: 12,

      // Sample companies data
      companies: [
        {
          id: 1,
          name: "TechCorp Solutions",
          logo: "https://via.placeholder.com/80x80/000000/FFFFFF?text=TC",
          category: "technology",
          rating: 4.5,
          reviewCount: 128,
          description:
            "Leading software development company specializing in enterprise solutions and cloud technologies.",
          founded: "2015",
          employees: "500-1000",
          dateAdded: new Date("2024-01-15"),
        },
        {
          id: 2,
          name: "HealthFirst Medical",
          logo: "https://via.placeholder.com/80x80/2563EB/FFFFFF?text=HF",
          category: "healthcare",
          rating: 4.8,
          reviewCount: 89,
          description:
            "Comprehensive healthcare services with a focus on patient-centered care and medical innovation.",
          founded: "2010",
          employees: "1000+",
          dateAdded: new Date("2024-02-20"),
        },
        {
          id: 3,
          name: "GreenLeaf Restaurants",
          logo: "https://via.placeholder.com/80x80/16A34A/FFFFFF?text=GL",
          category: "food",
          rating: 4.2,
          reviewCount: 256,
          description: "Farm-to-table dining experience with organic ingredients and sustainable practices.",
          founded: "2018",
          employees: "100-500",
          dateAdded: new Date("2024-03-10"),
        },
        {
          id: 4,
          name: "SecureBank Financial",
          logo: "https://via.placeholder.com/80x80/DC2626/FFFFFF?text=SB",
          category: "finance",
          rating: 3.9,
          reviewCount: 167,
          description: "Full-service banking with innovative digital solutions and personalized financial services.",
          founded: "1995",
          employees: "1000+",
          dateAdded: new Date("2024-01-05"),
        },
        {
          id: 5,
          name: "EduLearn Academy",
          logo: "https://via.placeholder.com/80x80/7C3AED/FFFFFF?text=EA",
          category: "education",
          rating: 4.6,
          reviewCount: 94,
          description: "Online learning platform offering courses in technology, business, and creative skills.",
          founded: "2020",
          employees: "50-100",
          dateAdded: new Date("2024-02-28"),
        },
        {
          id: 6,
          name: "StyleHub Retail",
          logo: "https://via.placeholder.com/80x80/EA580C/FFFFFF?text=SH",
          category: "retail",
          rating: 4.1,
          reviewCount: 203,
          description: "Fashion retail chain offering trendy clothing and accessories for all ages.",
          founded: "2012",
          employees: "500-1000",
          dateAdded: new Date("2024-03-15"),
        },
        {
          id: 7,
          name: "AutoDrive Motors",
          logo: "https://via.placeholder.com/80x80/0F172A/FFFFFF?text=AD",
          category: "automotive",
          rating: 4.3,
          reviewCount: 142,
          description: "Innovative car manufacturer focusing on electric vehicles and smart mobility solutions.",
          founded: "2008",
          employees: "1000+",
          dateAdded: "2024-04-01T00:00:00Z",
        },
        {
          id: 8,
          name: "BuildPro Construction",
          logo: "https://via.placeholder.com/80x80/4B5563/FFFFFF?text=BP",
          category: "construction",
          rating: 4.0,
          reviewCount: 76,
          description:
            "Residential and commercial construction services with a commitment to sustainability and quality.",
          founded: "2000",
          employees: "500-1000",
          dateAdded: "2024-03-05T00:00:00Z",
        },
        {
          id: 9,
          name: "NextGen Gaming",
          logo: "https://via.placeholder.com/80x80/9333EA/FFFFFF?text=NG",
          category: "entertainment",
          rating: 4.7,
          reviewCount: 321,
          description: "Game development studio creating immersive experiences for mobile, console, and VR platforms.",
          founded: "2016",
          employees: "200-500",
          dateAdded: "2024-01-28T00:00:00Z",
        },
        {
          id: 10,
          name: "TravelNest Tours",
          logo: "https://via.placeholder.com/80x80/0EA5E9/FFFFFF?text=TN",
          category: "travel",
          rating: 4.4,
          reviewCount: 109,
          description: "Curated travel experiences with personalized itineraries and exclusive packages worldwide.",
          founded: "2013",
          employees: "100-300",
          dateAdded: "2024-02-12T00:00:00Z",
        },
        {
          id: 11,
          name: "FarmFresh Organics",
          logo: "https://via.placeholder.com/80x80/22C55E/FFFFFF?text=FF",
          category: "agriculture",
          rating: 4.5,
          reviewCount: 88,
          description: "Organic farming and delivery service offering fresh produce and dairy to your doorstep.",
          founded: "2011",
          employees: "50-200",
          dateAdded: "2024-03-20T00:00:00Z",
        },
        {
          id: 12,
          name: "PixelPerfect Designs",
          logo: "https://via.placeholder.com/80x80/F43F5E/FFFFFF?text=PD",
          category: "design",
          rating: 4.9,
          reviewCount: 134,
          description: "Creative agency providing UI/UX, branding, and digital marketing services.",
          founded: "2017",
          employees: "50-100",
          dateAdded: "2024-04-10T00:00:00Z",
        },
        {
          id: 13,
          name: "CloudNest Hosting",
          logo: "https://via.placeholder.com/80x80/38BDF8/FFFFFF?text=CN",
          category: "technology",
          rating: 4.2,
          reviewCount: 196,
          description: "Reliable and scalable web hosting solutions with top-tier support.",
          founded: "2012",
          employees: "200-500",
          dateAdded: "2024-02-05T00:00:00Z",
        },
        {
          id: 14,
          name: "UrbanFit Gym",
          logo: "https://via.placeholder.com/80x80/FB923C/FFFFFF?text=UF",
          category: "fitness",
          rating: 4.6,
          reviewCount: 154,
          description: "Modern fitness centers with expert trainers and holistic wellness programs.",
          founded: "2019",
          employees: "100-200",
          dateAdded: "2024-03-25T00:00:00Z",
        },
        {
          id: 15,
          name: "EcoPack Solutions",
          logo: "https://via.placeholder.com/80x80/10B981/FFFFFF?text=EP",
          category: "manufacturing",
          rating: 4.0,
          reviewCount: 63,
          description: "Sustainable packaging products made from biodegradable and recycled materials.",
          founded: "2014",
          employees: "300-600",
          dateAdded: "2024-01-18T00:00:00Z",
        },
        {
          id: 16,
          name: "BrightPath Counseling",
          logo: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=BC",
          category: "wellness",
          rating: 4.8,
          reviewCount: 72,
          description:
            "Mental health and counseling services with licensed professionals and flexible online sessions.",
          founded: "2021",
          employees: "20-50",
          dateAdded: "2024-02-22T00:00:00Z",
        },
      ],
    };
  },
  computed: {
    filteredCompanies() {
      let filtered = [...this.companies];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (company) =>
            company.name.toLowerCase().includes(query) ||
            company.description.toLowerCase().includes(query) ||
            this.getCategoryName(company.category).toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (this.selectedCategory) {
        filtered = filtered.filter((company) => company.category === this.selectedCategory);
      }

      // Apply rating filter
      if (this.ratingFilter) {
        const minRating = parseInt(this.ratingFilter);
        filtered = filtered.filter((company) => company.rating >= minRating);
      }

      // Apply sorting
      switch (this.sortBy) {
        case "latest":
          filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case "rating-high":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "rating-low":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "most-reviewed":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "alphabetical":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      return filtered;
    },

    totalPages() {
      return Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
    },

    paginatedCompanies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCompanies.slice(start, end);
    },

    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },

    hasActiveFilters() {
      return this.searchQuery || this.selectedCategory || this.ratingFilter || this.sortBy !== "latest";
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

    viewCompany(company) {
      console.log("Viewing company:", company);
      // Handle company view navigation
    },

    clearFilters() {
      this.searchQuery = "";
      this.selectedCategory = "";
      this.ratingFilter = "";
      this.sortBy = "latest";
      this.currentPage = 1;
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
    },
    ratingFilter() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.companies-container {
  min-height: 100vh;
  background: #fff;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.container {
  margin-top: 60px;
}

.stats-image {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.stats-image img {
  max-width: 292px;
  height: auto;
  object-fit: contain;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.header-section h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.header-section p {
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

/* Search and Filter Section */
.search-filter-section {
  background: #fff;
  /* border: 1px solid #e5e5e5; */
  border-radius: 12px;
  /* padding: 32px 200px; */
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 32px;
}

.search-container {
  margin-bottom: 32px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px 12px 48px;
  font-size: 15px;
  transition: border-color 0.2s ease;
  background: #fff;
  font-weight: 400;
  color: #1a1a1a;
  font-family: inherit;
}

.search-input:focus {
  border-color: #000000;
  outline: none;
  box-shadow: none;
}

.search-input::placeholder {
  color: #666;
}

.filter-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.filter-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
  text-align: left;
}

.filter-select {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  background: #fff;
  color: #1a1a1a;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease;
  font-weight: 400;
}

.filter-select:focus {
  border-color: #000000;
  outline: none;
  box-shadow: none;
}

/* Results Info */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto 24px auto;
  max-width: 800px;
  padding: 0 4px;
}

.results-count {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 15px;
}

.clear-filters-btn {
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.clear-filters-btn:hover {
  border-color: #000000;
  color: #000000;
}

/* Companies Grid */
.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.company-card {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.company-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.company-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.company-logo {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.company-logo img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.company-title-section {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.company-category {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.company-info {
  flex: 1;
  min-width: 0;
}

.company-header {
  margin-bottom: 12px;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.company-category {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.stars-display {
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

.review-count {
  color: #666;
  font-size: 14px;
}

.company-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

.company-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 4px;
  font-size: 13px;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.stat-value {
  color: #1a1a1a;
  font-weight: 600;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination-btn {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #000000;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 8px;
}

.pagination-number {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
}

.pagination-number:hover {
  border-color: #000000;
}

.pagination-number.active {
  background: #000000;
  color: #fff;
  border-color: #000000;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.no-results p {
  font-size: 16px;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .companies-container {
    padding: 20px 0;
  }

  .search-filter-section {
    padding: 24px;
  }

  .filter-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .companies-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .company-card {
    padding: 20px;
    gap: 16px;
  }

  .company-logo img {
    width: 40px;
    height: 40px;
  }

  .company-name {
    font-size: 16px;
  }

  .results-info {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .pagination-section {
    gap: 12px;
  }

  .pagination-numbers {
    gap: 4px;
  }

  .pagination-number {
    padding: 8px 12px;
    min-width: 40px;
  }
}

@media (max-width: 480px) {
  .search-filter-section {
    padding: 20px;
  }

  .company-card {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .company-logo {
    align-self: center;
  }

  .company-stats {
    justify-content: flex-start;
  }
}
</style>

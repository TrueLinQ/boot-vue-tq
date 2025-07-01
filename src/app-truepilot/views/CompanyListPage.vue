<template>
  <div class="companies-page-wrapper">
    <!-- <AppHeader /> -->
    <div class="page-content container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <CompaniesHeader />

          <div class="search-filter-section">
            <div class="search-container">
              <CompanySearch :value="searchQuery" @input="searchQuery = $event" placeholder="Search companies..." />
            </div>
            <CompanyFilters
              :sortBy.sync="sortBy"
              :selectedCategory.sync="selectedCategory"
              :ratingFilter.sync="ratingFilter"
            />
          </div>

          <div class="results-info">
            <span class="results-count">{{ filteredCompanies.length }} companies found</span>
            <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
              Clear Filters
            </button>
          </div>

          <div class="companies-grid" v-if="paginatedCompanies.length > 0">
            <CompanyCard
              v-for="company in paginatedCompanies"
              :key="company.id"
              :company="company"
              @view-company="viewCompany"
            />
          </div>

          <div v-else class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>No companies found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>

          <PaginationControls
            v-if="filteredCompanies.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            @prev-page="currentPage--"
            @next-page="currentPage++"
            @go-to-page="page => currentPage = page"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import all necessary components
import CompanySearch from '../components/companies/CompanySearch.vue';
import CompaniesHeader from '../components/companies/CompaniesHeader.vue';
import CompanyFilters from '../components/companies/CompanyFilters.vue';
import CompanyCard from '../components/companies/CompanyCard.vue';
import PaginationControls from '../components/ui/PaginationControls.vue';

// Import dummy data
import { companiesData, categoriesMap } from '../constants/dummydata';

export default {
  // Component name
  name: 'CompanyListPage',

  // Register components used in the template
  components: {
    // AppHeader,
    CompanySearch,
    CompaniesHeader,
    CompanyFilters,
    CompanyCard,
    PaginationControls,
  },

  // Reactive data properties (replaces ref from Vue 3)
  data() {
    return {
      searchQuery: '',
      sortBy: 'latest',
      selectedCategory: '',
      ratingFilter: '',
      currentPage: 1,
      itemsPerPage: 12, // This can be a const or a data property
      companies: companiesData, // Store the dummy data in data
      categoriesMap: categoriesMap, // Store the categories map in data
    };
  },

  // Computed properties (replaces computed from Vue 3)
  computed: {
    filteredCompanies() {
      let filtered = [...this.companies]; // Use this.companies

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (company) =>
            company.name.toLowerCase().includes(query) ||
            company.description.toLowerCase().includes(query) ||
            this.categoriesMap[company.category]?.toLowerCase().includes(query) // Use this.categoriesMap
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
        case 'latest':
          filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case 'rating-high':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'rating-low':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'most-reviewed':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'alphabetical':
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

    hasActiveFilters() {
      return this.searchQuery || this.selectedCategory || this.ratingFilter || this.sortBy !== 'latest';
    },
  },

  // Methods (replaces functions from Vue 3 setup)
  methods: {
    viewCompany(company) {
      console.log('Viewing company:', company);
      // If you were using Vue Router in Vue 2, you'd access it like this:
      // this.$router.push({ name: 'CompanyPage', params: { id: company.id } });
    },

    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = '';
      this.ratingFilter = '';
      this.sortBy = 'latest';
      this.currentPage = 1; // Reset page on clear
    },
  },

  // Watchers (replaces watch from Vue 3)
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
    // Watch totalPages to ensure currentPage doesn't exceed new total
    totalPages(newVal) {
      if (this.currentPage > newVal && newVal > 0) {
        this.currentPage = newVal;
      } else if (newVal === 0) {
        this.currentPage = 1; // If no results, reset to page 1
      }
    },
  },
};
</script>

<style scoped>
.companies-page-wrapper {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: var(--spacing-xxl);
}

.page-content.container {
  margin-top: var(--spacing-xxl);
  max-width: var(--content-max-width);
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--spacing-md);
}

.row {
  display: flex;
  justify-content: center;
}

.col-lg-10 {
  width: 100%;
  max-width: 960px;
}

.search-filter-section {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  /* max-width: 800px; */
  margin: 0 auto;
  margin-bottom: var(--spacing-xxl);
}

.search-container {
  margin-bottom: var(--spacing-xxl);
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto var(--spacing-lg) auto;
  /* max-width: 800px; */
  padding: 0 var(--spacing-xs);
}

.results-count {
  font-weight: var(--font-weight-medium);
  color: var(--color-heading);
  font-size: var(--font-size-md);
}

.clear-filters-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 8px 16px;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  cursor: pointer;
  transition: var(--transition-ease);
  font-weight: var(--font-weight-medium);
}

.clear-filters-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
  gap: var(--spacing-xl);
  /* max-width: 800px; */
  margin: 0 auto;
}

.no-results {
  text-align: center;
  padding: var(--spacing-xxl) var(--spacing-md);
  color: var(--color-text-light);
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.no-results h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-heading);
  margin: 0 0 var(--spacing-sm) 0;
}

.no-results p {
  font-size: var(--font-size-md);
  margin: 0;
}

@media (max-width: 768px) {
  .companies-page-wrapper {
    padding: var(--spacing-lg) 0;
  }

  .page-content.container {
    padding: 0 var(--spacing-sm);
  }

  .search-filter-section {
    padding: var(--spacing-lg);
  }

  .results-info {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .search-filter-section {
    padding: var(--spacing-md);
  }
}
</style>
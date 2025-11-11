<template>
  <div class="company-search-wrapper" ref="wrapper">
    <label v-if="!simpleSearch" class="form-label" for="company-search">Company *</label>
    <p v-if="!simpleSearch" class="help-text">
      It is easy to get the company name if you enter company's website URL. (for example: www.eurekaforbes.com)
    </p>
    <div class="input-container">
      <img v-if="selectedCompany && selectedCompany.logo" :src="selectedCompany.logo" :alt="selectedCompany.name"
        class="selected-logo" />
      <input id="company-search" v-model="searchTerm" type="text" class="form-input"
        :class="{ 'has-logo': selectedCompany && selectedCompany.logo }" placeholder="Search for a company..."
        @input="handleInput" @focus="handleFocus" autocomplete="off" required />
      <button v-if="selectedCompany" @click="clearSelection" class="clear-btn" type="button" title="Clear selection">
        ×
      </button>
    </div>

    <div v-if="isOpen" class="dropdown">
      <!-- Loading state -->
      <div v-if="isLoading" class="dropdown-item loading">
        <span class="spinner"></span>
        {{ loadingMessage }}
      </div>

      <!-- Results found -->
      <template v-else-if="companies.length > 0">
        <div v-for="company in companies" :key="company.id" class="dropdown-item" @click="selectCompany(company)">
          <img v-if="company.logo" :src="company.logo" :alt="company.name" class="company-logo" />
          <span>{{ company.name }}</span>
        </div>
      </template>

      <!-- No results -->
      <div v-else-if="searchTerm && !isLoading" class="dropdown-item no-results">
        {{ noResultsMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// Import your API functions - UPDATE THIS PATH!
import { searchBusiness, getDomainMeta, createBusiness } from "../api/businessCrud";

export default {
  name: "CompanySearch",
  props: {
    value: {
      type: String,
      default: "",
    },
    simpleSearch: {
      type: Boolean,
      default: false,
    },
    preselectedCompany: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      searchTerm: this.value,
      isOpen: false,
      companies: [],
      selectedCompany: null,
      isLoading: false,
      loadingMessage: "Searching...",
      noResultsMessage: "No company found.",
      searchTimeout: null,
      isPreselected: false, // NEW: Track if company is preselected
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);

    // Set preselected company
    if (this.preselectedCompany) {
      this.selectedCompany = this.preselectedCompany;
      this.searchTerm = this.preselectedCompany.name;
      this.isPreselected = true; // NEW: Mark as preselected
      this.$emit("input", this.preselectedCompany.name);
      this.$emit("company-selected", this.preselectedCompany);
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
  watch: {
    value(newVal) {
      // NEW: Only update searchTerm if not from preselection
      if (!this.isPreselected) {
        this.searchTerm = newVal;
      }
    },
    searchTerm(newVal) {
      this.$emit("input", newVal);
    },
    // NEW: Watch for changes to preselectedCompany prop
    preselectedCompany(newVal) {
      if (newVal) {
        this.selectedCompany = newVal;
        this.searchTerm = newVal.name;
        this.isPreselected = true;
        this.$emit("input", newVal.name);
        this.$emit("company-selected", newVal);
      }
    }
  },
  methods: {
    handleInput() {
      // NEW: Only clear selection if user is actually typing (not preselected)
      if (this.isPreselected) {
        this.isPreselected = false; // User started typing, clear preselection flag
      }

      this.isOpen = true;
      this.selectedCompany = null; // Clear selected company when typing

      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Only search if at least 3 characters
      if (this.searchTerm.trim().length < 3) {
        this.companies = [];
        return;
      }

      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },

    handleFocus() {
      // NEW: Don't open dropdown if company is already selected
      if (this.selectedCompany) {
        return;
      }

      if (this.searchTerm.trim()) {
        this.isOpen = true;
        if (this.companies.length === 0) {
          this.performSearch();
        }
      }
    },

    async performSearch() {
      const query = this.searchTerm.trim();

      if (!query || query.length < 3) {
        this.companies = [];
        return;
      }

      this.isLoading = true;
      this.loadingMessage = "Searching for companies...";
      this.companies = [];

      try {
        // Step 1: Search for existing businesses
        const searchResponse = await searchBusiness(query);

        if (searchResponse.data && searchResponse.data.results && searchResponse.data.results.length > 0) {
          // Businesses found
          this.companies = searchResponse.data.results;
          this.isLoading = false;
        } else {
          // No businesses found
          if (this.simpleSearch) {
            // If simple search mode, don't proceed to web search
            this.isLoading = false;
            this.noResultsMessage = "No company found.";
          } else {
            // Proceed to web search
            await this.searchWeb(query);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        this.isLoading = false;
        this.noResultsMessage = "Error searching. Please try again.";
      }
    },

    async searchWeb(query) {
      this.loadingMessage = "Searching the web for companies...";

      try {
        // Construct URL from query
        const url = this.constructUrl(query);

        // Step 2: Get domain metadata
        const metaResponse = await getDomainMeta(url);

        if (metaResponse.data && metaResponse.data.results && metaResponse.data.results.length > 0) {
          // Metadata found, create the business
          this.loadingMessage = "Creating company profile...";
          const metaData = metaResponse.data.results[0];
          await this.createNewBusiness(metaData);
        } else {
          // No metadata found
          this.isLoading = false;
          this.noResultsMessage = "No company found.";
        }
      } catch (error) {
        console.error("Web search error:", error);
        this.isLoading = false;
        this.noResultsMessage = "No company found.";
      }
    },

    async createNewBusiness(metaData) {
      try {
        // Step 3: Create the business
        const businessData = {
          name: metaData.title,
          logo: metaData.picture,
          website: metaData.website,
          description: metaData.businessDescription,
          socialMediaUrls : metaData.socialMediaUrls
        };

        const createResponse = await createBusiness(businessData);

        if (createResponse.data) {
          // Add the newly created business to the list
          const newBusiness = {
            id: createResponse.data.id || Date.now().toString(),
            name: businessData.name,
            logo: businessData.logo,
            category: null,
          };

          this.companies = [newBusiness];
          this.isLoading = false;
        }
      } catch (error) {
        console.error("Create business error:", error);
        this.isLoading = false;
        this.noResultsMessage = "Error creating company. Please try again.";
      }
    },

    constructUrl(query) {
      const cleanQuery = query.toLowerCase().trim();

      // If user already provided a domain with extension (contains a dot), use as-is
      if (cleanQuery.includes(".")) {
        return cleanQuery;
      }

      // If no extension, only then add .com
      return `${cleanQuery}.com`;
    },

    selectCompany(company) {
      this.searchTerm = company.name;
      this.selectedCompany = company;
      this.isOpen = false;
      this.isPreselected = false; // NEW: Clear preselection flag
      this.$emit("input", company.name);
      this.$emit("company-selected", company);
    },

    handleClickOutside(event) {
      if (this.$refs.wrapper && !this.$refs.wrapper.contains(event.target)) {
        this.isOpen = false;
      }
    },

    clearSelection() {
      this.searchTerm = "";
      this.selectedCompany = null;
      this.companies = [];
      this.isOpen = false;
      this.isPreselected = false; // NEW: Clear preselection flag
      this.$emit("input", "");
      this.$emit("company-selected", null);
    },
  },
};
</script>

<style scoped>
.company-search-wrapper {
  position: relative;
  /* margin-bottom: 1.5rem; */
  width: 100%;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.help-text {
  font-size: 0.813rem;
  color: #666;
  margin-top: -0.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.input-container {
  position: relative;
  width: 100%;
}

.selected-logo {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
  z-index: 10;
  pointer-events: none;
}

.form-input {
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

.form-input.has-logo {
  padding-left: 2.5rem;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-item:hover:not(.no-results):not(.loading) {
  background-color: #f5f5f5;
}

.dropdown-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item.no-results,
.dropdown-item.loading {
  color: #999;
  cursor: default;
}

.dropdown-item.no-results:hover,
.dropdown-item.loading:hover {
  background-color: white;
}

.company-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: #e0e0e0;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  z-index: 10;
}

.clear-btn:hover {
  background: #d0d0d0;
  color: #333;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

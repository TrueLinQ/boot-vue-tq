<template>
  <div class="hero-search-container">
    <div class="hero-search-card">
      <div class="hero-header">
        <div class="title-section">
          <h1 class="hero-title">Find and Review Companies</h1>
          <p class="hero-subtitle">Search for companies and read reviews from real users</p>
        </div>
        <WriteReviewButton @click="handleWriteReview" />
      </div>

      <div class="search-section">
        <CompanySearch 
          :simple-search="true" 
          @company-selected="handleCompanySelected" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import CompanySearch from './SearchDropdown.vue';
import WriteReviewButton from './WriteReviewButton.vue';

export default {
  name: "HeroSearchSection",
  
  components: {
    CompanySearch,
    WriteReviewButton,
  },
  
  emits: ['company-selected', 'write-review'],
  
  methods: {
    handleCompanySelected(company) {
      this.$emit('company-selected', company);
    },
    
    handleWriteReview() {
      this.$emit('write-review');
    },
  },
};
</script>

<style scoped>
.hero-search-container {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.hero-search-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.title-section {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.search-section {
  width: 100%;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-search-container {
    padding: 24px 16px;
  }

  .hero-header {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .hero-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 480px) {
  .hero-search-container {
    padding: 20px 12px;
  }

  .hero-title {
    font-size: 1.25rem;
  }

  .hero-subtitle {
    font-size: 0.8125rem;
  }
}
</style>
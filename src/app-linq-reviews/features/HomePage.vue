<template>
  <div class="home-container">
    <FullScreenLoader v-if="loading" /> 
    <div v-show="!loading" class="hero-wrapper">
      <Hero2 @company-selected="handleCompanySelected" @write-review="writeReview" />

      <!-- Company Listings Section -->
      <div class="max-container home-company-listings">
        <CompanyLisings @loading-change="handleLoadingChange" />
      </div>
    </div>
  </div>
</template>

<script>
import CompanySearch from "../components/SearchDropdown.vue";
import WriteReviewButton from "../components/WriteReviewButton.vue";
import CompanyLisings from "../components/CompanyLisings.vue";
import HeroSearchSection from "../components/HeroSearchSection.vue";
import Hero2 from "../components/Hero2.vue";
import FullScreenLoader from "../../app-linq-work/components/Loader.vue";

export default {
  components: {
    CompanySearch,
    WriteReviewButton,
    CompanyLisings,
    HeroSearchSection,
    Hero2,
    FullScreenLoader
  },

  data() {
    return {
      loading: true  // Start with true
    };
  },

  methods: {
    handleLoadingChange(isLoading) {
      console.log('Loading change:', isLoading); // Debug log
      this.loading = isLoading;
    },
    
    handleCompanySelected(company) {
      if (company && company.id) {
        this.$router.push(`/company/${company.id}`);
      }
    },

    writeReview() {
      this.$router.push("/create");
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
.hero-wrapper {
  display: flex;
  flex-direction: column;
}

.home-container {
  min-height: 100vh;
  padding: 60px 20px 40px 20px;
  display: flex;
  justify-content: center;
}

.home-content {
  max-width: 1200px;
  width: 100%;
}

.hero-section {
  margin-bottom: 14px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.hero-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.search-card {
  max-width: 400px;
  margin: 0 auto 24px auto;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px auto;
  max-width: 400px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider-text {
  padding: 0 16px;
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
  font-style: italic;
}

.review-button-wrapper {
  display: flex;
  justify-content: center;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .home-container {
    padding: 40px 16px 32px 16px;
  }

  .hero-title {
    font-size: 1.35rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.25rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }

  .divider {
    margin: 20px auto;
  }
}

.home-company-listings {
  margin-top: 30px;
}
</style>

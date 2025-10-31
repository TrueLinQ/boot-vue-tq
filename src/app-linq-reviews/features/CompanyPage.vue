<template>
  <div class="company-page">
    <FullScreenLoader v-if="loading" />
    <div v-else class="container">
      <CompanyDetails v-if="organizationId" :organization-id="organizationId"/>
      <!-- Reviews Section -->
      <div class="reviews-section">
        <CompanyReviews v-if="organizationId" :organization-id="organizationId" />
      </div>
    </div>
  </div>
</template>

<script>
import CompanyDetails from "../components/CompanyDetails.vue";
import FullScreenLoader from "../../app-linq-work/components/Loader.vue";
import CompanyReviews from "../comp/CompanyReviews.vue";
// Import your API function here
// import { getCompanyById } from "../api/company";

export default {
  components: {
    CompanyDetails,
    FullScreenLoader,
    CompanyReviews,
  },

  data() {
    return {
      company: null,
      loading: false,
      error: null,
    };
  },

  computed: {
    organizationId() {
      // Get the organization ID from route params
      return this.$route.params.id;
    },
  },

  methods: {
    async fetchCompany() {
      this.loading = true;
      this.error = null;

      try {
        const companyId = this.$route.params.id;

        // Replace this with your actual API call
        // const response = await getCompanyById(companyId);
        // this.company = response.data;

        // Mock data for now - remove this when you have the API
        setTimeout(() => {
          this.company = {
            id: companyId,
            name: "Sample Company",
            logo: "https://via.placeholder.com/150",
          };
          this.loading = false;
        }, 1000);
      } catch (error) {
        this.error = `Failed to load company details: ${error.message}`;
        console.error("Company fetch error:", error);
      } finally {
        // this.loading = false; // Uncomment when using real API
      }
    },
  },

  mounted() {
    this.fetchCompany();
  },
};
</script>

<style scoped>
.company-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #666;
}

.loader-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-state p {
  color: #c33;
  margin-bottom: 16px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

@media (max-width: 768px) {
  .company-page {
    padding: 32px 16px;
  }
}
</style>

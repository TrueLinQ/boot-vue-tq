<template>
  <div class="company-details-card">
    <FullScreenLoader v-if="loading" />
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
    </div>
    <div v-else-if="company">
      <div class="card-header">
        <div class="company-header">
          <!-- Company Logo -->
          <div class="company-logo-container">
            <img v-if="company.logo" :src="company.logo" :alt="company.name" class="company-logo" />
            <div v-else class="company-logo-placeholder">
              {{ getInitials(company.name) }}
            </div>
          </div>
          <!-- Company Info -->
          <div class="company-info">
            <h1 class="company-name">{{ company.name }}</h1>
            
            <!-- Rating Section -->
            <div class="rating-section">
              <div class="rating-display">
                <div class="stars">
                  <span v-for="star in 5" :key="star" class="star" :class="getStarClass(star)">
                    ★
                  </span>
                </div>
                <span class="rating-value">{{ formatRating(company.overAllRating) }}</span>
                <span class="rating-count">({{ company.ratingCount || 0 }} {{ company.ratingCount == 1 ? 'review' : 'reviews' }})</span>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <VisitWebsiteButton v-if="company.website" :website="company.website" />
          <WriteReviewButton @click="writeReview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBusinessById } from "../api/businessCrud";
import FullScreenLoader from "../../app-linq-work/components/Loader.vue";
import WriteReviewButton from "./WriteReviewButton.vue";
import VisitWebsiteButton from "./VisitWebsiteButton.vue";

export default {
  components: {
    FullScreenLoader,
    WriteReviewButton,
    VisitWebsiteButton,
  },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      company: null,
      loading: false,
      error: null,
    };
  },
  mounted() {
    this.fetchCompanyData();
  },
  watch: {
    organizationId() {
      this.fetchCompanyData();
    },
  },
  methods: {
    async fetchCompanyData() {
      if (!this.organizationId) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await getBusinessById(this.organizationId);

        console.log("Response XYZ:", response);

        if (response && response.data.results) {
          this.company = response.data.results[0];
        } else {
          this.error = "Company not found";
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        this.error = "Failed to load company details";
      } finally {
        this.loading = false;
      }
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
    formatRating(rating) {
      const num = parseFloat(rating);
      return isNaN(num) ? "0.0" : num.toFixed(1);
    },
    getStarClass(position) {
      const rating = parseFloat(this.company.overAllRating) || 0;
      if (position <= Math.floor(rating)) {
        return 'filled';
      } else if (position === Math.ceil(rating) && rating % 1 >= 0.5) {
        return 'half-filled';
      }
      return 'empty';
    },
    writeReview() {
      this.$router.push({
        path: "/create",
        query: {
          companyId: this.organizationId,
          companyName: this.company.name,
          companyLogo: this.company.logo,
        },
      });
    },
  },
};
</script>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #d32f2f;
  font-size: 1rem;
  margin: 0;
}

.company-details-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.company-header {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;
}

.header-actions {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
}

.company-logo-container {
  flex-shrink: 0;
}

.company-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
}

.company-logo-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #666;
}

.company-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.company-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0;
  word-wrap: break-word;
}

.rating-section {
  display: flex;
  align-items: center;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.5rem;
  color: #e0e0e0;
  transition: color 0.2s;
}

.star.filled {
  color: #FFD700;
}

.star.half-filled {
  background: linear-gradient(90deg, #FFD700 50%, #e0e0e0 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.star.empty {
  color: #e0e0e0;
}

.rating-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-left: 4px;
}

.rating-count {
  font-size: 0.875rem;
  color: #666;
}

@media (max-width: 768px) {
  .company-details-card {
    padding: 32px 24px;
  }

  .card-header {
    flex-direction: column-reverse;
  }

  .header-actions {
    order: -1;
    width: 100%;
    margin-bottom: 16px;
    flex-direction: column;
  }

  .company-header {
    gap: 20px;
    width: 100%;
  }

  .company-logo,
  .company-logo-placeholder {
    width: 64px;
    height: 64px;
  }

  .company-name {
    font-size: 1.5rem;
  }

  .rating-display {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .company-details-card {
    padding: 24px 20px;
  }

  .company-header {
    gap: 16px;
  }

  .company-logo,
  .company-logo-placeholder {
    width: 56px;
    height: 56px;
  }

  .company-logo-placeholder {
    font-size: 1.25rem;
  }

  .company-name {
    font-size: 1.25rem;
  }

  .star {
    font-size: 1.1rem;
  }

  .rating-value {
    font-size: 0.9rem;
  }

  .rating-count {
    font-size: 0.8rem;
  }
}
</style>
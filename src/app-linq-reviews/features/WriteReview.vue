<template>
  <div class="container">
    <FullScreenLoader v-if="isSubmitting" />
    
    <!-- Show success component after submission -->
    <ReviewSubmitted
      v-else-if="submitted"
      :company-name="reviewData.company"
      :company-logo="selectedCompanyLogo"
      @write-another="resetForm"
      @search-reviews="navigateToSearch"
    />
    
    <!-- Show form when not submitted -->
    <div v-else class="review-container">
      <div class="header">
        <h1 class="form-title">Write a Review</h1>
        <p class="form-tagline">Share your experience with others</p>
      </div>

      <div class="review-form">
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <CompanySearch 
              v-model="reviewData.company" 
              @company-selected="handleCompanySelected"
            />
          </div>

          <!-- Rest of form - only shown after company selection -->
          <div v-if="reviewData.verificationId" class="form-fields-container">
            <div class="form-group form-field-slide" style="animation-delay: 0.1s">
              <label class="form-label">Overall Rating</label>
              <div class="rating-container">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="star-button"
                  :class="{ active: star <= rating }"
                  @click="rating = star"
                >
                  ★
                </button>
              </div>
            </div>

            <div class="form-group form-field-slide" style="animation-delay: 0.2s">
              <label class="form-label" for="title">Review Title</label>
              <input
                id="title"
                v-model="reviewData.title"
                type="text"
                class="form-input"
                placeholder="Summarize your review"
                required
              />
            </div>

            <div class="form-group form-field-slide" style="animation-delay: 0.3s">
              <label class="form-label" for="review">Your Review</label>
              <textarea
                id="review"
                v-model="reviewData.content"
                class="form-textarea"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>

            <div class="button-group form-field-slide" style="animation-delay: 0.4s">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="resetForm"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
              </button>
            </div>
          </div>
        </form>

        <div v-if="errorMessage" class="error-message">
          ✗ {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import the createReview API function
import { createReview } from "../api/reviewCrud";
import FullScreenLoader from "../../app-linq-work/components/Loader.vue";
import ReviewSubmitted from "../components/ReviewSubmitted.vue";

export default {
  name: "ReviewForm",
  components: {
    CompanySearch: () => import("../components/SearchDropdown.vue"),
    FullScreenLoader,
    ReviewSubmitted
  },
  data() {
    return {
      rating: 0,
      reviewData: {
        company: "",
        title: "",
        content: "",
        verificationId: "",
      },
      selectedCompanyLogo: "", // Store company logo
      submitted: false,
      isSubmitting: false,
      errorMessage: "",
    };
  },
  methods: {
    handleCompanySelected(company) {
      // Store both the company ID and logo when a company is selected
      this.reviewData.verificationId = company.id;
      this.selectedCompanyLogo = company.logo || "";
      console.log('Company selected:', company);
    },

    async submitReview() {
      // Validation
      if (this.rating === 0) {
        this.errorMessage = "Please select a rating";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
        return;
      }

      if (!this.reviewData.verificationId) {
        this.errorMessage = "Please select a company";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
        return;
      }

      // Prepare payload matching API structure
      const payload = {
        description: this.reviewData.content,
        overAllratings: this.rating.toString(),
        title: this.reviewData.title,
        verificationId: this.reviewData.verificationId,
      };

      this.isSubmitting = true;
      this.errorMessage = "";

      try {
        // Call the API
        const response = await createReview(payload);
        
        console.log("Review created successfully:", response.data);
        
        // Show success component
        this.submitted = true;

      } catch (error) {
        console.error("Error submitting review:", error);
        
        // Show error message
        this.errorMessage = error.response?.data?.message || "Failed to submit review. Please try again.";
        
        // Clear error after 5 seconds
        setTimeout(() => {
          this.errorMessage = "";
        }, 5000);
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.rating = 0;
      this.reviewData = {
        company: "",
        title: "",
        content: "",
        verificationId: "",
      };
      this.selectedCompanyLogo = "";
      this.submitted = false;
      this.errorMessage = "";
    },

    navigateToSearch() {
      // Navigate to search reviews page
      // Update this route based on your router setup
      this.$router.push('/'); // or whatever your search/browse page route is
    }
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-size: 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
}

.review-container {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1.875rem;
  margin-bottom: 1.875rem;
}

.header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
}

.form-tagline {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #000;
}

.form-textarea {
  resize: vertical;
  min-height: 7.5rem;
}

.rating-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.star-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.star-button:hover,
.star-button.active {
  color: #FFD700;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 10px 20px;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #4caf50;
  color: white;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #efe;
  color: #3c3;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form fields container */
.form-fields-container {
  margin-top: 1rem;
}

/* Slide up animation for form fields */
.form-field-slide {
  animation: slideUpFade 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
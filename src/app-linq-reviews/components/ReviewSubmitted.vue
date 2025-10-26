<template>
  <div class="container-success">
    <div class="review-container">
      <div class="header">
        <div class="success-icon">✓</div>
        <h1 class="form-title">Review Submitted Successfully!</h1>
        <p class="form-tagline">Thank you for sharing your experience</p>
      </div>

      <div class="company-info">
        <img 
          v-if="companyLogo" 
          :src="companyLogo" 
          :alt="companyName"
          class="company-logo"
        />
        <div class="company-details">
          <p class="company-label">Your review for</p>
          <h2 class="company-name">{{ companyName }}</h2>
          <p class="submission-text">has been submitted</p>
        </div>
      </div>

      <div class="button-group">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="handleWriteAnother"
        >
          Write Another Review
        </button>
        <button 
          type="button" 
          class="btn btn-primary"
          @click="handleSearchReviews"
        >
          Search Reviews
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReviewSubmitted",
  props: {
    companyName: {
      type: String,
      required: true
    },
    companyLogo: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleWriteAnother() {
      this.$emit('write-another');
    },
    handleSearchReviews() {
      this.$emit('search-reviews');
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  /* max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem; */
}

.review-container {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1.875rem;
  margin-bottom: 1.875rem;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1rem;
  font-weight: bold;
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

.company-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.company-logo {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 0.5rem;
}

.company-details {
  flex: 1;
}

.company-label {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 0.25rem 0;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.25rem 0;
}

.submission-text {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 12px 24px;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
  min-width: 180px;
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

/* Responsive design */
@media (max-width: 640px) {
  .company-info {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
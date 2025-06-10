<template>
  <div class="review-container">
    <Header />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <!-- Header -->
          <div class="header-section">
            <h1>Write a Review</h1>
            <p>Share your experience to help others make informed decisions</p>
          </div>

          <div class="stats-image">
            <img src="./LovingDoodle.png" alt="Stats Illustration" />
          </div>

          <!-- Form -->
          <div class="review-form">
            <!-- Company Name -->
            <div class="form-group">
              <label class="form-label">Company Name *</label>
              <input v-model="formData.companyName" type="text" class="form-control" placeholder="Enter company name" />
            </div>

            <!-- Rating -->
            <div class="form-group">
              <label class="form-label">Overall Rating *</label>
              <div class="rating-section">
                <div class="stars-container">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :size="24"
                    :class="['star', i <= (hoveredRating || formData.rating) ? 'star-filled' : 'star-empty']"
                    @click="setRating(i)"
                    @mouseenter="hoveredRating = i"
                    @mouseleave="hoveredRating = 0"
                  />
                </div>
                <span v-if="formData.rating > 0" class="rating-text">
                  {{ getRatingText(formData.rating) }}
                </span>
              </div>
            </div>

            <!-- Review Title -->
            <div class="form-group">
              <label class="form-label">Review Title *</label>
              <input
                v-model="formData.title"
                type="text"
                class="form-control"
                placeholder="Summarize your experience"
                maxlength="100"
              />
              <div class="char-count">{{ formData.title.length }}/100</div>
            </div>

            <!-- Review Content -->
            <div class="form-group">
              <label class="form-label">Your Review *</label>
              <textarea
                v-model="formData.review"
                class="form-control textarea-large"
                placeholder="Share your detailed experience..."
                rows="6"
                maxlength="1000"
              ></textarea>
              <div class="char-count">{{ formData.review.length }}/1000</div>
            </div>

            <!-- Reviewer Info -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Your Name *</label>
                  <input
                    v-model="formData.reviewerName"
                    type="text"
                    class="form-control"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input v-model="formData.email" type="email" class="form-control" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            <!-- Recommendation -->
            <div class="form-group">
              <label class="form-label">Would you recommend this company?</label>
              <div class="recommendation-options">
                <div class="recommendation-card">
                  <input
                    v-model="formData.wouldRecommend"
                    type="radio"
                    name="recommendation"
                    value="yes"
                    class="form-check-input"
                    id="recommend-yes"
                  />
                  <label class="recommendation-label" for="recommend-yes"> Yes, I would recommend </label>
                </div>
                <div class="recommendation-card">
                  <input
                    v-model="formData.wouldRecommend"
                    type="radio"
                    name="recommendation"
                    value="no"
                    class="form-check-input"
                    id="recommend-no"
                  />
                  <label class="recommendation-label" for="recommend-no"> No, I would not recommend </label>
                </div>
                <div class="recommendation-card">
                  <input
                    v-model="formData.wouldRecommend"
                    type="radio"
                    name="recommendation"
                    value="neutral"
                    class="form-check-input"
                    id="recommend-neutral"
                  />
                  <label class="recommendation-label" for="recommend-neutral"> I'm neutral </label>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="submit-section">
              <button
                @click="handleSubmit"
                :disabled="!isFormValid"
                class="btn btn-submit"
                :class="{ 'btn-disabled': !isFormValid }"
              >
                Submit Review
              </button>
              <div class="submit-note">Your review will be published after verification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Star } from "lucide-vue";
import Header from "./Header.vue";

export default {
  name: "ModernReviewForm",
  components: {
    Star,
    Header,
  },
  data() {
    return {
      hoveredRating: 0,
      formData: {
        companyName: "",
        rating: 0,
        title: "",
        review: "",
        reviewerName: "",
        email: "",
        wouldRecommend: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.companyName &&
        this.formData.rating > 0 &&
        this.formData.title &&
        this.formData.review &&
        this.formData.reviewerName &&
        this.formData.email
      );
    },
  },
  methods: {
    setRating(rating) {
      this.formData.rating = rating;
    },
    getRatingText(rating) {
      const texts = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent",
      };
      return texts[rating] || "";
    },
    handleSubmit() {
      if (this.isFormValid) {
        console.log("Review submitted:", this.formData);
        alert("Review submitted successfully!");
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
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

/* Remove Bootstrap blue glow/outline from all form controls */
.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000; /* Your custom border color */
}

/* Remove glow from textareas specifically */
textarea.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

/* Remove glow from input elements */
input.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

/* Remove glow from select elements */
select.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

/* Alternative: Remove all focus effects globally */
*:focus {
  box-shadow: none !important;
  outline: none !important;
}

/* Or target Bootstrap's specific box-shadow */
.form-control:focus {
  box-shadow: 0 0 0 0 transparent !important;
}

.review-container {
  min-height: 100vh;
  background: #fff;
  padding: 0px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.container{
  margin-top: 60px
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

.review-form {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 40px;
  transition: border-color 0.2s ease;
}

.review-form:hover {
  /* border-color: #000000; */
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-size: 16px;
  text-align: left;
}

.form-control {
  width: 100%;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  transition: border-color 0.2s ease;
  background: #fff;
  font-weight: 400;
  color: #1a1a1a;
  font-family: inherit;
}

.form-control:focus {
  border-color: #000000;
  outline: none;
}

.form-control::placeholder {
  color: #666;
  font-weight: 400;
}

.textarea-large {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.stars-container {
  display: flex;
  gap: 4px;
}

.star {
  cursor: pointer;
  transition: all 0.2s ease;
}

.star:hover {
  transform: scale(1.1);
}

.star-filled {
  color: #000;
  fill: #000;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

.star-empty {
  color: #d1d5db;
  transition: color 0.2s ease;
}

.star-empty:hover {
  color: #9ca3af;
}

.rating-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
  padding: 6px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.char-count {
  color: #666;
  font-size: 13px;
  text-align: right;
  margin-top: 6px;
  font-weight: 500;
}

.recommendation-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.recommendation-card {
  position: relative;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  transition: border-color 0.2s ease;
  background: #fff;
  cursor: pointer;
}

.recommendation-card:hover {
  border-color: #000000;
}

.recommendation-card:has(input:checked) {
  border-color: #000000;
  background: #f8f9fa;
}

.form-check-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.recommendation-label {
  display: block;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  margin: 0;
  font-size: 15px;
  text-align: left;
}

.submit-section {
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e5e5e5;
  text-align: left;
}

.btn-submit {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-submit:hover:not(.btn-disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.btn-submit:active:not(.btn-disabled) {
  transform: translateY(0);
}

.btn-disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  color: #9ca3af;
}

.submit-note {
  color: #6b7280;
  font-size: 13px;
  margin-top: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .review-container {
    padding: 30px 0;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }

  .review-form {
    padding: 28px;
    border-radius: 8px;
  }

  .rating-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .recommendation-options {
    grid-template-columns: 1fr;
  }

  .btn-submit {
    width: 100%;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .review-form {
    padding: 24px;
  }

  .header-section h1 {
    font-size: 1.5rem;
  }
}
</style>

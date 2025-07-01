<template>
  <div class="post-ad-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <!-- Header -->
          <div class="header-section">
            <h1>Post Your Ad</h1>
            <p>Reach more customers and grow your business</p>
          </div>

          <div class="stats-image">
            <img src="../assets/images/doodle-self.png" alt="Post Ad Illustration" />
          </div>

          <!-- Form -->
          <div class="post-ad-form">
            <!-- Business Information Section -->
            <div class="section-header">
              <h3>Business Information</h3>
              <p>Tell us about your business</p>
            </div>

            <!-- Business Name -->
            <div class="form-group">
              <label class="form-label">Business Name *</label>
              <input 
                v-model="formData.businessName" 
                type="text" 
                class="form-control" 
                placeholder="Enter your business name" 
              />
            </div>

            <!-- Category and Business Type Row -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Category *</label>
                  <select v-model="formData.category" class="form-control">
                    <option value="">Select a category</option>
                    <option value="restaurant">Restaurant & Food</option>
                    <option value="retail">Retail & Shopping</option>
                    <option value="services">Professional Services</option>
                    <option value="health">Health & Wellness</option>
                    <option value="automotive">Automotive</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="home">Home & Garden</option>
                    <option value="education">Education & Training</option>
                    <option value="entertainment">Entertainment & Events</option>
                    <option value="technology">Technology</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Business Type *</label>
                  <select v-model="formData.businessType" class="form-control">
                    <option value="">Select business type</option>
                    <option value="local">Local Business</option>
                    <option value="franchise">Franchise</option>
                    <option value="chain">Chain Store</option>
                    <option value="online">Online Business</option>
                    <option value="service">Service Provider</option>
                    <option value="nonprofit">Non-Profit</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Business Description -->
            <div class="form-group">
              <label class="form-label">Business Description *</label>
              <textarea
                v-model="formData.businessDescription"
                class="form-control textarea-large"
                placeholder="Describe your business, services, and what makes you unique..."
                rows="4"
                maxlength="500"
              ></textarea>
              <div class="char-count">{{ formData.businessDescription.length }}/500</div>
            </div>

            <!-- Contact Information Section -->
            <div class="section-header">
              <h3>Contact Information</h3>
              <p>How customers can reach you</p>
            </div>

            <!-- Email and Phone Row -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="business@example.com"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="form-control"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <!-- Website -->
            <div class="form-group">
              <label class="form-label">Website</label>
              <input
                v-model="formData.website"
                type="url"
                class="form-control"
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <!-- Business Address -->
            <div class="form-group">
              <label class="form-label">Business Address *</label>
              <textarea
                v-model="formData.address"
                class="form-control"
                placeholder="Enter your complete business address..."
                rows="3"
              ></textarea>
            </div>

            <!-- Ad Details Section -->
            <div class="section-header">
              <h3>Ad Details</h3>
              <p>Create your promotional content</p>
            </div>

            <!-- Ad Title -->
            <div class="form-group">
              <label class="form-label">Ad Title *</label>
              <input
                v-model="formData.adTitle"
                type="text"
                class="form-control"
                placeholder="Create an eye-catching title for your ad"
                maxlength="80"
              />
              <div class="char-count">{{ formData.adTitle.length }}/80</div>
            </div>

            <!-- Special Offer -->
            <div class="form-group">
              <label class="form-label">Special Offer or Promotion *</label>
              <textarea
                v-model="formData.specialOffer"
                class="form-control textarea-large"
                placeholder="Describe your special offer, discount, or promotion..."
                rows="4"
                maxlength="300"
              ></textarea>
              <div class="char-count">{{ formData.specialOffer.length }}/300</div>
            </div>

            <!-- Ad Duration -->
            <div class="form-group">
              <label class="form-label">Ad Duration</label>
              <div class="duration-options">
                <div class="duration-card">
                  <input
                    v-model="formData.duration"
                    type="radio"
                    name="duration"
                    value="7"
                    class="form-check-input"
                    id="duration-7"
                  />
                  <label class="duration-label" for="duration-7">
                    <div class="duration-title">7 Days</div>
                    <div class="duration-price">Free</div>
                  </label>
                </div>
                <div class="duration-card">
                  <input
                    v-model="formData.duration"
                    type="radio"
                    name="duration"
                    value="30"
                    class="form-check-input"
                    id="duration-30"
                  />
                  <label class="duration-label" for="duration-30">
                    <div class="duration-title">30 Days</div>
                    <div class="duration-price">$19.99</div>
                  </label>
                </div>
                <div class="duration-card">
                  <input
                    v-model="formData.duration"
                    type="radio"
                    name="duration"
                    value="90"
                    class="form-check-input"
                    id="duration-90"
                  />
                  <label class="duration-label" for="duration-90">
                    <div class="duration-title">90 Days</div>
                    <div class="duration-price">$49.99</div>
                  </label>
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
                Post My Ad
              </button>
              <div class="submit-note">Your ad will be reviewed and published within 24 hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostAdForm",
  data() {
    return {
      formData: {
        businessName: "",
        category: "",
        businessType: "",
        businessDescription: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        adTitle: "",
        specialOffer: "",
        duration: "7"
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.businessName &&
        this.formData.category &&
        this.formData.businessType &&
        this.formData.businessDescription &&
        this.formData.email &&
        this.formData.phone &&
        this.formData.address &&
        this.formData.adTitle &&
        this.formData.specialOffer
      );
    },
  },
  methods: {
    handleSubmit() {
      if (this.isFormValid) {
        console.log("Ad submitted:", this.formData);
        alert("Ad posted successfully! It will be reviewed within 24 hours.");
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
  border-color: #000000;
}

textarea.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

input.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

select.form-control:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #000000;
}

*:focus {
  box-shadow: none !important;
  outline: none !important;
}

.post-ad-container {
  min-height: 100vh;
  background: #fff;
  padding: 0px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.container {
  margin-top: 60px;
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

.post-ad-form {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 40px;
  transition: border-color 0.2s ease;
}

.section-header {
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.section-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 400;
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

select.form-control {
  cursor: pointer;
}

.char-count {
  color: #666;
  font-size: 13px;
  text-align: right;
  margin-top: 6px;
  font-weight: 500;
}

.duration-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.duration-card {
  position: relative;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px 16px;
  transition: border-color 0.2s ease;
  background: #fff;
  cursor: pointer;
  text-align: center;
}

.duration-card:hover {
  border-color: #000000;
}

.duration-card:has(input:checked) {
  border-color: #000000;
  background: #f8f9fa;
}

.form-check-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.duration-label {
  display: block;
  cursor: pointer;
  margin: 0;
}

.duration-title {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
  margin-bottom: 4px;
}

.duration-price {
  font-weight: 700;
  color: #000;
  font-size: 18px;
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
  .post-ad-container {
    padding: 30px 0;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }

  .post-ad-form {
    padding: 28px;
    border-radius: 8px;
  }

  .duration-options {
    grid-template-columns: 1fr;
  }

  .btn-submit {
    width: 100%;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .post-ad-form {
    padding: 24px;
  }

  .header-section h1 {
    font-size: 1.5rem;
  }

  .section-header h3 {
    font-size: 1.1rem;
  }
}
</style>
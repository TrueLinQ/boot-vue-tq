<template>
  <div class="company-profile-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <!-- Header -->
          <div class="header-section">
            <h1>Create Company Profile</h1>
            <p>Build your professional business presence</p>
          </div>

          <div class="stats-image">
            <img src="../assets/images/chilling-doodle.png" alt="Company Profile Illustration" />
          </div>

          <!-- Form -->
          <div class="company-profile-form">
            <!-- Basic Information Section -->
            <div class="section-header">
              <h3>Basic Information</h3>
              <p>Essential details about your company</p>
            </div>

            <!-- Company Name -->
            <div class="form-group">
              <label class="form-label">Company Name *</label>
              <input 
                v-model="formData.companyName" 
                type="text" 
                class="form-control" 
                placeholder="Enter your company name" 
              />
            </div>

            <!-- Website URL -->
            <div class="form-group">
              <label class="form-label">Website URL *</label>
              <input
                v-model="formData.websiteUrl"
                type="url"
                class="form-control"
                placeholder="https://www.yourcompany.com"
              />
            </div>

            <!-- Business Email -->
            <div class="form-group">
              <label class="form-label">Business Email *</label>
              <input
                v-model="formData.businessEmail"
                type="email"
                class="form-control"
                placeholder="info@yourcompany.com"
              />
            </div>

            <!-- Primary Category and Sub Category Row -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Primary Category *</label>
                  <select v-model="formData.primaryCategory" @change="onPrimaryCategoryChange" class="form-control">
                    <option value="">Select primary category</option>
                    <option value="electronics">Electronics & Technology</option>
                    <option value="shopping">Shopping & Fashion</option>
                    <option value="travel">Travel & Vacation</option>
                    <option value="health">Health & Medical</option>
                    <option value="business">Business Services</option>
                    <option value="finance">Money & Insurance</option>
                    <option value="food">Food & Dining</option>
                    <option value="home">Home & Garden</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Sub Category *</label>
                  <select v-model="formData.subCategory" class="form-control" :disabled="!formData.primaryCategory">
                    <option value="" v-if="!formData.primaryCategory">First select a primary category</option>
                    <option value="" v-else>Select sub category</option>
                    <option v-for="subCat in availableSubCategories" :key="subCat.value" :value="subCat.value">
                      {{ subCat.label }}
                    </option>
                  </select>
                  <div v-if="!formData.primaryCategory" class="form-help-text">
                    Please select a primary category first to see sub-categories
                  </div>
                </div>
              </div>
            </div>

            <!-- Company Description -->
            <div class="form-group">
              <label class="form-label">Company Description *</label>
              <textarea
                v-model="formData.companyDescription"
                class="form-control textarea-large"
                placeholder="Describe your company, mission, values, and what sets you apart..."
                rows="6"
                maxlength="2000"
              ></textarea>
              <div class="char-count">{{ formData.companyDescription.length }}/2000</div>
            </div>

            <!-- Contact Information Section -->
            <div class="section-header">
              <h3>Contact Information</h3>
              <p>How customers can reach your business</p>
            </div>

            <!-- Business Address -->
            <div class="form-group">
              <label class="form-label">Business Address</label>
              <textarea
                v-model="formData.businessAddress"
                class="form-control"
                placeholder="Enter your complete business address including city, state, and postal code..."
                rows="3"
              ></textarea>
            </div>

            <!-- Phone Number -->
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input
                v-model="formData.phoneNumber"
                type="tel"
                class="form-control"
                placeholder="(555) 123-4567"
              />
            </div>

            <!-- Company Details Section -->
            <div class="section-header">
              <h3>Company Details</h3>
              <p>Additional information about your organization</p>
            </div>

            <!-- Company Size and Founded Year Row -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Company Size *</label>
                  <select v-model="formData.companySize" class="form-control">
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Founded Year</label>
                  <input
                    v-model="formData.foundedYear"
                    type="number"
                    class="form-control"
                    placeholder="2020"
                    min="1800"
                    :max="currentYear"
                  />
                </div>
              </div>
            </div>

            <!-- Company Logo -->
            <div class="form-group">
              <label class="form-label">Company Logo</label>
              <div class="logo-upload-section">
                <div class="logo-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                  <div v-if="!logoPreview" class="upload-placeholder">
                    <div class="upload-icon">📁</div>
                    <div class="upload-text">
                      <strong>Click to upload</strong> or drag and drop
                    </div>
                    <div class="upload-subtext">PNG, JPG, GIF up to 5MB</div>
                  </div>
                  <div v-else class="logo-preview">
                    <img :src="logoPreview" alt="Company Logo Preview" />
                    <button type="button" @click.stop="removeLogo" class="remove-logo-btn">×</button>
                  </div>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  style="display: none;"
                />
              </div>
            </div>

            <!-- Social Media Section -->
            <div class="section-header">
              <h3>Social Media Links (optional)</h3>
              <p>Connect your social media profiles</p>
            </div>

            <!-- LinkedIn -->
            <div class="form-group">
              <label class="form-label">LinkedIn</label>
              <input
                v-model="formData.socialMedia.linkedin"
                type="url"
                class="form-control"
                placeholder="https://www.linkedin.com/company/yourcompany"
              />
            </div>

            <!-- Twitter -->
            <div class="form-group">
              <label class="form-label">Twitter</label>
              <input
                v-model="formData.socialMedia.twitter"
                type="url"
                class="form-control"
                placeholder="https://twitter.com/yourcompany"
              />
            </div>

            <!-- Facebook -->
            <div class="form-group">
              <label class="form-label">Facebook</label>
              <input
                v-model="formData.socialMedia.facebook"
                type="url"
                class="form-control"
                placeholder="https://www.facebook.com/yourcompany"
              />
            </div>

            <!-- Submit Button -->
            <div class="submit-section">
              <button
                @click="handleSubmit"
                :disabled="!isFormValid"
                class="btn btn-submit"
                :class="{ 'btn-disabled': !isFormValid }"
              >
                Create Company Profile
              </button>
              <div class="submit-note">Your profile will be reviewed and published within 24 hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyProfileForm",
  data() {
    return {
      logoPreview: null,
      currentYear: new Date().getFullYear(),
      formData: {
        companyName: "",
        websiteUrl: "",
        businessEmail: "",
        primaryCategory: "",
        subCategory: "",
        companyDescription: "",
        businessAddress: "",
        phoneNumber: "",
        companySize: "",
        foundedYear: "",
        companyLogo: null,
        socialMedia: {
          linkedin: "",
          twitter: "",
          facebook: ""
        }
      },
      subCategories: {
        electronics: [
          { value: "software", label: "Software Development" },
          { value: "hardware", label: "Hardware & Components" },
          { value: "mobile", label: "Mobile & Apps" },
          { value: "web", label: "Web Development" },
          { value: "it-services", label: "IT Services" },
          { value: "cybersecurity", label: "Cybersecurity" }
        ],
        shopping: [
          { value: "clothing", label: "Clothing & Apparel" },
          { value: "accessories", label: "Accessories" },
          { value: "footwear", label: "Footwear" },
          { value: "jewelry", label: "Jewelry & Watches" },
          { value: "bags", label: "Bags & Luggage" },
          { value: "beauty", label: "Beauty & Cosmetics" }
        ],
        travel: [
          { value: "hotels", label: "Hotels & Accommodation" },
          { value: "flights", label: "Flights & Airlines" },
          { value: "tours", label: "Tours & Activities" },
          { value: "car-rental", label: "Car Rental" },
          { value: "cruises", label: "Cruises" },
          { value: "travel-agency", label: "Travel Agency" }
        ],
        health: [
          { value: "hospitals", label: "Hospitals & Clinics" },
          { value: "pharmacy", label: "Pharmacy" },
          { value: "dental", label: "Dental Care" },
          { value: "mental-health", label: "Mental Health" },
          { value: "fitness", label: "Fitness & Wellness" },
          { value: "medical-equipment", label: "Medical Equipment" }
        ],
        business: [
          { value: "consulting", label: "Consulting" },
          { value: "accounting", label: "Accounting & Finance" },
          { value: "legal", label: "Legal Services" },
          { value: "marketing", label: "Marketing & Advertising" },
          { value: "hr", label: "Human Resources" },
          { value: "real-estate", label: "Real Estate" }
        ],
        finance: [
          { value: "banking", label: "Banking" },
          { value: "insurance", label: "Insurance" },
          { value: "investment", label: "Investment Services" },
          { value: "loans", label: "Loans & Mortgages" },
          { value: "accounting", label: "Accounting Services" },
          { value: "financial-planning", label: "Financial Planning" }
        ],
        food: [
          { value: "restaurants", label: "Restaurants" },
          { value: "fast-food", label: "Fast Food" },
          { value: "catering", label: "Catering Services" },
          { value: "cafes", label: "Cafes & Coffee Shops" },
          { value: "food-delivery", label: "Food Delivery" },
          { value: "grocery", label: "Grocery & Supermarkets" }
        ],
        home: [
          { value: "furniture", label: "Furniture" },
          { value: "appliances", label: "Home Appliances" },
          { value: "decor", label: "Home Decor" },
          { value: "gardening", label: "Gardening & Landscaping" },
          { value: "renovation", label: "Home Renovation" },
          { value: "cleaning", label: "Cleaning Services" }
        ]
      }
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.companyName &&
        this.formData.websiteUrl &&
        this.formData.businessEmail &&
        this.formData.primaryCategory &&
        this.formData.subCategory &&
        this.formData.companyDescription &&
        this.formData.companySize
      );
    },
    availableSubCategories() {
      return this.subCategories[this.formData.primaryCategory] || [];
    }
  },
  methods: {
    onPrimaryCategoryChange() {
      this.formData.subCategory = "";
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      this.processFile(file);
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    },
    processFile(file) {
      if (file && file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          this.formData.companyLogo = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.logoPreview = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          alert('File size must be less than 5MB');
        }
      } else {
        alert('Please select a valid image file');
      }
    },
    removeLogo() {
      this.formData.companyLogo = null;
      this.logoPreview = null;
      this.$refs.fileInput.value = '';
    },
    handleSubmit() {
      if (this.isFormValid) {
        console.log("Company profile submitted:", this.formData);
        alert("Company profile created successfully!");
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

.company-profile-container {
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

.company-profile-form {
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

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #6c757d;
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

.form-help-text {
  color: #666;
  font-size: 13px;
  margin-top: 6px;
  font-style: italic;
}

.logo-upload-section {
  margin-top: 8px;
}

.logo-upload-area {
  border: 2px dashed #e5e5e5;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #fafafa;
}

.logo-upload-area:hover {
  border-color: #000000;
  background: #f5f5f5;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 32px;
  opacity: 0.6;
}

.upload-text {
  font-size: 16px;
  color: #1a1a1a;
}

.upload-subtext {
  font-size: 14px;
  color: #666;
}

.logo-preview {
  position: relative;
  display: inline-block;
}

.logo-preview img {
  max-width: 200px;
  max-height: 120px;
  object-fit: contain;
  border-radius: 4px;
}

.remove-logo-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.remove-logo-btn:hover {
  background: #cc0000;
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
  .company-profile-container {
    padding: 30px 0;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }

  .company-profile-form {
    padding: 28px;
    border-radius: 8px;
  }

  .btn-submit {
    width: 100%;
    padding: 16px;
  }

  .logo-upload-area {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .company-profile-form {
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
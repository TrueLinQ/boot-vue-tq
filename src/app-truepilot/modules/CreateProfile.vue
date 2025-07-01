<template>
  <div class="profile-creation">
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (step / 6) * 100 + '%' }"></div>
      </div>
      <div class="progress-text">Step {{ step }} of 6</div>
    </div>

    <div v-if="step === 1" class="card welcome-card">
      <div class="card-header">
        <h2>🚀 Ready to Get Started?</h2>
      </div>
      <div class="card-body">
        <p class="description">
          Create your professional profile in just a few simple steps. Connect with customers and grow your business on
          our platform.
        </p>
        <div class="features-list">
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span>Get verified with WhatsApp</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span>Showcase your expertise</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span>Control your visibility</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span>Connect with customers</span>
          </div>
        </div>
        <button class="btn btn-primary" @click="proceedToPhoneNumber">Get Started</button>
      </div>
    </div>

    <div v-if="step === 2" class="card">
      <div class="card-header">
        <h2>📱 Enter Your WhatsApp Number</h2>
      </div>
      <div class="card-body">
        <p class="description">We'll send you a verification code to confirm your number</p>
        <div class="input-group">
          <label>WhatsApp Number</label>
          <div class="phone-input-container">
            <select v-model="countryCode" class="country-select" :disabled="isPhoneNumberReadonly">
              <option value="+1">🇺🇸 +1</option>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              v-model="phoneNumber"
              :placeholder="getPhonePlaceholder()"
              class="form-input phone-input"
              @input="validatePhoneNumber"
              :readonly="isPhoneNumberReadonly"
            />
          </div>
          <div
            v-if="phoneValidationMessage"
            class="validation-message"
            :class="{ valid: isPhoneValid, invalid: !isPhoneValid }"
          >
            {{ phoneValidationMessage }}
          </div>
          <div v-if="verificationError" class="error-message">
            {{ verificationError }}
          </div>
        </div>
        <button
          class="btn btn-primary"
          @click="verifyNumber"
          :disabled="!isPhoneValid || isVerifying"
          v-if="!isPhoneNumberVerified"
        >
          {{ isVerifying ? "Opening verification..." : "Verify Number" }}
        </button>
        <button class="btn btn-success" @click="proceedAfterManualVerification" v-else>
          Proceed with Verified Number
        </button>
      </div>
    </div>

    <div v-if="step === 3" class="card verification-card">
      <div class="card-header">
        <h2>🔗 Complete Verification in New Tab</h2>
      </div>
      <div class="card-body text-center">
        <div class="loading-spinner"></div>
        <p class="description">
          A new tab has opened (or will open) to complete your WhatsApp verification on TrueLinq.
        </p>
        <p class="verification-note">
          Please follow the instructions in the new tab. Once you have completed the verification and any required
          login/registration on TrueLinq's site, **return to this tab** to continue setting up your profile.
        </p>
        <button class="btn btn-primary mt-4" @click="proceedAfterManualVerification">
          I have completed verification on TrueLinq
        </button>
      </div>
    </div>

    <div v-if="step === 4" class="card">
      <div class="card-header">
        <h2>💼 Professional Expertise</h2>
      </div>
      <div class="card-body">
        <p class="description">Tell us about your professional background and services</p>
        <form @submit.prevent="proceedToVisibility" class="form">
          <div class="input-group">
            <label>Business Name *</label>
            <input
              type="text"
              v-model="businessName"
              placeholder="e.g., Tech Solutions Pro"
              class="form-input"
              required
            />
          </div>

          <div class="input-group">
            <label>Work Title *</label>
            <input
              type="text"
              v-model="workTitle"
              placeholder="e.g., Senior Web Developer"
              class="form-input"
              required
            />
          </div>

          <div class="input-group">
            <label>Business Description *</label>
            <textarea
              v-model="businessDescription"
              placeholder="Describe your business and what services you offer..."
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="input-group">
            <label>Personal Description *</label>
            <textarea
              v-model="description"
              placeholder="Tell customers about your expertise and background..."
              class="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="input-group">
            <label>Service Address *</label>
            <input
              type="text"
              v-model="address"
              placeholder="e.g., New York, NY or Remote"
              class="form-input"
              required
            />
          </div>

          <div class="input-group">
            <label>Profession Category *</label>
            <select v-model="professionCategory" class="form-select" required @change="onCategoryChange">
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="design">Design & Creative</option>
            </select>
          </div>

          <div class="input-group" v-if="professionCategory && subCategories.length > 0">
            <label>Sub Category *</label>
            <select v-model="professionSubCategory" class="form-select" required>
              <option value="">Select a sub category</option>
              <option v-for="subCat in subCategories" :key="subCat" :value="subCat">{{ subCat }}</option>
            </select>
          </div>

          <div class="location-section">
            <!-- <p class="location-note">📍 We'll automatically detect your location for better service visibility</p> -->
            <div v-if="locationError" class="error-message">
              {{ locationError }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Continue</button>
        </form>
      </div>
    </div>

    <div v-if="step === 5" class="card">
      <div class="card-header">
        <h2>👁️ Profile Visibility</h2>
      </div>
      <div class="card-body">
        <p class="description">Choose how you want your profile to be visible to others</p>

        <div class="visibility-options">
          <div class="visibility-option" :class="{ active: profileVisibility === 'public' }">
            <input type="radio" id="public" value="public" v-model="profileVisibility" class="radio-input" />
            <label for="public" class="visibility-label">
              <div class="visibility-header">
                <span class="visibility-icon">🌍</span>
                <h3>Public Profile</h3>
              </div>
              <p class="visibility-description">
                Your profile will be visible to everyone. Customers can find you through search and browse features.
              </p>
              <div class="visibility-features">
                <span class="feature-tag">✓ Search visibility</span>
                <span class="feature-tag">✓ Direct bookings</span>
                <span class="feature-tag">✓ Reviews & ratings</span>
              </div>
            </label>
          </div>

          <div class="visibility-option" :class="{ active: profileVisibility === 'private' }">
            <input type="radio" id="private" value="private" v-model="profileVisibility" class="radio-input" />
            <label for="private" class="visibility-label">
              <div class="visibility-header">
                <span class="visibility-icon">🔒</span>
                <h3>Private Profile</h3>
              </div>
              <p class="visibility-description">
                Your profile will only be visible to people you share your profile link with directly.
              </p>
              <div class="visibility-features">
                <span class="feature-tag">✓ Link sharing only</span>
                <span class="feature-tag">✓ Controlled access</span>
                <span class="feature-tag">✓ Privacy protection</span>
              </div>
            </label>
          </div>
        </div>

        <div v-if="profileCreationError" class="error-message">
          {{ profileCreationError }}
          <button v-if="showReverifyButton" class="btn btn-sm btn-outline-warning mt-2" @click="reverifyWhatsApp">
            Re-verify WhatsApp Number
          </button>
        </div>

        <button class="btn btn-success" @click="completeProfile" :disabled="isCreatingProfile">
          {{ isCreatingProfile ? "Saving Profile..." : "Save Profile" }}
        </button>
      </div>
    </div>

    <div v-if="step === 6" class="card success-card">
      <div class="card-header success-header">
        <h2>🎉 Profile {{ isExistingProfile ? "Updated" : "Created" }} Successfully!</h2>
      </div>
      <div class="card-body success-body">
        <div class="success-animation">
          <div class="checkmark-circle">
            <div class="checkmark"></div>
          </div>
        </div>

        <h3 class="success-title">Welcome to Our Platform!</h3>
        <p class="success-description">
          Your professional profile has been {{ isExistingProfile ? "updated" : "created" }} and is now ready to connect
          you with potential customers.
        </p>

        <div class="success-stats">
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Profile Visibility</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100+</div>
            <div class="stat-label">Daily Searches</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5⭐</div>
            <div class="stat-label">Rating System</div>
          </div>
        </div>

        <div class="next-steps">
          <h4>What's Next?</h4>
          <div class="steps-list">
            <div class="step-item">
              <span class="step-icon">📸</span>
              <span>Add profile photos to increase trust</span>
            </div>
            <div class="step-item">
              <span class="step-icon">📝</span>
              <span>Complete your portfolio with work samples</span>
            </div>
            <div class="step-item">
              <span class="step-icon">💬</span>
              <span>Start receiving customer inquiries</span>
            </div>
          </div>
        </div>

        <div class="success-actions">
          <button class="btn btn-primary" @click="goToDashboard">Go to Dashboard</button>
          <button class="btn btn-secondary" @click="shareProfile">Share Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "./CreateApi"; // Assuming ApiService is in CreateApi.js

export default {
  name: "ProfileCreation",
  data() {
    return {
      step: 1,
      isGoogleSignedIn: false, // Simulating authentication state
      currentUserId: "user123", // Example user ID for signed-in flow

      countryCode: "+91",
      phoneNumber: "",
      isPhoneValid: false,
      phoneValidationMessage: "",
      verificationError: "",
      isVerifying: false,
      isPhoneNumberReadonly: false,
      isPhoneNumberVerified: false, // Tracks if phone is considered verified for this session

      // Profile data
      businessName: "",
      workTitle: "",
      businessDescription: "",
      description: "",
      address: "",
      professionCategory: "",
      professionSubCategory: "",
      profileVisibility: "public",

      // Location data
      latitude: "",
      longitude: "",
      locationError: "",

      // API states
      isCreatingProfile: false,
      profileCreationError: "",
      showReverifyButton: false, // Controls visibility of re-verify button
      isExistingProfile: false, // Flag to indicate if we're updating an existing profile

      subCategories: [],
    };
  },
  computed: {
    categorySubCategories() {
      return {
        technology: ["Web Development", "Mobile App Development", "Software Consulting"],
        design: ["Graphic Design", "Web Design", "UI/UX Design"],
        // Add more as needed
      };
    },

    fullPhoneNumber() {
      // Ensure phoneNumber is clean before concatenating
      const cleanNumber = this.phoneNumber.replace(/[^\d]/g, "");
      return this.countryCode + cleanNumber;
    },
  },
  async mounted() {
    // Check if the user was redirected from TrueLinq after verification
    // This is primarily for non-authenticated users completing verification
    const wasRedirected = ApiService.checkAndHandleTrueLinqRedirect();

    if (this.isGoogleSignedIn) {
      // Authenticated user flow
      console.log("Authenticated user detected. Initiating profile fetch.");
      this.step = 2; // Start at phone number step for authenticated users
      await this.handleAuthenticatedUserFlow(wasRedirected);
    } else if (wasRedirected) {
      // Non-authenticated user, successfully redirected from TrueLinq verification
      // This implies their WhatsApp number might be verified *with TrueLinq*,
      // but we need to ensure our app knows which number that was.
      // For a robust solution, the phoneNumber used for verification should be stored
      // in localStorage before the redirect, and retrieved here.
      // For this example, we'll assume the user might need to re-enter or it's inferred.
      console.log("Non-authenticated user redirected from TrueLinq. Assuming phone verified, moving to Step 4.");
      this.isPhoneNumberVerified = true;
      // If phoneNumber is crucial here and not persisted, you might need to
      // prompt the user to re-enter it or have the backend provide it.
      // For this example, we assume `this.phoneNumber` (from a prior session or manual entry)
      // will be the one used for the profile, and TrueLinq's verification applies to it.
      this.step = 4; // Jump to professional data entry
    } else {
      // Non-authenticated user starts at welcome screen
      console.log("Non-authenticated user. Starting at Step 1 (welcome).");
      this.step = 1;
    }
  },
  methods: {
    getPhonePlaceholder() {
      const placeholders = {
        "+1": "(555) 123-4567",
        "+91": "98765 43210",
      };
      return placeholders[this.countryCode] || "Enter phone number";
    },

    validatePhoneNumber() {
      const minLengths = {
        "+1": 10,
        "+91": 10,
      };

      const cleanNumber = this.phoneNumber.replace(/[^\d]/g, "");
      const requiredLength = minLengths[this.countryCode] || 10;

      if (cleanNumber.length === 0) {
        this.isPhoneValid = false;
        this.phoneValidationMessage = "";
      } else if (cleanNumber.length < requiredLength) {
        this.isPhoneValid = false;
        this.phoneValidationMessage = `Phone number should be ${requiredLength} digits`;
      } else if (cleanNumber.length === requiredLength) {
        this.isPhoneValid = true;
        this.phoneValidationMessage = "✓ Valid phone number";
      } else {
        this.isPhoneValid = false;
        this.phoneValidationMessage = `Phone number should be exactly ${requiredLength} digits`;
      }
    },

    onCategoryChange() {
      this.professionSubCategory = "";
      this.subCategories = this.categorySubCategories[this.professionCategory] || [];
    },

    proceedToPhoneNumber() {
      this.step = 2;
    },

    async verifyNumber() {
      this.isVerifying = true;
      this.verificationError = "";

      // IMPORTANT: Store the phone number before redirecting, if not already stored
      // This is crucial for retrieving it after TrueLinq redirects back.
      // For example: localStorage.setItem('pendingWhatsAppNumber', this.fullPhoneNumber);

      ApiService.redirectToWhatsAppVerification(this.fullPhoneNumber); // This now uses window.open()
      this.step = 3; // Show "complete verification" message immediately
      this.isVerifying = false;
    },

    async handleAuthenticatedUserFlow(wasRedirected) {
      try {
        // 1. Fetch WhatsApp Profile
        const whatsappProfile = await ApiService.getWhatsAppProfile(this.currentUserId);

        if (whatsappProfile && whatsappProfile.contact) {
          // If a WhatsApp profile is found, pre-fill and mark as verified
          this.phoneNumber = whatsappProfile.contact.replace(/^\+\d{1,3}/, ""); // Remove country code for display
          this.countryCode = whatsappProfile.contact.match(/^\+\d{1,3}/)[0] || "+91"; // Extract country code
          this.isPhoneNumberReadonly = true;
          this.isPhoneNumberVerified = true;
          this.isPhoneValid = true;
          this.phoneValidationMessage = "✓ Phone number fetched and verified.";

          // 2. Check for Existing Professional Profile using the verified WhatsApp contact
          const profileUUId = `whatsapp:${whatsappProfile.contact}`;
          const professionalProfile = await ApiService.getProfessionalProfile(profileUUId);

          if (professionalProfile) {
            this.isExistingProfile = true;
            this.fillProfileForm(professionalProfile);
            this.step = 4; // Go directly to profile form, pre-filled
          } else {
            // No existing professional profile, proceed to fill new one
            this.isExistingProfile = false;
            this.step = 4;
          }
        } else {
          // No WhatsApp profile found for authenticated user, proceed with fresh WhatsApp entry
          console.log("No WhatsApp profile found for authenticated user. Requesting verification.");
          this.isPhoneNumberReadonly = false;
          this.isPhoneNumberVerified = false;
          this.step = 2; // Keep at step 2 to enter WhatsApp number
          // If the user *just* came back from a TrueLinq redirect, but no profile was fetched,
          // it might indicate an issue with backend linking or a new user.
          // You might want to re-evaluate the flow here if `wasRedirected` is true but no profile.
        }
      } catch (error) {
        console.error("Error in authenticated user flow:", error);
        this.verificationError = "Could not fetch profile data. Please try again or manually verify.";
        this.isPhoneNumberReadonly = false;
        this.isPhoneNumberVerified = false;
        this.step = 2; // Allow user to enter manually if fetch fails
      }
    },

    fillProfileForm(profile) {
      this.businessName = profile.businessName || "";
      this.workTitle = profile.title || "";
      this.businessDescription = profile.businessDesc || "";
      this.description = profile.description || "";
      this.address = profile.address || "";
      this.latitude = profile.latitude || "";
      this.longitude = profile.longitude || "";

      // Map API category back to frontend category for dropdown
      // This mapping assumes the API stores a subCategory that maps back to a unique parent category
      const frontendCategory =
        Object.keys(this.categorySubCategories).find((key) =>
          this.categorySubCategories[key].includes(profile.subCategory)
        ) || "";

      this.professionCategory = frontendCategory;
      this.onCategoryChange(); // Populate subcategories based on mapped category
      this.professionSubCategory = profile.subCategory || "";

      this.profileVisibility = profile.isPublic ? "public" : "private";
    },

    
    proceedAfterManualVerification() {
      // In a real application, you might want to re-fetch the WhatsApp profile here
      // for authenticated users to confirm the verification status.
      // For non-authenticated, this implies trust that they completed it.
      this.isPhoneNumberVerified = true; // Mark as verified for this session
      this.step = 4; // Move to professional data entry
    },

    async proceedToVisibility() {
      try {
        const location = await ApiService.getCurrentLocation();
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        this.step = 5;
        this.profileCreationError = ""; // Clear any previous errors before showing step 5
        this.showReverifyButton = false; // Hide re-verify button on new step
      } catch (error) {
        this.locationError = "Unable to get location. Using default location (Kanpur).";
        this.latitude = "26.449923"; // Default to Kanpur coordinates
        this.longitude = "80.331871";
        this.step = 5;
        this.profileCreationError = ""; // Clear errors
        this.showReverifyButton = false;
      }
    },

    async completeProfile() {
      this.isCreatingProfile = true;
      this.profileCreationError = ""; // Clear previous errors
      this.showReverifyButton = false; // Hide button initially

      try {
        const profileData = {
          address: this.address,
          businessDesc: this.businessDescription,
          businessName: this.businessName,
          category: ApiService.mapCategoryToAPI(this.professionCategory),
          contact: this.fullPhoneNumber, // This is the crucial field for 1010 error
          description: this.description,
          latitude: this.latitude,
          longitude: this.longitude,
          profileUUId: `whatsapp:${this.fullPhoneNumber}`, // Ensure this matches backend expectation
          subCategory: ApiService.mapSubCategoryToAPI(this.professionSubCategory),
          title: this.workTitle,
          isPublic: this.profileVisibility === "public", // Map to boolean for API
        };

        let response;
        if (this.isExistingProfile) {
          response = await ApiService.updateProfile(profileData);
        } else {
          response = await ApiService.createProfile(profileData);
        }

        console.log("Profile saved successfully:", response);
        localStorage.setItem("profileVisibility", this.profileVisibility); // Example: store preference
        this.step = 6; // Move to success step
      } catch (error) {
        console.error("Profile saving failed:", error);

        // Check for the specific 1010 error code
        if (error.code === 1010) {
          this.profileCreationError = `Error: ${error.message || "Valid WhatsApp number required. Please re-verify."}`;
          this.showReverifyButton = true; // Show the button to re-verify
          // Do NOT change step automatically here. User stays on Step 5 and clicks the button.
        } else {
          // Handle other general API errors
          this.profileCreationError = `Failed to ${
            this.isExistingProfile ? "update" : "create"
          } profile. Please try again. (${error.message || 'Unknown error'})`;
          this.showReverifyButton = false; // No re-verify button for other errors
        }
      } finally {
        this.isCreatingProfile = false;
      }
    },

    reverifyWhatsApp() {
      // Logic to send the user back to the WhatsApp verification screen (Step 2)
      this.step = 2;
      this.isPhoneNumberVerified = false; // Mark as unverified to prompt re-verification
      this.isPhoneNumberReadonly = false; // Allow editing if needed
      this.verificationError = "Please re-verify your WhatsApp number."; // Informative message
      this.profileCreationError = ""; // Clear the previous error from step 5
      this.showReverifyButton = false;
    },

    goToDashboard() {
      console.log("Navigating to dashboard...");
      // Ideally, use Vue Router: this.$router.push('/dashboard');
      alert("Redirecting to dashboard (simulated)...");
    },

    shareProfile() {
      const profileUrl = `${window.location.origin}/profile/${this.fullPhoneNumber}`;
      if (navigator.share) {
        navigator
          .share({
            title: `${this.businessName} - ${this.workTitle}`,
            text: this.businessDescription,
            url: profileUrl,
          })
          .then(() => console.log("Profile shared successfully"))
          .catch((err) => {
            console.error("Error sharing profile:", err);
            this.fallbackShare(profileUrl);
          });
      } else {
        this.fallbackShare(profileUrl);
      }
    },

    fallbackShare(profileUrl) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(profileUrl)
          .then(() => alert("Profile link copied to clipboard!"))
          .catch(() => this.showShareDialog(profileUrl));
      } else {
        this.showShareDialog(profileUrl);
      }
    },

    showShareDialog(profileUrl) {
      const shareText = `Check out my profile: ${profileUrl}`;
      const encodedText = encodeURIComponent(shareText);

      const shareOptions = [
        { name: "WhatsApp", url: `https://wa.me/?text=${encodedText}` },
        { name: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodedText}` },
        { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}` },
        {
          name: "LinkedIn",
          url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
        },
      ];

      // Simple browser prompt. For better UX, implement a custom modal.
      const selectedOption = prompt(
        `Share your profile:\n${profileUrl}\n\nChoose a platform (e.g., WhatsApp, Twitter):`
      );
      const foundOption = shareOptions.find((opt) => opt.name.toLowerCase() === selectedOption?.toLowerCase());
      if (foundOption) {
        window.open(foundOption.url, "_blank");
      } else if (selectedOption) {
        alert("Invalid platform. Link copied to clipboard instead.");
        navigator.clipboard.writeText(profileUrl);
      }
    },
  },
};
</script>


<style scoped>
.profile-creation {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.progress-container {
  margin-bottom: 30px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
  border: 1px solid #e0e0e0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  background: #4caf50;
  color: white;
  padding: 25px 30px;
  text-align: center;
}

.success-header {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.card-body {
  padding: 30px;
}

.description {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  text-align: center;
}

.features-list {
  margin: 25px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
}

.check-icon {
  background: #4caf50;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 14px;
  font-weight: bold;
}

/* Phone Input Styles */
.phone-input-container {
  display: flex;
  gap: 10px;
}

.country-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  min-width: 120px;
  transition: border-color 0.3s ease;
}

.phone-input {
  flex: 1;
}

.country-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.validation-message {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.validation-message.valid {
  color: #4caf50;
}

.validation-message.invalid {
  color: #f44336;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: 20px;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  margin-top: 10px;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-success {
  background: #2e7d32;
  color: white;
}

.btn-success:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;
  width: 100%;
  min-width: 250px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.verification-card .card-body {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.verification-number {
  font-weight: 600;
  color: #4caf50;
  margin-top: 15px;
}

.visibility-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.visibility-option {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.visibility-option:hover {
  border-color: #4caf50;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.visibility-option.active {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.visibility-label {
  cursor: pointer;
  width: 100%;
}

.visibility-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.visibility-icon {
  font-size: 24px;
  margin-right: 12px;
}

.visibility-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.visibility-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.visibility-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.additional-settings {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.additional-settings h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.checkbox-input {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #4caf50;
}

/* Success Page Styles */
.success-body {
  text-align: center;
}

.success-animation {
  margin: 20px 0 30px 0;
}

/* Success Page Styles - Continued from where it was cut off */
.checkmark-circle {
  width: 80px;
  height: 80px;
  border: 4px solid #4caf50;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  animation: checkmarkCircle 0.6s ease-in-out;
}

@keyframes checkmarkCircle {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkmark {
  width: 24px;
  height: 24px;
  border-right: 4px solid #4caf50;
  border-bottom: 4px solid #4caf50;
  transform: rotate(45deg);
  animation: checkmarkDraw 0.4s ease-in-out 0.3s both;
}

@keyframes checkmarkDraw {
  0% {
    width: 0;
    height: 0;
  }
  50% {
    width: 24px;
    height: 0;
  }
  100% {
    width: 24px;
    height: 24px;
  }
}

.success-title {
  color: #333;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 600;
}

.success-description {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.success-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.next-steps {
  margin: 40px 0;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.next-steps h4 {
  color: #333;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.step-icon {
  font-size: 20px;
  margin-right: 15px;
  width: 30px;
  text-align: center;
}

.success-actions {
  display: flex;
  gap: 15px;
  flex-direction: column;
  margin-top: 30px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-creation {
    padding: 15px;
  }

  .card-header {
    padding: 20px 25px;
  }

  .card-body {
    padding: 25px 20px;
  }

  .card-header h2 {
    font-size: 20px;
  }

  .phone-input-container {
    flex-direction: column;
  }

  .country-select {
    min-width: 100%;
  }

  .visibility-options {
    gap: 15px;
  }

  .visibility-option {
    padding: 15px;
  }

  .success-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 24px;
  }

  .success-actions {
    gap: 10px;
  }

  .btn {
    padding: 14px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-creation {
    padding: 10px;
  }

  .card-header {
    padding: 15px 20px;
  }

  .card-body {
    padding: 20px 15px;
  }

  .card-header h2 {
    font-size: 18px;
  }

  .description {
    font-size: 14px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    font-size: 14px;
    padding: 10px 12px;
  }

  .success-stats {
    flex-direction: column;
    gap: 15px;
  }

  .next-steps {
    margin: 30px 0;
  }

  .step-item {
    padding: 10px 12px;
  }

  .step-icon {
    font-size: 18px;
    width: 25px;
  }
}

/* Additional Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-item {
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.feature-item:nth-child(1) {
  animation-delay: 0.1s;
}
.feature-item:nth-child(2) {
  animation-delay: 0.2s;
}
.feature-item:nth-child(3) {
  animation-delay: 0.3s;
}
.feature-item:nth-child(4) {
  animation-delay: 0.4s;
}

/* Loading Animation Enhancement */
.loading-spinner {
  position: relative;
}

.loading-spinner::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #4caf50;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Form Validation Enhancements */
.form-input:invalid {
  /* border-color: #f44336; */
}

.form-input:valid {
  border-color: #4caf50;
}

.form-textarea:invalid {
  /* border-color: #f44336; */
}

.form-textarea:valid {
  border-color: #4caf50;
}

/* Hover Effects */
.visibility-option:hover .visibility-icon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.step-item:hover {
  background: #e8f5e8;
  transition: background-color 0.3s ease;
}

.step-item:hover .step-icon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Focus States */
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
}

.visibility-option:focus-within {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

/* Success Page Specific Animations */
.success-body .success-title {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.success-body .success-description {
  animation: fadeInUp 0.6s ease-out 0.7s both;
}

.success-body .success-stats {
  animation: fadeInUp 0.6s ease-out 0.9s both;
}

.success-body .next-steps {
  animation: fadeInUp 0.6s ease-out 1.1s both;
}

.success-body .success-actions {
  animation: fadeInUp 0.6s ease-out 1.3s both;
}

/* Print Styles */
@media print {
  .profile-creation {
    background: white;
    padding: 0;
  }

  .card {
    box-shadow: none;
    border: 1px solid #ccc;
  }

  .btn {
    display: none;
  }

  .loading-spinner {
    display: none;
  }
}
</style>

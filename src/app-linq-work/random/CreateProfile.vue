<template>
  <div class="app">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: (currentStep / 4) * 100 + '%' }"></div>
    </div>

    <FullScreenLoader v-if="apiLoading" />

    <div v-else class="container">
      <!-- Step 1: Getting Started -->
      <div v-if="currentStep === 1" class="step">
        <div class="main-card">
          <div class="header">
            <h2>Create Your Profile</h2>
            <p>Build a professional presence that showcases your expertise and connects you with opportunities.</p>
          </div>

          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-icon">
                <Briefcase :size="24" />
              </div>
              <div class="feature-content">
                <h3>Professional Details</h3>
                <p>Add your experience, skills, and background</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <MessageCircle :size="24" />
              </div>
              <div class="feature-content">
                <h3>Contact Preferences</h3>
                <p>Choose how clients and collaborators reach you</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <Lock :size="24" />
              </div>
              <div class="feature-content">
                <h3>Privacy Settings</h3>
                <p>Control the visibility of your profile</p>
              </div>
            </div>
          </div>

          <div class="button-row">
            <div></div>
            <button @click="nextStep" class="btn btn-primary">Start Building Profile</button>
          </div>
        </div>
      </div>
      <!-- Step 2: Contact Method Selection -->
      <div v-if="currentStep === 2" class="step">
        <div class="main-card">
          <div class="header">
            <h2>Contact Preferences</h2>
            <p v-if="!verificationRequired && hasExistingProfiles">
              You have verified contact methods available. Please choose one to continue.
            </p>
            <p v-else-if="verificationRequired">
              How would you like clients to reach you? You'll need to verify your contact method.
            </p>
            <p v-else>How would you like clients to reach you?</p>
          </div>

          <!-- Show existing verified profiles when verification is not required -->
          <div v-if="!verificationRequired && hasExistingProfiles" class="contact-options">
            <!-- WhatsApp profiles -->
            <div v-if="whatsappProfiles.length > 0">
              <div
                v-for="(profile, index) in whatsappProfiles"
                :key="'whatsapp-' + index"
                @click="selectExistingProfile('whatsapp', profile)"
                :class="[
                  'contact-option',
                  { active: selectedProfile && selectedProfile.profileId === profile.profileId },
                ]"
              >
                <div class="contact-icon">
                  <Smartphone :size="24" />
                </div>
                <div class="contact-content">
                  <h3>WhatsApp</h3>
                  <p>
                    <!-- {{ profile.name }}   -->
                    {{ formatPhoneNumber(profile.phone) }}
                    <!-- <span style="color: #10b981; font-weight: 500"><Check :size="14" /></span> -->
                  </p>
                </div>
                <div
                  class="radio"
                  :class="{ checked: selectedProfile && selectedProfile.profileId === profile.profileId }"
                ></div>
              </div>
            </div>

            <!-- Mobile profiles -->
            <div v-if="mobileProfiles.length > 0">
              <div
                v-for="(profile, index) in mobileProfiles"
                :key="'mobile-' + index"
                @click="selectExistingProfile('mobile', profile)"
                :class="[
                  'contact-option',
                  { active: selectedProfile && selectedProfile.profileId === profile.profileId },
                ]"
              >
                <div class="contact-icon">
                  <Phone :size="24" />
                </div>
                <div class="contact-content">
                  <h3>Phone</h3>
                  <p>
                    {{ formatPhoneNumber(profile.phone) }}
                    <!-- <span style="color: #10b981; font-weight: 500">Verified</span> -->
                  </p>
                </div>
                <div
                  class="radio"
                  :class="{ checked: selectedProfile && selectedProfile.profileId === profile.profileId }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Show regular contact options when verification is required or no existing profiles -->
          <div v-else class="contact-options">
            <div
              v-if="requiredProviders.includes('whatsapp')"
              @click="selectNewContactMethod('whatsapp')"
              :class="['contact-option', { active: contactMethod === 'whatsapp' }]"
            >
              <div class="contact-icon">
                <Smartphone :size="24" />
              </div>
              <div class="contact-content">
                <h3>WhatsApp</h3>
                <p>Quick messaging and voice calls</p>
              </div>
              <div class="radio" :class="{ checked: contactMethod === 'whatsapp' }"></div>
            </div>

            <div
              v-if="requiredProviders.includes('mobile')"
              @click="selectNewContactMethod('mobile')"
              :class="['contact-option', { active: contactMethod === 'mobile' }]"
            >
              <div class="contact-icon">
                <Phone :size="24" />
              </div>
              <div class="contact-content">
                <h3>Phone Number</h3>
                <p>Direct phone calls</p>
              </div>
              <div class="radio" :class="{ checked: contactMethod === 'mobile' }"></div>
            </div>
          </div>

          <!-- Show input field for new contact method -->
          <!-- <div v-if="contactMethod && !selectedProfile" class="form-section">
            <div class="form-group">
              <label>{{ contactMethod === "whatsapp" ? "WhatsApp Number" : "Phone Number" }}</label>
              <input v-model="contactValue" type="tel" placeholder="+1 (555) 123-4567" class="input" />
              <p v-if="verificationRequired" class="verification-note">
                You'll be redirected to verify this number after clicking continue.
              </p>
            </div>
          </div>-->

          <div class="button-row">
            <button @click="prevStep" class="btn btn-secondary">Back</button>
            <button
              @click="handleStep2Continue"
              :disabled="!canProceedStep2"
              :class="['btn', canProceedStep2 ? 'btn-primary' : 'btn-disabled']"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Professional Information -->
      <!-- Step 3: Professional Information -->
      <div v-if="currentStep === 3" class="step">
        <div class="main-card">
          <div class="header">
            <h2>Professional Information</h2>
            <p>Tell us about your business and expertise</p>
          </div>

          <div class="form-section">
            <h3 class="section-title">Business Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Business Name *</label>
                <input v-model="profile.businessName" placeholder="Tech Solutions Inc." class="input" required />
              </div>
              <div class="form-group">
                <label>Title *</label>
                <input v-model="profile.title" placeholder="Software Engineer" class="input" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <input v-model="profile.category" placeholder="Technology, Healthcare, etc." class="input" required />
              </div>
              <div class="form-group">
                <label>SubCategory *</label>
                <input v-model="profile.subCategory" placeholder="Sub Category" class="input" required />
              </div>
            </div>
            <div class="form-group">
              <label>Website</label>
              <input v-model="profile.website" type="url" placeholder="https://example.com" class="input" />
            </div>

            <div class="form-group">
              <label>Address</label>
              <input v-model="profile.address" placeholder="123 Main St, City, State" class="input" />
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Description</h3>
            <div class="form-group">
              <label>Business Description *</label>
              <textarea
                v-model="profile.businessDesc"
                placeholder="Describe your business, services, and what makes you unique..."
                rows="4"
                class="textarea"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Additional Description</label>
              <textarea
                v-model="profile.description"
                placeholder="Any additional information about your services or expertise..."
                rows="3"
                class="textarea"
                required
              ></textarea>
            </div>
          </div>

          <div class="button-row">
            <button @click="prevStep" class="btn btn-secondary">Back</button>
            <button
              @click="nextStep"
              :disabled="!canProceedStep3"
              :class="['btn', canProceedStep3 ? 'btn-primary' : 'btn-disabled']"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Privacy Settings -->
      <div v-if="currentStep === 4" class="step">
        <div class="main-card">
          <div class="header">
            <h2>Privacy Settings</h2>
            <p>Control how your profile is viewed and discovered</p>
          </div>

          <div v-if="apiError" class="error-message">
            <div class="error-content">
              <AlertCircle :size="16" class="error-icon" />
              <span>{{ apiError }}</span>
            </div>
          </div>

          <div class="form-section">
            <!-- <h3 class="section-title">Profile Visibility</h3> -->

            <div class="privacy-wrapper">
              <div class="privacy-toggle">
                <div class="privacy-info">
                  <div class="privacy-title">
                    <Globe v-if="profile.isPublic" :size="16" style="display: inline; margin-right: 8px" />
                    <Shield v-else :size="16" style="display: inline; margin-right: 8px" />
                    {{ profile.isPublic ? "Public Profile" : "Private Profile" }}
                  </div>
                  <p>
                    {{
                      profile.isPublic
                        ? "Your profile will be discoverable and visible to everyone"
                        : "Only people with direct access can view your profile"
                    }}
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" v-model="profile.isPublic" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="privacy-toggle">
                <div class="privacy-info">
                  <div class="privacy-title">
                    <Search v-if="profile.searchable" :size="16" style="display: inline; margin-right: 8px" />
                    <EyeOff v-else :size="16" style="display: inline; margin-right: 8px" />
                    {{ profile.searchable ? "Searchable" : "Not Searchable" }}
                  </div>
                  <p>
                    {{
                      profile.searchable
                        ? "Your profile can be found in search results"
                        : "Your profile won't appear in search results"
                    }}
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" v-model="profile.searchable" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="button-row">
            <button @click="prevStep" class="btn btn-secondary">Back</button>
            <button @click="nextStep" class="btn btn-primary">Create Profile</button>
          </div>
        </div>
      </div>

      <!-- Step 4: Success Screen -->
      <div v-if="currentStep === 5" class="step">
        <div class="main-card">
          <div class="success-header">
            <div class="success-icon">
              <Check :size="24" />
            </div>
            <h2>Profile Created Successfully</h2>
            <p>Your professional profile is now ready to attract opportunities and showcase your expertise.</p>
          </div>

          <div class="button-row">
            <router-link to="/profile" class="btn btn-primary"> View Full Profile </router-link>

            <button class="btn btn-secondary">Share Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Briefcase,
  MessageCircle,
  Lock,
  Smartphone,
  Phone,
  Check,
  Globe,
  Shield,
  Loader,
  Search,
  EyeOff,
  AlertCircle,
} from "lucide-vue";
// Import both functions from your apiService file
import { getRequiredProvider, createProfile } from "../api/profileCreate";
import FullScreenLoader from "../components/Loader.vue";
import { APP_CONNECT_URL } from "../constants/constants";

export default {
  components: {
    Briefcase,
    MessageCircle,
    Lock,
    Phone,
    Check,
    Globe,
    Shield,
    Search,
    EyeOff,
    FullScreenLoader,
    Smartphone,
    AlertCircle,
  },
  name: "UnifiedProfileCreator",
  data() {
    return {
      currentStep: 1,
      contactMethod: "",
      contactValue: "",
      selectedProfile: null,
      skillInput: "",
      profile: {
        businessName: "",
        title: "",
        category: "",
        website: "",
        address: "",
        businessDesc: "",
        description: "",
        isPublic: true,
        searchable: true,
        // Add properties for full name, profession, company, location, email if needed for success screen
        fullName: "", // Assuming you'll add a field for full name in a previous step or derive it
        profession: "", // Assuming you'll add a field for profession
        company: "", // Assuming you'll add a field for company
        location: "", // Will be derived from address or geolocation
        email: "", // Assuming you'll add a field for email
      },
      apiData: null,
      apiLoading: false,
      apiError: null,
      verificationRequired: false,
      requiredProviders: [],
      existingProfiles: [],
      userLatitude: null, // To store user's latitude
      userLongitude: null, // To store user's longitude
    };
  },
  computed: {
    canProceedStep2() {
      // Can proceed if either an existing profile is selected or new contact method is provided
      return this.selectedProfile || this.contactMethod;
      //&& this.contactValue.trim()
    },
    canProceedStep3() {
      return (
        this.profile.businessName.trim() &&
        this.profile.title.trim() &&
        this.profile.category.trim() &&
        this.profile.businessDesc.trim() &&
        this.profile.description.trim()
      );
    },
    hasExistingProfiles() {
      return this.existingProfiles && this.existingProfiles.length > 0;
    },
    whatsappProfiles() {
      return this.existingProfiles.filter((profile) => profile.provider === "whatsapp");
    },
    mobileProfiles() {
      return this.existingProfiles.filter((profile) => profile.provider === "mobile");
    },
    finalContactMethod() {
      if (this.selectedProfile) {
        return this.selectedProfile.provider;
      }
      return this.contactMethod;
    },
    finalContactValue() {
      if (this.selectedProfile) {
        return this.formatPhoneNumber(this.selectedProfile.phone);
      }
      return this.contactValue;
    },
  },
  async mounted() {
    await this.fetchRequiredProviderData();
    // Attempt to get user's location on mount, but don't block the UI
    this.getUserLocation();
  },
  methods: {
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    },
    formatPhoneNumber(phone) {
      // Basic phone number formatting - you can enhance this based on your needs
      if (!phone) return "";
      // Remove country code if it starts with 91 (India)
      if (phone.startsWith("91") && phone.length > 10) {
        return phone.substring(2);
      }
      return phone;
    },
    async nextStep() {
      // Logic to handle profile creation when on the last step (Step 4)
      if (this.currentStep === 4) {
        await this.handleCreateProfile();
      } else if (this.currentStep < 5) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    selectNewContactMethod(method) {
      this.contactMethod = method;
      this.selectedProfile = null; // Clear selected profile when choosing new method
    },
    selectExistingProfile(type, profile) {
      this.selectedProfile = profile;
      this.contactMethod = ""; // Clear new contact method when selecting existing profile
      this.contactValue = "";
    },
    async handleStep2Continue() {
      if (this.verificationRequired && !this.selectedProfile) {
        // Redirect to verification page for new contact method
        const provider = this.contactMethod;
        const returnUrl = encodeURIComponent(window.location.origin + "/linq/work/create");
        const a =`${APP_CONNECT_URL}/${provider}?returnEndPoint=/linq/work/create`;
        console.log(a)
        window.location.href = `${APP_CONNECT_URL}/${provider}?returnEndPoint=/linq/work/create`;
      } else {
        // Proceed to next step
        this.nextStep();
      }
    },
    addSkill() {
      if (this.skillInput.trim() && !this.profile.skills.includes(this.skillInput.trim())) {
        this.profile.skills.push(this.skillInput.trim());
        this.skillInput = "";
      }
    },
    removeSkill(index) {
      this.profile.skills.splice(index, 1);
    },
    async fetchRequiredProviderData() {
      this.apiLoading = true;
      this.apiError = null;
      try {
        const response = await getRequiredProvider();

        const contentType = response.headers["content-type"];
        if (contentType && contentType.includes("text/html")) {
          console.log("Detected HTML response, redirecting...");
          // window.location.href = response.request.responseURL;
        } else {
          this.apiData = response.data.results[0];
          console.log("API Data:", this.apiData);

          // Extract data from API response
          this.verificationRequired = this.apiData.verificationRequired || false;
          this.requiredProviders = this.apiData.required || [];
          this.existingProfiles = this.apiData.profile || [];

          console.log("Verification Required:", this.verificationRequired);
          console.log("Required Providers:", this.requiredProviders);
          console.log("Existing Profiles:", this.existingProfiles);
        }
      } catch (error) {
        this.apiError = error;
        console.error("Error fetching provider data:", error);
      } finally {
        this.apiLoading = false;
      }
    },
    // New method to get user's geolocation
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLatitude = position.coords.latitude.toString();
            this.userLongitude = position.coords.longitude.toString();
            console.log("User location:", this.userLatitude, this.userLongitude);
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
            // Optionally, you can set a flag here if you want to show a message to the user
            // that location could not be obtained.
            this.userLatitude = null;
            this.userLongitude = null;
          },
          {
            enableHighAccuracy: false, // Set to true if high accuracy is critical
            timeout: 5000, // Maximum time to wait for a position
            maximumAge: 0, // Accept a cached position no older than 0 milliseconds
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        this.userLatitude = null;
        this.userLongitude = null;
      }
    },
    // New method to handle profile creation
    async handleCreateProfile() {
      this.apiLoading = true;
      this.apiError = null;

      try {
        // const profilePayload = {
        //   address: "27 Pipe Lane, Royapettah, Chennai, Tamil Nadu, 600014",
        //   businessDesc:
        //     "Reliable plumbing service provider offering residential and commercial repairs, installations, and maintenance.",
        //   businessName: "Mabetone Basis Integris",
        //   category: "Home Services",
        //   description: "Professional plumbing solutions with quick turnaround times and long-lasting results.",
        //   title: "Plumbing & Maintenance Services",
        //   isPublic: true,
        //   searchable: true,
        //   website: "https://mabetoneplumbing.in",
        //   latitude: 13.0531,
        //   longitude: 80.2652,
        // };

        const profilePayload = {
          address: this.profile.address,
          businessDesc: this.profile.businessDesc,
          businessName: this.profile.businessName,
          category: this.profile.category,
          description: this.profile.description,
          title: this.profile.title,
          isPublic: this.profile.isPublic,
          searchable: this.profile.searchable,
          website: this.profile.website, // Include website even if optional
          // Use user location if available, otherwise default to Mumbai coordinates
          latitude: this.userLatitude || 19.076, // Mumbai latitude
          longitude: this.userLongitude || 72.8777, // Mumbai longitude
        };

        // Add contact information and profileIds based on selection
        if (this.selectedProfile) {
          // If an existing profile is selected, use its phone and construct profileIds
          profilePayload.contact = this.selectedProfile.phone;
          profilePayload.profileIds = [`${this.selectedProfile.provider}:${this.selectedProfile.profileId}`];
        } else if (this.contactMethod && this.contactValue.trim()) {
          // If a new contact method is entered, use its value and an empty profileIds array
          profilePayload.contact = this.contactValue.trim();
          profilePayload.profileIds = [];
          // New contacts won't have a profileId yet
        } else {
          // Fallback or error if no contact method is selected/provided
          console.error("No contact method selected or provided for profile creation.");
          this.apiError = "Please select or provide a contact method.";
          this.apiLoading = false;
          return; // Prevent API call if contact is missing
        }

        // Add latitude and longitude if available
        if (this.userLatitude && this.userLongitude) {
          profilePayload.latitude = this.userLatitude;
          profilePayload.longitude = this.userLongitude;
        }

        // Assuming subCategory is derived or hardcoded, if not, add a field for it
        profilePayload.subCategory = this.profile.category; // Using category as subCategory for now, adjust as needed

        console.log("Sending profile payload:", profilePayload);
        const response = await createProfile(profilePayload);
        console.log("Profile creation response:", response.data);

        // Populate success screen data if needed (e.g., from response or current profile state)
        this.profile.fullName = this.profile.businessName; // Example: using business name as full name
        this.profile.profession = this.profile.title; // Example: using title as profession
        this.profile.company = this.profile.businessName; // Example: using business name as company
        this.profile.location = this.profile.address; // Example: using address as location
        this.profile.email = "example@example.com"; // Placeholder, you might have an email field

        // Proceed to the success step
        this.currentStep = 5;
      } catch (error) {
        this.apiError =
          error?.response?.data?.message ||
          error.message ||
          "Failed to create profile. Please check your information and try again.";
        console.error("Error creating profile:", error);

        // You might want to show a user-friendly error message here
      } finally {
        this.apiLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc2626;
  font-size: 14px;
}

.error-icon {
  flex-shrink: 0;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f0f0f0;
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
}

.step {
  animation: fadeIn 0.5s ease;
}

.main-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.header p {
  font-size: 1rem;
  color: #666;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.5;
}

.feature-cards {
  margin-bottom: 40px;
}

.feature-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 1.5rem;
  margin-right: 16px;
  min-width: 40px;
  text-align: center;
}

.feature-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.contact-options {
  margin-bottom: 30px;
}

.contact-option {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-option:hover {
  border-color: #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-option.active {
  border-color: #000;
  background: #f8f8f8;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 16px;
  min-width: 40px;
  text-align: center;
}

.contact-content {
  flex-grow: 1;
}

.contact-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.contact-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.radio {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
}

.radio.checked {
  border-color: #000;
}

.radio.checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.input,
.textarea {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #000;
}

.input::placeholder,
.textarea::placeholder {
  color: #999;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.skill-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.skill-input .input {
  flex-grow: 1;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 6px 12px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-tag:hover:not(.readonly) {
  background: #e0e0e0;
  border-color: #ccc;
}

.skill-tag.readonly {
  cursor: default;
  background: #f8f8f8;
}

.privacy-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.privacy-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.privacy-info {
  flex-grow: 1;
}

.privacy-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.privacy-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #000;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(22px);
  background-color: #fff;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #000;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  border-color: #ccc;
  background: #f8f8f8;
}

.btn-disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.button-row {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-top: 30px;
}

@media (max-width: 600px) {
  .button-row {
    flex-direction: column;
  }
}

.success-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.profile-preview {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
}

.profile-header {
  margin-bottom: 30px;
}

.profile-info {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 64px;
  height: 64px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 20px;
  flex-shrink: 0;
}

.profile-details {
  flex-grow: 1;
}

.name-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.name-status h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.public {
  background: #4ade80;
}

.status-dot.private {
  background: #888;
}

.profession {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.details p {
  color: #666;
  font-size: 0.9rem;
  margin: 2px 0;
}

.profile-section {
  margin-bottom: 30px;
}

.profile-section:last-child {
  margin-bottom: 0;
}

.bio-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-method {
  width: 40px;
  height: 40px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-type {
  font-weight: 600;
  margin-bottom: 2px;
}

.contact-value {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
</style>

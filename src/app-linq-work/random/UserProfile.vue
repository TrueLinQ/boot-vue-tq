<template>
  <div class="app">
    <FullScreenLoader v-if="apiLoading" />
    <div v-else class="container">
      <!-- Profile Header Section -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-info">
            <div class="profile-main">
              <div class="avatar">{{ getInitials(profile.userName) }}</div>
              <div class="name-status">
                <h1>{{ profile.userName }}</h1>
              </div>
            </div>
          </div>

          <div class="profile-details">
            <!-- Business Title -->
            <h2 class="business-title" v-if="profile.businessDetails?.title">
              {{ profile.businessDetails.title }}
            </h2>

            <!-- Profile Title (if different from business title) -->
            <p class="profile-title" v-if="profile.title && profile.title !== profile.businessDetails?.title">
              {{ profile.title }}
            </p>

            <!-- Business Description (Short) -->
            <p class="business-tagline" v-if="profile.description">
              {{ profile.description }}
            </p>

            <h2 class="business-tagline-block" v-if="profile.businessDetails?.businessDescription">
              {{ profile.businessDetails.businessDescription }}
            </h2>

            <!-- Contact & Website Info -->
            <div class="quick-info">
              <div class="info-row" v-if="profile.businessDetails?.website">
                <Globe class="info-icon" :size="16" />
                <a :href="profile.businessDetails.website" target="_blank" class="info-link">
                  {{ profile.businessDetails.website.replace("https://", "").replace("http://", "") }}
                </a>
              </div>

              <!-- <div class="info-row" v-if="displayContactInfo.length > 0">
                <component :is="getContactIcon(displayContactInfo[0].provider)" class="info-icon" :size="16" />
                <span class="info-text" :class="{ 'blurred-text': !isConnected }">
                  {{ isConnected ? displayContactInfo[0].phone : "•••••••••••" }}
                </span>
              </div> -->
            </div>

            <div class="secondary-info">
              <div class="info-row" v-if="profile.category">
                <Tag class="info-icon" :size="16" />
                <span class="info-text">{{ profile.category }}</span>
              </div>

              <div class="info-row" v-if="profile.businessDetails?.description">
                <MapPin class="info-icon" :size="16" />
                <span class="info-text">{{ profile.businessDetails.description }}</span>
              </div>
            </div>
          </div>

          <!-- Connection Section - Now at the bottom -->
          <div class="connection-section">
            <button
              v-if="!profile.areConnected && profile.canSendRequest"
              @click="connect(profile.userId)"
              class="btn btn-primary"
              :disabled="connectingIds.includes(profile.userId)"
            >
              <!-- <Loader v-if="connectingIds.includes(profile.id)" class="loader-icon" :size="16" /> -->
              <span>{{ connectingIds.includes(profile.userId) ? "Connecting..." : "Connect" }}</span>
            </button>
            <div v-else-if="!profile.areConnected && !profile.canSendRequest || connectionStatus === 'pending'" class="pending-badge">
              <!-- <Clock :size="16" /> -->
              Pending
            </div>
            <div v-else-if="profile.areConnected || connectionStatus === 'connected'" class="connected-badge">
              <!-- <Check :size="16" /> -->
              Connected
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-card">
        <div class="header">
          <h2>Contact</h2>
          <p>Get in touch with {{ profile.userName || "this user" }}</p>
        </div>

        <!-- Contact Options -->
        <div class="contact-options" v-if="hasContactOptions">
          <!-- Mobile/Phone Contact Cards -->
          <div
            v-for="(contact, index) in mobileContacts"
            :key="`mobile-${index}`"
            class="contact-option-card"
            :class="{ 'disabled-card': !isConnected }"
          >
            <div class="contact-option-header">
              <div class="contact-option-icon">
                <Phone :size="24" />
              </div>
              <div class="contact-option-info">
                <h4>{{ contact.provider === 'mobile' ? 'Call Now' : 'Phone' }}</h4>
                <p :class="{ 'blurred-text': !isConnected }">
                  {{ isConnected ? contact.phone : "•••••••••••" }}
                </p>
                <p v-if="!isConnected" class="connect-message">Please connect to view the contact</p>
              </div>
            </div>
            <a v-if="isConnected" :href="`tel:${contact.phone}`" class="btn btn-primary">
              <Phone :size="16" />
              Call
            </a>
            <button v-else class="btn btn-disabled" disabled>
              <Phone :size="16" />
              Call
            </button>
          </div>

          <!-- WhatsApp Contact Cards -->
          <div
            v-for="(contact, index) in whatsappContacts"
            :key="`whatsapp-${index}`"
            class="contact-option-card"
            :class="{ 'disabled-card': !isConnected }"
          >
            <div class="contact-option-header">
              <div class="contact-option-icon">
                <MessageSquare :size="24" />
              </div>
              <div class="contact-option-info">
                <h4>WhatsApp</h4>
                <p :class="{ 'blurred-text': !isConnected }">
                  {{ isConnected ? contact.phone : "•••••••••••" }}
                </p>
                <p v-if="!isConnected" class="connect-message">Please connect to view the contact</p>
              </div>
            </div>
            <a
              v-if="isConnected"
              :href="`https://wa.me/${contact.phone?.replace(/[^\d]/g, '')}`"
              target="_blank"
              class="btn btn-whatsapp"
            >
              <MessageSquare :size="16" />
              WhatsApp
            </a>
            <button v-else class="btn btn-disabled" disabled>
              <MessageSquare :size="16" />
              WhatsApp
            </button>
          </div>

        </div>

        <!-- No contact information message -->
        <div v-else class="empty-state">
          <p>No contact information available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router/composables";
import { getContact, getProfile, getUserProfile } from "../api/profileCreate";
import { MessageSquare, Phone, Globe, Tag, MapPin, } from "lucide-vue";
import FullScreenLoader from "../components/Loader.vue";

export default {
  name: "UserProfile",
  components: {
    MessageSquare,
    // Smartphone,
    Phone,
    Globe,
    // Lock,
    Tag,
    MapPin,
    FullScreenLoader
    // UserPlus,
    // Clock,
    // Check,
    // Loader,
  },
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      connectionStatus: "not_connected", // 'not_connected', 'pending', 'connected'
      connectingIds: [],
      contactData: [], // Store actual contact data from API
      profile: {
        id: "",
        userName: "",
        isPublic: true,
        category: "",
        email: "",
        areConnected: false,
        canSendRequest: true,
        channels: [], // Array of available channels from profile API
        businessDetails: {
          title: "",
          description: "",
          website: "",
          businessDescription: "",
        },
        socialProfile: [], // Keep for backward compatibility
        skills: [],
      },
      // Dummy data for testing - comment out when using real API
      // Test Case 1: Contact API returns data - uncomment this to test
      dummyContactData: [
        {
          phone: "917985731782",
          provider: "mobile",
          profileId: "a7M3dDTOFxT8u3GooQs7F9nhSdR2",
          verified: false,
          isPublic: false,
        },
        {
          phone: "919876543210",
          provider: "whatsapp",
          profileId: "a7M3dDTOFxT8u3GooQs7F9nhSdR2",
          verified: true,
          isPublic: true,
        }
      ],
      
      // Test Case 2: Contact API returns null, but channels exist - uncomment this to test
      // dummyContactData: [], // This simulates contact API returning null
      
      useDummyData: false, // Toggle this to switch between dummy and real data

      apiLoading: false,
    };
  },
  computed: {
    // Check if user is connected (has actual contact data from Contact API)
    isConnected() {
      return this.profile.areConnected || this.connectionStatus === "connected" || this.hasActualContactData;
    },
    
    // Check if contact API actually returned data
    hasActualContactData() {
      const contactData = this.useDummyData ? this.dummyContactData : this.contactData;
      return contactData && contactData.length > 0;
    },
    
    // Get the contact data to display
    displayContactInfo() {
      // Case 1: Contact API returns results (user is connected)
      if (this.hasActualContactData) {
        const contactData = this.useDummyData ? this.dummyContactData : this.contactData;
        return contactData.filter(contact => 
          contact.provider === 'mobile' || contact.provider === 'whatsapp'
        );
      }
      
      // Case 2: Contact API returns null/empty (user not connected)
      // Create placeholder objects based on channels array
      const placeholders = [];
      if (this.profile.channels && this.profile.channels.length > 0) {
        this.profile.channels.forEach(channel => {
          if (channel === 'mobile' || channel === 'whatsapp') {
            placeholders.push({
              phone: "•••••••••••",
              provider: channel,
              isPlaceholder: true
            });
          }
        });
      }
      
      return placeholders;
    },
    
    // Check if there are any contact options available
    hasContactOptions() {
      return this.displayContactInfo.length > 0;
    },
    
    // Filter mobile contacts
    mobileContacts() {
      return this.displayContactInfo.filter(contact => 
        contact.provider === 'mobile'
      );
    },
    
    // Filter WhatsApp contacts
    whatsappContacts() {
      return this.displayContactInfo.filter(contact => 
        contact.provider === 'whatsapp'
      );
    },
  },
  async mounted() {
    await this.loadProfile();
  },
  methods: {
    async loadContact() {
      try {
        const profileId = this.$route.params.id;

        if (!profileId) {
          throw new Error("Profile ID not found in the URL.");
        }

        // Uncomment when using real API
        const response = await getContact(profileId);
        return response;

        // For testing with dummy data
        if (this.useDummyData) {
          // Test Case 1: Contact API returns data
          if (this.dummyContactData.length > 0) {
            return {
              data: {
                results: this.dummyContactData
              }
            };
          } else {
            // Test Case 2: Contact API returns null/empty (simulate API returning null)
            return {
              data: {
                results: null // or could be undefined or empty array
              }
            };
          }
        }

        return { data: { results: null } }; // Return null if no dummy data
      } catch (error) {
        console.error("Error loading contact:", error);
        return { data: { results: null } }; // Return null on error
      }
    },
    
    async loadProfile() {
      this.apiLoading = true;
      console.log("Loading profile data...");
      try {
        const profileId = this.$route.params.id;

        // Uncomment when using real API
        const response = await getUserProfile(profileId);

        // For testing, simulate profile data with channels
        // const response = {
        //   data: {
        //     results: [{
        //       id: "test-id-123",
        //       userName: "John Doe",
        //       isPublic: true,
        //       category: "Business",
        //       title: "Software Developer",
        //       description: "Full-stack developer",
        //       email: "john.doe@example.com",
        //       areConnected: false,
        //       canSendRequest: true,
        //       channels: ["whatsapp", "mobile"], // Available channels - test with different combinations
        //       businessDetails: {
        //         title: "Senior Developer",
        //         description: "Tech Solutions Inc",
        //         website: "https://example.com",
        //         businessDescription: "Leading tech solutions provider",
        //       },
        //       socialProfile: [],
        //     }]
        //   }
        // };

        console.log("Loading profile response data...", response);
        
        if (response && response.data) {
          const profileData = response.data?.results[0];

          console.log("Profile data loaded:", profileData);
          this.profile = {
            id: profileData.id,
            userName: profileData.userName || "Unknown User",
            isPublic: profileData.isPublic || false,
            category: profileData.category || "",
            title: profileData.title || "",
            description: profileData.description || "",
            email: profileData.email || "",
            areConnected: profileData.areConnected || false,
            canSendRequest: profileData.canSendRequest !== false,
            channels: profileData.channels || [], // Store channels array
            businessDetails: {
              title: profileData.businessDetails?.title || "",
              description: profileData.businessDetails?.description || "",
              website: profileData.businessDetails?.website || "",
              businessDescription: profileData.businessDetails?.businessDescription || "",
            },
            socialProfile: profileData.socialProfile || [],
            skills: [],
          };

          // Load contact information
          const contactResponse = await this.loadContact();
          console.log("Contact data loaded:", contactResponse);

          // Store contact data from API response
          if (contactResponse?.data?.results && Array.isArray(contactResponse.data.results)) {
            this.contactData = contactResponse.data.results;
          } else {
            // Contact API returned null or invalid data
            this.contactData = [];
          }

          console.log("Final contact data:", this.contactData);
          console.log("Profile channels:", this.profile.channels);
          console.log("Has actual contact data:", this.hasActualContactData);
          console.log("Has contact options:", this.hasContactOptions);
          console.log("Is connected:", this.isConnected);

          // Load connection status
          await this.loadConnectionStatus();
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      this.apiLoading = false;
    },
    
    async loadConnectionStatus() {
      console.log("Loading connection status...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // For testing - you can change this to test different states
      // this.connectionStatus = 'connected'; // Enable this to test contact visibility
    },
    
    async connect(professionalId) {
      this.connectingIds.push(professionalId);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.connectionStatus = "pending";
        this.profile.canSendRequest = false;
        console.log("Connection request sent successfully");
      } catch (error) {
        console.error("Error sending connection request:", error);
      } finally {
        this.connectingIds = this.connectingIds.filter((userId) => userId !== professionalId);
      }
    },
    
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    },
    
    getContactIcon(provider) {
      switch (provider?.toLowerCase()) {
        case "whatsapp":
          return "Smartphone";
        case "mobile":
        case "phone":
          return "Phone";
        default:
          return "MessageSquare";
      }
    },
  },
};
</script>



<style scoped>


.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card,
.contact-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-info {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 20px;
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
  flex-shrink: 0;
}

.profile-details {
  flex-grow: 1;
}

.name-status h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
}

.business-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
}

.profile-title {
  color: #555;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.business-tagline {
  color: #666;
  font-size: 1rem;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.business-tagline-block {
  background: #f8f9fa;
  border-left: 2px solid #000;
  padding: 16px 20px;
  margin: 16px 0;
  border-radius: 0 8px 8px 0;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: #333;
  font-style: italic;
}

.quick-info {
  margin: 12px 0 8px 0;
}

.secondary-info {
  margin: 8px 0 0 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  font-size: 1rem;
}

.info-icon {
  color: #666;
  opacity: 0.8;
  flex-shrink: 0;
}

.info-link {
  color: #000;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
  font-size: 1rem;
}

.info-link:hover {
  border-bottom-color: #000;
}

.info-text {
  color: #666;
  line-height: 1.4;
  font-size: 1rem;
}

.name-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header {
  margin-bottom: 30px;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  margin: 0;
}

/* Connection Section Styles - Now at bottom */
.connection-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.connected-badge {
  background: #e8f5e8;
  color: #2d7d2d;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pending-badge {
  display: flex;
  background: #fff4e5;
  color: #d9822b;
  font-size: 0.85rem;
  padding: 11px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  justify-content: center
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

.btn-connect {
  background: #000;
  color: #fff;
  border: 1px solid #000;
}

.btn-connect:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-connect:disabled {
  background: #999;
  color: #fff;
  cursor: not-allowed;
  transform: none;
}

.btn-pending {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  cursor: not-allowed;
}

.btn-connected {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  cursor: not-allowed;
}

/* Contact Section Styles */
.contact-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .contact-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

.contact-option-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-option-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-option-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-option-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f5f5f5;
  color: #666;
}

.contact-option-info {
  flex-grow: 1;
}

.contact-option-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.contact-option-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
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

.btn-whatsapp {
  background: #25d366;
  color: #fff;
}

.btn-whatsapp:hover {
  background: #128c7e;
  transform: translateY(-1px);
}

.btn-disabled {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #e0e0e0;
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none;
  background: #f5f5f5;
}

.blurred-text {
  filter: blur(3px);
  user-select: none;
  pointer-events: none;
}

.disabled-card {
  opacity: 0.6;
}

.disabled-card .contact-option-icon {
  opacity: 0.5;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.empty-state p {
  margin: 0;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .name-status h1 {
    font-size: 1.4rem;
  }

  .business-title {
    font-size: 1.2rem;
  }

  .profile-title {
    font-size: 1rem;
  }

  .business-tagline {
    font-size: 0.95rem;
  }

  .business-tagline-block {
    padding: 14px 16px;
    font-size: 0.95rem;
    margin: 14px 0;
  }

  .info-row {
    font-size: 0.9rem;
  }

  .info-text,
  .info-link {
    font-size: 0.9rem;
  }

  .connection-section {
    justify-content: center;
    padding-top: 16px;
  }

  .btn-connect,
  .btn-pending,
  .btn-connected {
    width: 100%;
    max-width: 200px;
  }

  .connected-badge {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .contact-options {
    grid-template-columns: 1fr;
  }

  .contact-option-header {
    gap: 12px;
  }

  .contact-option-icon {
    width: 40px;
    height: 40px;
  }
}
</style>

<template>
  <div class="contact-card">
    <div class="header">
      <h2>Contact</h2>
      <p>Get in touch with this user</p>
    </div>

    <div class="contact-options">
      <!-- Phone Contact Card -->
      <ContactCard
        title="Phone"
        :number="phoneData.number"
        :linked="phoneData.linked"
        :linking="phoneLinking"
        :icon="Phone"
        :hasVerifiedNumber="phoneData.hasVerifiedNumber"
        @link="() => handleLinking('mobile')"
      />

      <!-- WhatsApp Contact Card -->
      <ContactCard
        title="WhatsApp"
        :number="whatsappData.number"
        :linked="whatsappData.linked"
        :linking="whatsappLinking"
        :icon="MessageSquare"
        :hasVerifiedNumber="whatsappData.hasVerifiedNumber"
        @link="() => handleLinking('whatsapp')"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { Phone, MessageSquare } from "lucide-vue";
import ContactCard from "./ContactCard.vue";
import { getRequiredProvider } from "../api/profileCreate";
import { APP_CONNECT_URL } from "../constants/constants";

export default {
  name: "ContactSection",
  components: { ContactCard, Phone, MessageSquare },
  props: {
    socialProfile: {
      type: Array,
      default: () => [],
    },
    saveProfile: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const phoneLinked = ref(false);
    const whatsappLinked = ref(false);
    const phoneLinking = ref(false);
    const whatsappLinking = ref(false);
    const availableProviders = ref([]);

    // Load available providers on mount
    const loadAvailableProviders = async () => {
      try {
        const response = await getRequiredProvider();
        const providerData = response.data.results[0];
        availableProviders.value = providerData.profile || [];
      } catch (error) {
        console.error("Error loading available providers:", error);
        availableProviders.value = [];
      }
    };

    const phoneData = computed(() => {
      // First check if it's already linked in socialProfile
      const linkedProfile = props.socialProfile?.find((profile) => profile.provider === "mobile");
      if (linkedProfile) {
        return {
          number: linkedProfile.phone || "No phone number available",
          linked: true,
          hasVerifiedNumber: true,
        };
      }

      // Then check if it's available but not linked yet
      const availableProfile = availableProviders.value?.find((profile) => profile.provider === "mobile");
      if (availableProfile) {
        return {
          number: availableProfile.phone || "Phone number verified",
          linked: false,
          hasVerifiedNumber: true,
        };
      }

      return {
        number: "Phone not verified",
        linked: false,
        hasVerifiedNumber: false,
      };
    });

    const whatsappData = computed(() => {
      // First check if it's already linked in socialProfile
      const linkedProfile = props.socialProfile?.find((profile) => profile.provider === "whatsapp");
      if (linkedProfile) {
        return {
          number: linkedProfile.phone || "No phone number available",
          linked: true,
          hasVerifiedNumber: true,
        };
      }

      // Then check if it's available but not linked yet
      const availableProfile = availableProviders.value?.find((profile) => profile.provider === "whatsapp");
      if (availableProfile) {
        return {
          number: availableProfile.phone || "WhatsApp number verified",
          linked: false,
          hasVerifiedNumber: true,
        };
      }

      return {
        number: "WhatsApp not verified",
        linked: false,
        hasVerifiedNumber: false,
      };
    });

    const handleLinking = async (provider) => {
      try {
        // Set linking state based on provider
        if (provider === "mobile") {
          phoneLinking.value = true;
        } else if (provider === "whatsapp") {
          whatsappLinking.value = true;
        }

        // Check if we have a verified number for this provider
        const matchingProfile = availableProviders.value?.find((profile) => profile.provider === provider);

        if (matchingProfile) {
          // Provider found and already verified, save the profile
          console.log("Linking verified profile:", matchingProfile);
          await props.saveProfile(matchingProfile.profileUUId);

          // Update linked state
          if (provider === "mobile") {
            phoneLinked.value = true;
          } else if (provider === "whatsapp") {
            whatsappLinked.value = true;
          }
        } else {
          // No verified number found - redirect to verify
          console.log(`${provider} provider not verified, redirecting to verification`);
          window.location.href = `${APP_CONNECT_URL}/${provider}?returnEndPoint=/linq/work/profile`;
        }
      } catch (error) {
        console.error(`Error linking ${provider}:`, error);
        // Handle error appropriately
      } finally {
        // Reset linking state
        if (provider === "mobile") {
          phoneLinking.value = false;
        } else if (provider === "whatsapp") {
          whatsappLinking.value = false;
        }
      }
    };

    // Load available providers when component mounts
    onMounted(() => {
      loadAvailableProviders();
    });

    return {
      Phone,
      MessageSquare,
      phoneLinked,
      whatsappLinked,
      phoneLinking,
      whatsappLinking,
      phoneData,
      whatsappData,
      handleLinking,
    };
  },
};
</script>

<style scoped>
.contact-card {
  max-width: 800px;
  margin: 0 auto;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.header {
  text-align: left;
  margin-bottom: 32px;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  margin: 0 0 8px 0;
  color: #333;
}

.header p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

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

.status-linked {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #25d366;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  justify-content: center;
}

.status-linked-whatsapp {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #25d366;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #999;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

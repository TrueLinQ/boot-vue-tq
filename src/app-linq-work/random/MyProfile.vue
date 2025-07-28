<template>
  <div class="container">
    <div v-if="profileError" class="profile-error">
      <button @click="goToCreateProfile" class="btn btn-primary create-profile-btn">
        <span>Join as Professional</span>
         <ArrowRight :size="16" style="display: inline; vertical-align: middle; margin-left: 6px;" />
      </button>
      <p class="error-text">You don't have a profile yet.<br/> Please create one.</p>
    </div>

    <div v-else class="profile-card">
      <div class="profile-header">
        <div class="profile-info">
          <div style="display: flex; align-items: center; margin-bottom: 16px">
            <div class="avatar">{{ getInitials(profile.userName) }}</div>
            <div class="name-status">
              <h1>{{ profile.userName }}</h1>
            </div>
          </div>
          <div class="button-group">
            <button
              @click="isEditing ? saveProfile() : toggleEditMode()"
              :class="['btn', isEditing ? 'btn-primary' : 'btn-secondary']"
              :disabled="isSaving"
            >
              <template v-if="isSaving"> Saving... </template>
              <template v-else-if="isEditing"> Save </template>
              <template v-else> Edit Profile </template>
            </button>
            <button v-if="isEditing" @click="cancelEdit" class="btn btn-secondary btn-cancel" :disabled="isSaving">
              Cancel
            </button>
          </div>
        </div>

        <div class="profile-details">
          <div class="inline-edit-group privacy-section">
            <div class="privacy-toggle-inline">
              <div class="privacy-info">
                <div class="privacy-title">
                  <component
                    :is="isEditing ? (editProfile.isPublic ? 'Globe' : 'Lock') : profile.isPublic ? 'Globe' : 'Lock'"
                    class="privacy-icon"
                    :style="{ color: (isEditing ? editProfile.isPublic : profile.isPublic) ? 'green' : 'red' }"
                    :size="16"
                  />
                  {{
                    isEditing
                      ? editProfile.isPublic
                        ? "Public Profile"
                        : "Private Profile"
                      : profile.isPublic
                      ? "Public Profile"
                      : "Private Profile"
                  }}
                </div>
                <p class="privacy-subtitle">
                  {{
                    isEditing
                      ? editProfile.isPublic
                        ? "Your profile will be visible to everyone"
                        : "Only people with direct access can view your profile"
                      : profile.isPublic
                      ? "Your profile is visible to everyone"
                      : "Only people with direct access can view your profile"
                  }}
                </p>
              </div>
              <label v-if="isEditing" class="toggle">
                <input type="checkbox" v-model="editProfile.isPublic" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Business Title -->
          <h2 class="business-title" v-if="profile.businessDetails?.title">
            {{ profile.businessDetails.title }}
          </h2>

          <!-- Profile Title (if different from business title) -->
          <p class="profile-title" v-if="profile.title && profile.title !== profile.businessDetails?.title">
            {{ profile.title }}
          </p>

          <!-- Business Description (Short) - Inline Edit -->
          <div class="inline-edit-group">
            <div v-if="!isEditing" class="business-tagline">
              {{ profile.description || "Click Edit Profile to add description..." }}
            </div>
            <div v-else class="edit-field">
              <textarea
                ref="descriptionTextarea"
                v-model="editProfile.description"
                rows="3"
                class="inline-textarea"
                placeholder="Tell us about your business and expertise..."
              ></textarea>
            </div>
          </div>

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

            <div class="info-row" v-if="profile.socialProfile && profile.socialProfile.length > 0">
              <component :is="getContactIcon(profile.socialProfile[0].provider)" class="info-icon" :size="16" />
              <span class="info-text">{{ profile.socialProfile[0].phone }}</span>
            </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, updateProfile } from "../api/profileCreate";
import { MessageSquare, Phone, Globe, Lock, Smartphone, Tag, MapPin, Edit2, ArrowRight } from "lucide-vue";

export default {
  name: "MyProfile",
  components: {
    MessageSquare,
    Smartphone,
    ArrowRight,
    Phone,
    Globe,
    Lock,
    Tag,
    MapPin,
    Edit2,
  },
  data() {
    return {
      isEditing: false,
      isSaving: false,
      profileError: false,
      profile: {
        id: "",
        userName: "",
        isPublic: true,
        category: "",
        title: "",
        description: "",
        businessDetails: {
          title: "",
          description: "",
          website: "",
          businessDescription: "",
        },
        socialProfile: [],
        skills: [],
      },
      editProfile: {},
    };
  },

  async mounted() {
    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      console.log("Loading profile data...");
      try {
        const response = await getProfile();
        console.log("Loading profile response data...", response);
        if (response && response.data) {
          const profileData = response.data?.results[0];

          if (!profileData) {
            // No profile found
            this.profileError = true;
            return;
          }

          console.log("Profile data loaded:", profileData);
          this.profile = {
            id: profileData.id,
            userId: profileData.userId,
            userName: profileData.userName || "Unknown User",
            isPublic: profileData.isPublic || false,
            category: profileData.category || "",
            title: profileData.title || "",
            description: profileData.description || "",
            businessDetails: {
              title: profileData.businessDetails?.title || "",
              description: profileData.businessDetails?.description || "",
              website: profileData.businessDetails?.website || "",
              businessDescription: profileData.businessDetails?.businessDescription || "",
            },
            socialProfile: profileData.socialProfile || [],
            skills: [],
          };

          this.profileError = false; // Reset error state
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        this.profileError = true;
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
        case "phone":
          return "Phone";
        default:
          return "MessageSquare";
      }
    },

    goToCreateProfile() {
      // Add your navigation logic here
      // e.g., this.$router.push('/create-profile');
      console.log("Navigate to create profile");
    },

    toggleEditMode() {
      this.isEditing = true;
      this.editProfile = JSON.parse(JSON.stringify(this.profile));

      console.log("Edit mode enabled. Current profile data:", this.editProfile);
      this.$nextTick(() => {
        this.focusDescription();
      });
    },

    focusDescription() {
      if (this.$refs.descriptionTextarea) {
        this.$refs.descriptionTextarea.focus();
      }
    },

    async saveProfile() {
      this.isSaving = true;
      try {
        const updateData = {
          description: this.editProfile.description,
          id: this.profile.id,
          isPublic: this.editProfile.isPublic,
          profileIds: this.editProfile.socialProfile.map((profile) => profile.profileUUId),
        };

        const response = await updateProfile(updateData);
        console.log("Profile update response:", response);

        this.profile = JSON.parse(JSON.stringify(this.editProfile));
        this.isEditing = false;
        this.editProfile = {};
        console.log("Profile saved:", this.profile);
      } catch (error) {
        console.error("Error saving profile:", error);
      } finally {
        this.isSaving = false;
      }
    },

    cancelEdit() {
      this.isEditing = false;
      this.editProfile = {};
    },
  },
};
</script>

<style scoped>
.profile-error {
  text-align: center;
  padding: 60px 20px;
}

.create-profile-btn {
  font-size: 0.9rem;
  padding: 12px 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.error-text {
  color: #666;
  font-size: 1rem;
  margin: 1rem auto;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
.profile-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-direction: column;
}

.profile-info {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
  width: 100%;
}

.name-status h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.name-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-status h1 {
  font-size: 1.5rem;
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

/* Inline Edit Group Styles */
.inline-edit-group {
  position: relative;
  margin-bottom: 16px;
}

.inline-edit-group .edit-field {
  width: 100%;
}

.inline-edit-group .inline-textarea {
  width: 100%;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.4;
  resize: vertical;
  outline: none;
  min-height: 80px;
  transition: border-color 0.2s ease;
}

.inline-edit-group .inline-textarea::placeholder {
  color: #999;
}

/* Privacy Toggle Inline Styles */
.privacy-toggle-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}

.privacy-info {
  flex-grow: 1;
}

.privacy-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1rem;
}

.privacy-icon {
  flex-shrink: 0;
}

.privacy-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.3;
}

/* Button Group Improvements */
.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
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

.btn-cancel {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  color: #000;
  border-color: #bbb;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn:disabled:hover {
  transform: none;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  margin-right: 8px;
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

  .privacy-toggle-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .button-group {
    width: 100%;
  }

  .button-group .btn {
    flex: 1;
    min-width: 0;
  }

  .inline-edit-group .inline-textarea {
    font-size: 0.95rem;
    padding: 10px 14px;
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-info {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .btn {
    width: 100%;
  }
}
</style>

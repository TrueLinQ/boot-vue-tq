<template>
  <div class="app">
    <FullScreenLoader v-if="apiLoading" />

    <div v-else class="container">
      <div v-if="profileError" class="profile-error">
        <button @click="goToCreateProfile" class="btn btn-primary create-profile-btn">
          <span>Join as Professional</span>
          <ArrowRight :size="16" style="display: inline; vertical-align: middle; margin-left: 6px" />
        </button>
        <p class="error-text">
          You don't have a profile yet.<br />
          Please create one.
        </p>
      </div>

      <!-- Profile Header Section -->
      <div v-else class="profile-header-section" F>
        <div class="profile-card">
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
                        :is="
                          isEditing ? (editProfile.isPublic ? 'Globe' : 'Lock') : profile.isPublic ? 'Globe' : 'Lock'
                        "
                        class="privacy-icon"
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

        <!-- Connections Section -->
        <div class="connections-card">
          <div class="header">
            <h2>Connections</h2>
            <p>Manage your professional network</p>
          </div>

          <!-- Connection Tabs -->
          <div class="tabs-container">
            <button
              v-for="tab in connectionTabs"
              :key="tab.key"
              @click="switchTab(tab.key)"
              :class="['tab-button', activeTab === tab.key ? 'tab-active' : '']"
            >
              {{ tab.label }} {{ getConnectionCount(tab.key) }}
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingConnections" class="loading-state">
            <p>Loading connections...</p>
          </div>

          <!-- Accepted Connections -->
          <div v-else-if="activeTab === 'accepted'">
            <div v-if="connections.accepted.length === 0" class="empty-state">
              <p>No connections yet</p>
            </div>
            <div v-else>
              <div class="connections-grid">
                <div v-for="connection in connections.accepted" :key="connection.userId" class="connection-card">
                  <div class="connection-header">
                    <div class="connection-avatar">
                      <img
                        v-if="connection.picture"
                        :src="connection.picture"
                        :alt="connection.name"
                        class="avatar-image"
                      />
                      <span v-else class="avatar-text">{{ getInitials(connection.name) }}</span>
                    </div>
                    <div class="connection-info">
                      <h4>{{ connection.name }}</h4>
                      <p class="connection-email" v-if="connection.email">{{ connection.email }}</p>
                      <p class="connection-mobile" v-if="connection.mobile">{{ connection.mobile }}</p>
                    </div>
                  </div>
                  <p class="connection-description" v-if="connection.message">{{ connection.message }}</p>
                  <div class="connection-actions">
                    <button class="btn btn-primary">Message</button>
                    <button class="btn btn-secondary">View</button>
                  </div>
                </div>
              </div>

              <!-- Load More Button for Accepted -->
              <div v-if="canLoadMoreAccepted" class="load-more-container">
                <button @click="loadMoreAccepted" :disabled="isLoadingMore" class="btn btn-secondary load-more-btn">
                  <template v-if="isLoadingMore">Loading...</template>
                  <template v-else>Load More</template>
                </button>
              </div>
            </div>
          </div>

          <!-- Pending Connections -->
          <div v-else-if="activeTab === 'pending'">
            <div v-if="connections.pending.length === 0" class="empty-state">
              <p>No pending requests</p>
            </div>
            <div v-else>
              <div class="connections-grid">
                <div v-for="connection in connections.pending" :key="connection.userId" class="connection-card pending">
                  <div class="connection-header">
                    <div class="connection-avatar">
                      <img
                        v-if="connection.picture"
                        :src="connection.picture"
                        :alt="connection.name"
                        class="avatar-image"
                      />
                      <span v-else class="avatar-text">{{ getInitials(connection.name) }}</span>
                    </div>
                    <div class="connection-info">
                      <h4>{{ connection.name }}</h4>
                      <p class="connection-email" v-if="connection.email">{{ connection.email }}</p>
                      <p class="connection-mobile" v-if="connection.mobile">{{ connection.mobile }}</p>
                    </div>
                  </div>
                  <p class="connection-description" v-if="connection.message">{{ connection.message }}</p>
                  <div class="connection-actions">
                    <button
                      @click="acceptConnection(connection.userId)"
                      :disabled="processingConnections.has(connection.userId)"
                      class="btn btn-primary"
                    >
                      <template v-if="processingConnections.has(connection.userId)">Processing...</template>
                      <template v-else>Accept</template>
                    </button>
                    <button
                      @click="rejectConnection(connection.userId)"
                      :disabled="processingConnections.has(connection.userId)"
                      class="btn btn-secondary"
                    >
                      <template v-if="processingConnections.has(connection.userId)">Processing...</template>
                      <template v-else>Reject</template>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Load More Button for Pending -->
              <div v-if="canLoadMorePending" class="load-more-container">
                <button @click="loadMorePending" :disabled="isLoadingMore" class="btn btn-secondary load-more-btn">
                  <template v-if="isLoadingMore">Loading...</template>
                  <template v-else>Load More</template>
                </button>
              </div>
            </div>
          </div>

          <!-- Rejected Connections -->
          <div v-else-if="activeTab === 'rejected'">
            <div v-if="connections.rejected.length === 0" class="empty-state">
              <p>No rejected connections</p>
            </div>
            <div v-else>
              <div class="connections-grid">
                <div
                  v-for="connection in connections.rejected"
                  :key="connection.userId"
                  class="connection-card rejected"
                >
                  <div class="connection-header">
                    <div class="connection-avatar">
                      <img
                        v-if="connection.picture"
                        :src="connection.picture"
                        :alt="connection.name"
                        class="avatar-image"
                      />
                      <span v-else class="avatar-text">{{ getInitials(connection.name) }}</span>
                    </div>
                    <div class="connection-info">
                      <h4>{{ connection.name }}</h4>
                      <p class="connection-email" v-if="connection.email">{{ connection.email }}</p>
                      <p class="connection-mobile" v-if="connection.mobile">{{ connection.mobile }}</p>
                    </div>
                  </div>
                  <p class="connection-description" v-if="connection.message">{{ connection.message }}</p>
                  <div class="connection-actions">
                    <button
                      @click="reconsiderConnection(connection.userId)"
                      :disabled="processingConnections.has(connection.userId)"
                      class="btn btn-secondary"
                    >
                      <template v-if="processingConnections.has(connection.userId)">Processing...</template>
                      <template v-else>Reconsider</template>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Load More Button for Rejected -->
              <div v-if="canLoadMoreRejected" class="load-more-container">
                <button @click="loadMoreRejected" :disabled="isLoadingMore" class="btn btn-secondary load-more-btn">
                  <template v-if="isLoadingMore">Loading...</template>
                  <template v-else>Load More</template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, updateProfile } from "../api/profileCreate";
import { getConnectionRequests, getAcceptedConnections, respondToConnectionRequest } from "../api/myConnections";
import { MessageSquare, Phone, Globe, Lock, Smartphone, Tag, MapPin, Edit2, ArrowRight } from "lucide-vue";
import FullScreenLoader from "../components/Loader.vue";

export default {
  name: "ProfileSection",
  components: {
    MessageSquare,
    Smartphone,
    Phone,
    Globe,
    Lock,
    Tag,
    MapPin,
    Edit2,
    ArrowRight,
    FullScreenLoader,
  },
  data() {
    return {
      isEditing: false,
      activeTab: "accepted",
      isSaving: false,
      isLoadingConnections: false,
      isLoadingMore: false,
      processingConnections: new Set(),

      // Page sizes for different connection types
      pageSizes: {
        accepted: 10, // Your test case
        pending: 10,
        rejected: 10,
      },

      // Updated pagination data - startIndex now represents page number
      pagination: {
        accepted: { startIndex: 0, totalCount: 0, hasMore: true },
        pending: { startIndex: 0, totalCount: 0, hasMore: true },
        rejected: { startIndex: 0, totalCount: 0, hasMore: true },
      },

      profile: {
        id: "",
        userName: "",
        isPublic: true,
        category: "",
        title: "",
        description: "",
        profileError: false,
        businessDetails: {
          title: "",
          description: "",
          website: "",
          businessDescription: "",
        },
        socialProfile: [],
        skills: [],
      },
      apiLoading: false,
      editProfile: {},
      connectionTabs: [
        { key: "accepted", label: "Accepted" },
        { key: "pending", label: "Pending" },
        { key: "rejected", label: "Rejected" },
      ],
      connections: {
        accepted: [],
        pending: [],
        rejected: [],
      },
    };
  },

  computed: {
    getConnectionCount() {
      return (type) => {
        const totalCount = this.pagination[type].totalCount;
        return totalCount > 0 ? `(${totalCount})` : "";
      };
    },

    canLoadMoreAccepted() {
      const pageSize = this.pageSizes.accepted;
      const totalPages = Math.ceil(this.pagination.accepted.totalCount / pageSize);
      return this.pagination.accepted.startIndex < totalPages && this.pagination.accepted.hasMore;
    },

    canLoadMorePending() {
      const pageSize = this.pageSizes.pending;
      const totalPages = Math.ceil(this.pagination.pending.totalCount / pageSize);
      return this.pagination.pending.startIndex < totalPages && this.pagination.pending.hasMore;
    },

    canLoadMoreRejected() {
      const pageSize = this.pageSizes.rejected;
      const totalPages = Math.ceil(this.pagination.rejected.totalCount / pageSize);
      return this.pagination.rejected.startIndex < totalPages && this.pagination.rejected.hasMore;
    },
  },

  async mounted() {
    await this.loadProfile();
    await this.loadConnections();
  },

  methods: {
    goToCreateProfile() {
      this.$router.push("/create");
    },

    async loadProfile() {
      this.apiLoading = true;
      console.log("Loading profile data...");
      try {
        const response = await getProfile();
        console.log("Loading profile response data...", response);
        if (response && response.data) {
          const profileData = response.data?.results[0];

          if (!profileData) {
            console.error("No profile data found");
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
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        this.profileError = true;
      } finally {
        this.apiLoading = false;
      }
    },

    async loadConnections() {
      this.isLoadingConnections = true;
      try {
        // Load accepted connections
        await this.loadAcceptedConnections(true);
        // Load pending connections
        await this.loadPendingConnections(true);
        // Load rejected connections
        await this.loadRejectedConnections(true);
      } catch (error) {
        console.error("Error loading connections:", error);
      } finally {
        this.isLoadingConnections = false;
      }
    },

    async loadAcceptedConnections(reset = false) {
      try {
        // For reset, start from page 0. For load more, use current page number
        const startIndex = reset ? 0 : this.pagination.accepted.startIndex;

        const response = await getAcceptedConnections({
          type: "professional",
          pageSize: this.pageSizes.accepted,
          startIndex, // This is now the page number (0, 1, 2, ...)
        });

        if (response?.data?.results?.[0]) {
          const { connections, totalSize } = response.data.results[0];

          if (reset) {
            // Initial load - replace data and reset pagination
            this.connections.accepted = connections || [];
            this.pagination.accepted.startIndex = 1; // Next page will be 1
            this.pagination.accepted.hasMore = true;
          } else {
            // Load more - append data and increment page
            this.connections.accepted.push(...(connections || []));
            this.pagination.accepted.startIndex += 1; // Move to next page
          }

          // Update total count and hasMore status
          this.pagination.accepted.totalCount = totalSize || 0;

          // Check if we have more data to load
          const receivedItems = (connections || []).length;
          const expectedPageSize = this.pageSizes.accepted;
          if (receivedItems === 0 || receivedItems < expectedPageSize) {
            this.pagination.accepted.hasMore = false;
          }
        }
      } catch (error) {
        console.error("Error loading accepted connections:", error);
        // On error, don't increment page for load more
        if (!reset) {
          this.pagination.accepted.hasMore = false;
        }
      }
    },

    async loadPendingConnections(reset = false) {
      try {
        const startIndex = reset ? 0 : this.pagination.pending.startIndex;

        const response = await getConnectionRequests({
          ignored: false,
          type: "professional",
          pageSize: this.pageSizes.pending,
          startIndex,
        });

        if (response?.data?.results?.[0]) {
          const { connections, totalSize } = response.data.results[0];

          if (reset) {
            this.connections.pending = connections || [];
            this.pagination.pending.startIndex = 1;
            this.pagination.pending.hasMore = true;
          } else {
            this.connections.pending.push(...(connections || []));
            this.pagination.pending.startIndex += 1;
          }

          this.pagination.pending.totalCount = totalSize || 0;

          const receivedItems = (connections || []).length;
          const expectedPageSize = this.pageSizes.pending;
          if (receivedItems === 0 || receivedItems < expectedPageSize) {
            this.pagination.pending.hasMore = false;
          }
        }
      } catch (error) {
        console.error("Error loading pending connections:", error);
        if (!reset) {
          this.pagination.pending.hasMore = false;
        }
      }
    },

    async loadRejectedConnections(reset = false) {
      try {
        const startIndex = reset ? 0 : this.pagination.rejected.startIndex;

        const response = await getConnectionRequests({
          ignored: true,
          type: "professional",
          pageSize: this.pageSizes.rejected,
          startIndex,
        });

        if (response?.data?.results?.[0]) {
          const { connections, totalSize } = response.data.results[0];

          if (reset) {
            this.connections.rejected = connections || [];
            this.pagination.rejected.startIndex = 1;
            this.pagination.rejected.hasMore = true;
          } else {
            this.connections.rejected.push(...(connections || []));
            this.pagination.rejected.startIndex += 1;
          }

          this.pagination.rejected.totalCount = totalSize || 0;

          const receivedItems = (connections || []).length;
          if (receivedItems === 0 || receivedItems < 10) {
            this.pagination.rejected.hasMore = false;
          }
        }
      } catch (error) {
        console.error("Error loading rejected connections:", error);
        if (!reset) {
          this.pagination.rejected.hasMore = false;
        }
      }
    },

    async switchTab(tabKey) {
      this.activeTab = tabKey;

      // Load data if not already loaded for this tab
      if (tabKey === "accepted" && this.connections.accepted.length === 0) {
        await this.loadAcceptedConnections(true);
      } else if (tabKey === "pending" && this.connections.pending.length === 0) {
        await this.loadPendingConnections(true);
      } else if (tabKey === "rejected" && this.connections.rejected.length === 0) {
        await this.loadRejectedConnections(true);
      }
    },

    async loadMoreAccepted() {
      if (!this.canLoadMoreAccepted) return;

      this.isLoadingMore = true;
      try {
        await this.loadAcceptedConnections(false);
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadMorePending() {
      if (!this.canLoadMorePending) return;

      this.isLoadingMore = true;
      try {
        await this.loadPendingConnections(false);
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadMoreRejected() {
      if (!this.canLoadMoreRejected) return;

      this.isLoadingMore = true;
      try {
        await this.loadRejectedConnections(false);
      } finally {
        this.isLoadingMore = false;
      }
    },

    async acceptConnection(userId) {
      this.processingConnections.add(userId);
      try {
        await respondToConnectionRequest(userId, true, "professional");

        // Move connection from pending to accepted
        const connectionIndex = this.connections.pending.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.pending[connectionIndex];
          this.connections.pending.splice(connectionIndex, 1);
          this.connections.accepted.unshift(connection);

          // Update counts
          this.pagination.pending.totalCount--;
          this.pagination.accepted.totalCount++;
        }
      } catch (error) {
        console.error("Error accepting connection:", error);
      } finally {
        this.processingConnections.delete(userId);
      }
    },

    async rejectConnection(userId) {
      this.processingConnections.add(userId);
      try {
        await respondToConnectionRequest(userId, false, "professional");

        // Move connection from pending to rejected
        const connectionIndex = this.connections.pending.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.pending[connectionIndex];
          this.connections.pending.splice(connectionIndex, 1);
          this.connections.rejected.unshift(connection);

          // Update counts
          this.pagination.pending.totalCount--;
          this.pagination.rejected.totalCount++;
        }
      } catch (error) {
        console.error("Error rejecting connection:", error);
      } finally {
        this.processingConnections.delete(userId);
      }
    },

    async reconsiderConnection(userId) {
      this.processingConnections.add(userId);
      try {
        // For reconsidering, we might need to call accept API again
        await respondToConnectionRequest(userId, true, "professional");

        // Move connection from rejected to accepted
        const connectionIndex = this.connections.rejected.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.rejected[connectionIndex];
          this.connections.rejected.splice(connectionIndex, 1);
          this.connections.accepted.unshift(connection);

          // Update counts
          this.pagination.rejected.totalCount--;
          this.pagination.accepted.totalCount++;
        }
      } catch (error) {
        console.error("Error reconsidering connection:", error);
      } finally {
        this.processingConnections.delete(userId);
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

    formatProvider(provider) {
      if (!provider) return "Contact";
      return provider.charAt(0).toUpperCase() + provider.slice(1);
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

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 50%;
  font-weight: bold;
  color: #333;
}

.connection-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.connection-email,
.connection-mobile {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
}

.load-more-btn {
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connection-card.pending {
  border-left: 4px solid #ffa500;
}

.connection-card.rejected {
  border-left: 4px solid #ff6b6b;
  opacity: 0.8;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card,
.connections-card {
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
  /* flex-grow: 1; */
  width: 100%;
}

/* Update these styles */

.name-status h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.status-container {
  display: flex;
  align-items: center;
}

.status-icon {
  flex-shrink: 0;
}

.status-icon.public {
  color: #4ade80;
}

.status-icon.private {
  color: #888;
}

.privacy-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
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

  .info-row {
    font-size: 0.9rem;
  }

  .info-text,
  .info-link {
    font-size: 0.9rem;
  }

  .privacy-label {
    font-size: 0.8rem;
  }
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

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  /* text-transform: uppercase; */
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 12px;
}

.bio-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
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
}

.skill-tag.readonly {
  cursor: default;
  background: #f8f8f8;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-method {
  /* background: #000; */
  color: #000000;
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

.tabs-container {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.tab-button {
  padding: 12px 0;
  margin-right: 32px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #000;
}

.tab-button.tab-active {
  color: #000;
  border-bottom-color: #000;
}

.connections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .connections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.connection-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.connection-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.connection-card.pending {
  background: #f9f9f9;
  border-color: #d0d0d0;
}

.connection-card.rejected {
  opacity: 0.7;
  background: #f5f5f5;
}

.connection-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.connection-avatar {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 16px;
  flex-shrink: 0;
}

.connection-info {
  flex-grow: 1;
}

.connection-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.connection-profession {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.connection-description {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.connection-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.empty-state p {
  margin: 0;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.textarea {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.textarea:focus {
  outline: none;
  border-color: #000;
}

.textarea::placeholder {
  color: #999;
}

.privacy-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8f8f8;
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

.button-row {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .button-row {
    flex-direction: column;
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

/* //new */
/* Add these styles to your existing CSS */

.privacy-label {
  color: #666;
  font-size: 0.8rem;
  margin-left: 8px;
  text-transform: capitalize;
}

.business-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin: 8px 0 4px 0;
}

.profile-title {
  color: #555;
  font-size: 1rem;
  font-weight: 500;
  margin: 4px 0;
}

.business-tagline {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 8px 0 16px 0;
}

/* Replace the previous quick-info and info-item styles with these */

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
  margin: 6px 0;
  font-size: 0.9rem;
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
}

.info-link:hover {
  border-bottom-color: #000;
}

.info-text {
  color: #666;
  line-height: 1.4;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .info-row {
    font-size: 0.85rem;
    gap: 8px;
  }

  .quick-info {
    margin: 16px 0 8px 0;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .business-title {
    font-size: 1.1rem;
  }

  .quick-info {
    margin-top: 16px;
  }

  .info-item {
    font-size: 0.85rem;
  }
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

/* Mobile responsive */
@media (max-width: 600px) {
  .business-tagline-block {
    padding: 14px 16px;
    font-size: 0.95rem;
    margin: 14px 0;
  }
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

/* .inline-edit-group .inline-textarea:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
} */

.inline-edit-group .inline-textarea::placeholder {
  color: #999;
}

/* Edit Icon Positioning */
.edit-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 10;
}

.edit-icon:hover {
  color: #000;
}

/* .privacy-edit-icon {
  top: 50%;
  transform: translateY(-50%);
  right: 70px; /* Adjust based on toggle width */
/* } */

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

/* Responsive Adjustments */
@media (max-width: 600px) {
  .privacy-toggle-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .privacy-edit-icon {
    right: 12px;
    top: 12px;
    transform: none;
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
}
</style>

<template>
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
          <div v-for="connection in connections.accepted" :key="connection.userId" class="connection-card connected">
            <div class="connection-header">
              <div class="connection-avatar">
                <img v-if="connection.picture" :src="connection.picture" :alt="connection.name" class="avatar-image" />
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
                v-if="connection.professionalProfileId"
                @click="viewProfile(connection.professionalProfileId)"
                class="btn btn-primary"
              >
                View
              </button>
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
                <img v-if="connection.picture" :src="connection.picture" :alt="connection.name" class="avatar-image" />
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
                v-if="connection.professionalProfileId"
                @click="viewProfile(connection.professionalProfileId)"
                class="btn btn-primary"
              >
                View
              </button>
              <button
                @click="acceptConnection(connection.userId)"
                :disabled="processingConnections.has(connection.userId)"
                class="btn btn-secondary"
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
          <div v-for="connection in connections.rejected" :key="connection.userId" class="connection-card rejected">
            <div class="connection-header">
              <div class="connection-avatar">
                <img v-if="connection.picture" :src="connection.picture" :alt="connection.name" class="avatar-image" />
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
                v-if="connection.professionalProfileId"
                @click="viewProfile(connection.professionalProfileId)"
                class="btn btn-primary"
              >
                View
              </button>
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
</template>

<script>
import { getConnectionRequests, getAcceptedConnections, respondToConnectionRequest } from "../api/myConnections";

export default {
  name: "ConnectionsModule",

  data() {
    return {
      activeTab: "accepted",
      isLoadingConnections: false,
      isLoadingMore: false,
      processingConnections: new Set(),

      // Page sizes for different connection types
      pageSizes: {
        accepted: 10,
        pending: 10,
        rejected: 10,
      },

      // Pagination data - startIndex represents page number
      pagination: {
        accepted: { startIndex: 0, totalCount: 0, hasMore: true },
        pending: { startIndex: 0, totalCount: 0, hasMore: true },
        rejected: { startIndex: 0, totalCount: 0, hasMore: true },
      },

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
    await this.loadConnections();
  },

  methods: {
    async loadConnections() {
      this.isLoadingConnections = true;
      try {
        await this.loadAcceptedConnections(true);
        await this.loadPendingConnections(true);
        await this.loadRejectedConnections(true);
      } catch (error) {
        console.error("Error loading connections:", error);
      } finally {
        this.isLoadingConnections = false;
      }
    },

    async loadAcceptedConnections(reset = false) {
      try {
        const startIndex = reset ? 0 : this.pagination.accepted.startIndex;

        const response = await getAcceptedConnections({
          type: "professional",
          pageSize: this.pageSizes.accepted,
          startIndex,
        });

        if (response?.data?.results?.[0]) {
          const { connections, totalSize } = response.data.results[0];

          if (reset) {
            this.connections.accepted = connections || [];
            this.pagination.accepted.startIndex = 1;
            this.pagination.accepted.hasMore = true;
          } else {
            this.connections.accepted.push(...(connections || []));
            this.pagination.accepted.startIndex += 1;
          }

          this.pagination.accepted.totalCount = totalSize || 0;

          const receivedItems = (connections || []).length;
          const expectedPageSize = this.pageSizes.accepted;
          if (receivedItems === 0 || receivedItems < expectedPageSize) {
            this.pagination.accepted.hasMore = false;
          }
        }
      } catch (error) {
        console.error("Error loading accepted connections:", error);
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

        const connectionIndex = this.connections.pending.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.pending[connectionIndex];
          this.connections.pending.splice(connectionIndex, 1);
          this.connections.accepted.unshift(connection);

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

        const connectionIndex = this.connections.pending.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.pending[connectionIndex];
          this.connections.pending.splice(connectionIndex, 1);
          this.connections.rejected.unshift(connection);

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
        await respondToConnectionRequest(userId, true, "professional");

        const connectionIndex = this.connections.rejected.findIndex((c) => c.userId === userId);
        if (connectionIndex !== -1) {
          const connection = this.connections.rejected[connectionIndex];
          this.connections.rejected.splice(connectionIndex, 1);
          this.connections.accepted.unshift(connection);

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

    viewProfile(professionalProfileId) {
      this.$router.push(`/profile/${professionalProfileId}`);
    },
  },
};
</script>

<style scoped>
.connections-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
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

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.empty-state p {
  margin: 0;
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

.connection-card.connected {
  border-left: 4px solid #4caf50;
}

.connection-card.pending {
  border-left: 4px solid #ffa500;
}

.connection-card.rejected {
  border-left: 4px solid #ff6b6b;
  opacity: 0.8;
}

.connection-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.connection-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 16px;
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

.connection-info {
  flex-grow: 1;
}

.connection-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.connection-email,
.connection-mobile {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
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

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
}

.load-more-btn {
  min-width: 120px;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
  background: #000;
}

.btn-secondary:disabled:hover {
  background: transparent;
  border-color: #e0e0e0;
}

@media (max-width: 600px) {
  .tabs-container {
    overflow-x: auto;
  }

  .tab-button {
    margin-right: 20px;
    white-space: nowrap;
  }

  .connection-actions {
    flex-direction: column;
  }

  .connection-actions .btn {
    width: 100%;
  }
}
</style>

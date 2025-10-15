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
        @click="activeTab = tab.key"
        :class="['tab-button', { 'tab-active': activeTab === tab.key }]"
      >
        {{ tab.label }} {{ getCountBadge(tab.key) }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingConnections" class="loading-state">
      <p>Loading connections...</p>
    </div>

    <!-- Connection List for Active Tab -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="currentConnections.length === 0" class="empty-state">
        <p>{{ emptyStateMessage }}</p>
      </div>

      <!-- Connections Grid -->
      <div v-else>
        <div class="connections-grid">
          <ConnectionCard
            v-for="connection in currentConnections"
            :key="connection.userId"
            :connection="connection"
            :type="activeTab"
            :is-processing="processingConnections.has(connection.userId)"
            @accept="acceptConnection"
            @reject="rejectConnection"
            @reconsider="reconsiderConnection"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="load-more-container">
          <button 
            @click="loadMore" 
            :disabled="isLoadingMore" 
            class="btn btn-secondary load-more-btn"
          >
            {{ isLoadingMore ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConnectionRequests, getAcceptedConnections, respondToConnectionRequest } from "../api/myConnections";
import ConnectionCard from "./ConnectionCard.vue";

export default {
  name: "ConnectionsModule",
  components: { ConnectionCard },
  
  data() {
    return {
      activeTab: "accepted",
      isLoadingConnections: false,
      isLoadingMore: false,
      processingConnections: new Set(),

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

      pagination: {
        accepted: { page: 0, total: 0, hasMore: true },
        pending: { page: 0, total: 0, hasMore: true },
        rejected: { page: 0, total: 0, hasMore: true },
      },

      pageSize: 10,
    };
  },

  computed: {
    // Get connections for the currently active tab
    currentConnections() {
      return this.connections[this.activeTab];
    },

    // Get pagination info for current tab
    currentPagination() {
      return this.pagination[this.activeTab];
    },

    // Check if we can load more connections
    canLoadMore() {
      const { page, total } = this.currentPagination;
      const totalPages = Math.ceil(total / this.pageSize);
      return page < totalPages && this.currentPagination.hasMore;
    },

    // Empty state message based on active tab
    emptyStateMessage() {
      const messages = {
        accepted: "No connections yet",
        pending: "No pending requests",
        rejected: "No rejected connections"
      };
      return messages[this.activeTab];
    },

    // Get count badge for tabs
    getCountBadge() {
      return (type) => {
        const total = this.pagination[type].total;
        return total > 0 ? `(${total})` : "";
      };
    }
  },

  async mounted() {
    await this.loadAllConnections();
  },

  methods: {
    // Load all connection types on mount
    async loadAllConnections() {
      this.isLoadingConnections = true;
      try {
        await Promise.all([
          this.loadConnectionsByType('accepted'),
          this.loadConnectionsByType('pending'),
          this.loadConnectionsByType('rejected')
        ]);
      } catch (error) {
        console.error("Error loading connections:", error);
      } finally {
        this.isLoadingConnections = false;
      }
    },

    // Generic method to load connections by type
    async loadConnectionsByType(type, reset = true) {
      try {
        const page = reset ? 0 : this.pagination[type].page;
        const params = {
          type: "professional",
          pageSize: this.pageSize,
          startIndex: page,
        };

        // Call appropriate API based on type
        let response;
        if (type === 'accepted') {
          response = await getAcceptedConnections(params);
        } else {
          params.ignored = (type === 'rejected');
          response = await getConnectionRequests(params);
        }

        // Process response
        if (response?.data?.results?.[0]) {
          const { connections, totalSize } = response.data.results[0];

          if (reset) {
            this.connections[type] = connections || [];
            this.pagination[type].page = 1;
            this.pagination[type].hasMore = true;
          } else {
            this.connections[type].push(...(connections || []));
            this.pagination[type].page += 1;
          }

          this.pagination[type].total = totalSize || 0;

          // Check if there are more pages
          if (!connections || connections.length < this.pageSize) {
            this.pagination[type].hasMore = false;
          }
        }
      } catch (error) {
        console.error(`Error loading ${type} connections:`, error);
        if (!reset) {
          this.pagination[type].hasMore = false;
        }
      }
    },

    // Load more connections for current tab
    async loadMore() {
      if (!this.canLoadMore) return;

      this.isLoadingMore = true;
      try {
        await this.loadConnectionsByType(this.activeTab, false);
      } finally {
        this.isLoadingMore = false;
      }
    },

    // Move connection between lists
    moveConnection(userId, fromType, toType) {
      const fromIndex = this.connections[fromType].findIndex(c => c.userId === userId);
      if (fromIndex !== -1) {
        const connection = this.connections[fromType][fromIndex];
        this.connections[fromType].splice(fromIndex, 1);
        this.connections[toType].unshift(connection);

        this.pagination[fromType].total--;
        this.pagination[toType].total++;
      }
    },

    // Accept connection request
    async acceptConnection(userId) {
      this.processingConnections.add(userId);
      try {
        await respondToConnectionRequest(userId, true, "professional");
        this.moveConnection(userId, 'pending', 'accepted');
      } catch (error) {
        console.error("Error accepting connection:", error);
      } finally {
        this.processingConnections.delete(userId);
      }
    },

    // Reject connection request
    async rejectConnection(userId) {
      this.processingConnections.add(userId);
      try {
        await respondToConnectionRequest(userId, false, "professional");
        this.moveConnection(userId, 'pending', 'rejected');
      } catch (error) {
        console.error("Error rejecting connection:", error);
      } finally {
        this.processingConnections.delete(userId);
      }
    },

    // Reconsider rejected connection
    async reconsiderConnection(userId) {
      this.processingConnections.add(userId);
      try {
        await respondToConnectionRequest(userId, true, "professional");
        this.moveConnection(userId, 'rejected', 'accepted');
      } catch (error) {
        console.error("Error reconsidering connection:", error);
      } finally {
        this.processingConnections.delete(userId);
      }
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

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
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
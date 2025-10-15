<template>
  <div :class="['connection-card', type]">
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
    
    <p class="connection-description" v-if="connection.message">
      {{ connection.message }}
    </p>
    
    <!-- Actions based on connection type -->
    <div class="connection-actions">
      <template v-if="type === 'accepted'">
        <button class="btn btn-primary">Message</button>
        <button class="btn btn-secondary">View</button>
      </template>
      
      <template v-else-if="type === 'pending'">
        <button 
          @click="$emit('accept', connection.userId)" 
          :disabled="isProcessing" 
          class="btn btn-primary"
        >
          {{ isProcessing ? 'Processing...' : 'Accept' }}
        </button>
        <button 
          @click="$emit('reject', connection.userId)" 
          :disabled="isProcessing" 
          class="btn btn-secondary"
        >
          {{ isProcessing ? 'Processing...' : 'Reject' }}
        </button>
      </template>
      
      <template v-else-if="type === 'rejected'">
        <button 
          @click="$emit('reconsider', connection.userId)" 
          :disabled="isProcessing" 
          class="btn btn-secondary"
        >
          {{ isProcessing ? 'Processing...' : 'Reconsider' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConnectionCard",
  
  props: {
    connection: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['accepted', 'pending', 'rejected'].includes(value)
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['accept', 'reject', 'reconsider'],
  
  methods: {
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    }
  }
};
</script>

<style scoped>
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
}

.btn-primary:disabled:hover {
  background: #000;
}

.btn-secondary:disabled:hover {
  background: transparent;
  border-color: #e0e0e0;
}

@media (max-width: 600px) {
  .connection-actions {
    flex-direction: column;
  }

  .connection-actions .btn {
    width: 100%;
  }
}
</style>
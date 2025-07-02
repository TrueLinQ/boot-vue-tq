<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <!-- Profile Header Section -->
      <div class="profile-header">
        <div class="profile-content">
          <div class="profile-top">
            <div class="profile-info">
              <div class="profile-avatar">
                {{ getInitials(profile.fullName) }}
              </div>
              <div class="profile-details">
                <div class="profile-name-row">
                  <h1 class="profile-name">{{ profile.fullName }}</h1>
                  <span v-if="profile.isPublic" class="status-dot online">●</span>
                  <span v-else class="status-dot offline">●</span>
                </div>
                <p class="profile-profession">{{ profile.profession }}</p>
                <p v-if="profile.company" class="profile-company">{{ profile.company }}</p>
                <p v-if="profile.location" class="profile-location">{{ profile.location }}</p>
              </div>
            </div>
            <button @click="toggleEditMode" class="edit-button">
              Edit Profile
            </button>
          </div>

          <!-- Bio Section -->
          <div class="section">
            <h3 class="section-title">ABOUT</h3>
            <p class="bio-text">{{ profile.bio || 'No bio available.' }}</p>
          </div>

          <!-- Skills Section -->
          <div class="section" v-if="profile.skills && profile.skills.length > 0">
            <h3 class="section-title">SKILLS</h3>
            <div class="skills-container">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="section">
            <h3 class="section-title">CONTACT</h3>
            <div class="contact-info">
              <div>
                <p class="contact-method">
                  {{ profile.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone' }}
                </p>
                <p class="contact-value">{{ profile.contactValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connections Section -->
      <div class="connections-section">
        <div class="connections-content">
          <h2 class="connections-title">Connections</h2>

          <!-- Connection Tabs -->
          <div class="tabs-container">
            <button
              v-for="tab in connectionTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="['tab-button', activeTab === tab.key ? 'tab-active' : '']"
            >
              {{ tab.label }} {{ getConnectionCount(tab.key) }}
            </button>
          </div>

          <!-- Accepted Connections -->
          <div v-if="activeTab === 'accepted'">
            <div v-if="connections.accepted.length === 0" class="empty-state">
              <p>No connections yet</p>
            </div>
            <div v-else class="connections-grid">
              <div
                v-for="connection in connections.accepted"
                :key="connection.id"
                class="connection-card"
              >
                <div class="connection-header">
                  <div class="connection-avatar">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="connection-info">
                    <h4 class="connection-name">{{ connection.name }}</h4>
                    <p class="connection-profession">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="connection-description">{{ connection.description }}</p>
                <div class="connection-actions">
                  <button class="action-button primary">Message</button>
                  <button class="action-button secondary">View</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Connections -->
          <div v-if="activeTab === 'pending'">
            <div v-if="connections.pending.length === 0" class="empty-state">
              <p>No pending requests</p>
            </div>
            <div v-else class="connections-grid">
              <div
                v-for="connection in connections.pending"
                :key="connection.id"
                class="connection-card pending"
              >
                <div class="connection-header">
                  <div class="connection-avatar pending-avatar">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="connection-info">
                    <h4 class="connection-name">{{ connection.name }}</h4>
                    <p class="connection-profession">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="connection-description">{{ connection.description }}</p>
                <div class="connection-actions">
                  <button
                    @click="acceptConnection(connection.id)"
                    class="action-button accept"
                  >
                    Accept
                  </button>
                  <button
                    @click="rejectConnection(connection.id)"
                    class="action-button reject"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejected Connections -->
          <div v-if="activeTab === 'rejected'">
            <div v-if="connections.rejected.length === 0" class="empty-state">
              <p>No rejected connections</p>
            </div>
            <div v-else class="connections-grid">
              <div
                v-for="connection in connections.rejected"
                :key="connection.id"
                class="connection-card rejected"
              >
                <div class="connection-header">
                  <div class="connection-avatar rejected-avatar">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="connection-info">
                    <h4 class="connection-name">{{ connection.name }}</h4>
                    <p class="connection-profession">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="connection-description">{{ connection.description }}</p>
                <div class="connection-actions">
                  <button
                    @click="reconsiderConnection(connection.id)"
                    class="action-button secondary"
                  >
                    Reconsider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditing" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Edit Profile</h2>

        <div class="form-container">
          <div class="form-group">
            <label class="form-label">Bio</label>
            <textarea
              v-model="editProfile.bio"
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Profile Visibility</label>
            <div class="toggle-container">
              <button
                @click="toggleVisibility"
                :class="['toggle-button', editProfile.isPublic ? 'toggle-active' : '']"
              >
                <div :class="['toggle-slider', editProfile.isPublic ? 'slider-active' : '']"></div>
              </button>
              <span class="toggle-label">{{ editProfile.isPublic ? 'Public' : 'Private' }}</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="cancelEdit" class="modal-button secondary">Cancel</button>
          <button @click="saveProfile" class="modal-button primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileSection',
  data() {
    return {
      isEditing: false,
      activeTab: 'accepted',
      profile: {
        fullName: 'John Doe',
        profession: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        location: 'New York, NY',
        email: 'john.doe@example.com',
        bio: 'Experienced software engineer with 8+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers. Specialized in React, Node.js, and cloud technologies.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
        contactMethod: 'whatsapp',
        contactValue: '+1 (555) 123-4567',
        isPublic: true
      },
      editProfile: {},
      connectionTabs: [
        { key: 'accepted', label: 'Accepted' },
        { key: 'pending', label: 'Pending' },
        { key: 'rejected', label: 'Rejected' }
      ],
      connections: {
        accepted: [
          {
            id: 1,
            name: 'Sarah Johnson',
            profession: 'Product Manager',
            description: 'Product manager with expertise in agile methodologies and user experience design. Love working with cross-functional teams.'
          },
          {
            id: 2,
            name: 'Mike Chen',
            profession: 'UI/UX Designer',
            description: 'Creative designer focused on user-centered design principles. 5+ years experience in mobile and web design.'
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            profession: 'Data Scientist',
            description: 'Data scientist specializing in machine learning and predictive analytics. PhD in Computer Science.'
          }
        ],
        pending: [
          {
            id: 4,
            name: 'David Wilson',
            profession: 'DevOps Engineer',
            description: 'DevOps engineer with expertise in CI/CD pipelines and cloud infrastructure. AWS certified solutions architect.'
          },
          {
            id: 5,
            name: 'Lisa Thompson',
            profession: 'Marketing Director',
            description: 'Marketing professional with 10+ years experience in digital marketing and brand strategy.'
          }
        ],
        rejected: [
          {
            id: 6,
            name: 'Robert Brown',
            profession: 'Sales Manager',
            description: 'Sales professional with track record of exceeding targets. Experienced in B2B software sales.'
          }
        ]
      }
    }
  },
  computed: {
    getConnectionCount() {
      return (type) => {
        const count = this.connections[type].length;
        return count > 0 ? `(${count})` : '';
      };
    }
  },
  methods: {
    getInitials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    },
    toggleEditMode() {
      this.isEditing = true;
      this.editProfile = { ...this.profile };
    },
    toggleVisibility() {
      this.editProfile.isPublic = !this.editProfile.isPublic;
    },
    saveProfile() {
      this.profile = { ...this.editProfile };
      this.isEditing = false;
      console.log('Profile saved:', this.profile);
    },
    cancelEdit() {
      this.isEditing = false;
      this.editProfile = {};
    },
    acceptConnection(connectionId) {
      const connection = this.connections.pending.find(c => c.id === connectionId);
      if (connection) {
        this.connections.pending = this.connections.pending.filter(c => c.id !== connectionId);
        this.connections.accepted.push(connection);
      }
    },
    rejectConnection(connectionId) {
      const connection = this.connections.pending.find(c => c.id === connectionId);
      if (connection) {
        this.connections.pending = this.connections.pending.filter(c => c.id !== connectionId);
        this.connections.rejected.push(connection);
      }
    },
    reconsiderConnection(connectionId) {
      const connection = this.connections.rejected.find(c => c.id === connectionId);
      if (connection) {
        this.connections.rejected = this.connections.rejected.filter(c => c.id !== connectionId);
        this.connections.pending.push(connection);
      }
    }
  }
};
</script>

<style>
/* Base styles */
.profile-container {
  min-height: 100vh;
  padding: 48px 16px;
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-wrapper {
  max-width: 1024px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  margin-bottom: 32px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
}

.profile-content {
  padding: 32px;
}

.profile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
}

.profile-info {
  display: flex;
  align-items: flex-start;
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-right: 24px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  border: 2px solid #000;
  border-radius: 50%;
  background-color: white;
}

.profile-details {
  flex: 1;
}

.profile-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.profile-name {
  margin: 0 12px 0 0;
  font-size: 24px;
  font-weight: 500;
  color: #000;
}

.status-dot {
  font-size: 16px;
}

.status-dot.online {
  color: #000;
}

.status-dot.offline {
  color: #666;
}

.profile-profession {
  margin: 0 0 8px 0;
  color: #333;
}

.profile-company, .profile-location {
  margin: 0 0 8px 0;
  color: #666;
}

.edit-button {
  padding: 8px 24px;
  font-weight: 500;
  color: #000;
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background-color: #000;
  color: white;
}

/* Sections */
.section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #000;
  text-transform: uppercase;
}

.bio-text {
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* Skills */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 12px;
  font-size: 14px;
  color: #333;
  background-color: white;
  border: 1px solid #333;
  border-radius: 8px;
}

/* Contact */
.contact-info {
  display: flex;
  align-items: center;
}

.contact-method {
  margin: 0 0 4px 0;
  color: #000;
  font-weight: 500;
}

.contact-value {
  margin: 0;
  color: #666;
}

/* Connections Section */
.connections-section {
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
}

.connections-content {
  padding: 32px;
}

.connections-title {
  margin: 0 0 32px 0;
  font-size: 20px;
  font-weight: 500;
  color: #000;
}

/* Tabs */
.tabs-container {
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid #000;
}

.tab-button {
  padding: 12px 16px;
  margin-right: 32px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #000;
}

.tab-button.tab-active {
  color: #000;
  border-bottom-color: #000;
}

/* Connections Grid */
.connections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .connections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.connection-card {
  padding: 24px;
  border: 1px solid #000;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
}

.connection-card:hover {
  border-color: #333;
}

.connection-card.pending {
  border-color: #666;
  background-color: #f9f9f9;
}

.connection-card.rejected {
  opacity: 0.6;
  border-color: #ccc;
}

.connection-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.connection-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border: 1px solid #333;
  border-radius: 50%;
  background-color: white;
}

.connection-avatar.pending-avatar {
  border-color: #666;
  color: #666;
}

.connection-avatar.rejected-avatar {
  border-color: #ccc;
  color: #999;
}

.connection-info {
  flex: 1;
}

.connection-name {
  margin: 0 0 4px 0;
  font-weight: 500;
  color: #000;
}

.connection-profession {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.connection-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.connection-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 8px 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  color: white;
  background-color: #000;
  border: 1px solid #000;
}

.action-button.primary:hover {
  background-color: #333;
}

.action-button.secondary {
  color: #333;
  background-color: white;
  border: 1px solid #333;
}

.action-button.secondary:hover {
  color: #000;
  border-color: #000;
}

.action-button.accept {
  color: white;
  background-color: #000;
  border: 1px solid #000;
}

.action-button.accept:hover {
  background-color: #333;
}

.action-button.reject {
  color: #666;
  background-color: white;
  border: 1px solid #666;
}

.action-button.reject:hover {
  color: #000;
  border-color: #000;
}

/* Empty State */
.empty-state {
  padding: 48px 0;
  text-align: center;
}

.empty-state p {
  margin: 0;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 100%;
  max-width: 448px;
  padding: 24px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.form-container {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

/* Toggle */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-button {
  position: relative;
  width: 48px;
  height: 24px;
  background-color: #ccc;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-button.toggle-active {
  background-color: #000;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  transform: translateX(2px);
}

.toggle-slider.slider-active {
  transform: translateX(24px);
}

.toggle-label {
  font-size: 14px;
  color: #333;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.modal-button {
  padding: 8px 24px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button.primary {
  color: white;
  background-color: #000;
  border: 1px solid #000;
}

.modal-button.primary:hover {
  background-color: #333;
}

.modal-button.secondary {
  color: #333;
  background-color: white;
  border: 1px solid #333;
}

.modal-button.secondary:hover {
  color: #000;
  border-color: #000;
}
</style>
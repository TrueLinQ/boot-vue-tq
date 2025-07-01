<template>
  <div class="min-h-screen px-4 py-12 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <!-- Profile Header Section -->
      <div class="mb-8 bg-white border border-gray-200 rounded-lg">
        <div class="p-8">
          <div class="flex items-start justify-between mb-8">
            <div class="flex items-start">
              <div class="flex items-center justify-center w-16 h-16 mr-6 text-xl font-medium text-indigo-600 border-2 border-indigo-600 rounded-full">
                {{ getInitials(profile.fullName) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <h1 class="mr-3 text-2xl font-medium text-gray-900">{{ profile.fullName }}</h1>
                  <span v-if="profile.isPublic" class="text-green-500">●</span>
                  <span v-else class="text-gray-400">●</span>
                </div>
                <p class="mb-2 text-gray-700">{{ profile.profession }}</p>
                <p v-if="profile.company" class="mb-2 text-gray-500">{{ profile.company }}</p>
                <p v-if="profile.location" class="text-gray-500">{{ profile.location }}</p>
              </div>
            </div>
            <button
              @click="toggleEditMode"
              class="px-6 py-2 font-medium text-indigo-600 transition-all duration-300 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white"
            >
              Edit Profile
            </button>
          </div>

          <!-- Bio Section -->
          <div class="mb-8">
            <h3 class="mb-4 text-sm font-medium tracking-wide text-gray-900 uppercase">About</h3>
            <p class="leading-relaxed text-gray-700">{{ profile.bio || 'No bio available.' }}</p>
          </div>

          <!-- Skills Section -->
          <div class="mb-8" v-if="profile.skills && profile.skills.length > 0">
            <h3 class="mb-4 text-sm font-medium tracking-wide text-gray-900 uppercase">Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                class="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="mb-8">
            <h3 class="mb-4 text-sm font-medium tracking-wide text-gray-900 uppercase">Contact</h3>
            <div class="flex items-center">
              <div>
                <p class="mb-1 text-gray-900">
                  {{ profile.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone' }}
                </p>
                <p class="text-gray-600">{{ profile.contactValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connections Section -->
      <div class="bg-white border border-gray-200 rounded-lg">
        <div class="p-8">
          <h2 class="mb-8 text-xl font-medium text-gray-900">Connections</h2>

          <!-- Connection Tabs -->
          <div class="flex mb-8 border-b border-gray-200">
            <button
              v-for="tab in connectionTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'px-4 py-3 text-sm font-medium transition-colors mr-8',
                activeTab === tab.key
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              ]"
            >
              {{ tab.label }} {{ getConnectionCount(tab.key) }}
            </button>
          </div>

          <!-- Accepted Connections -->
          <div v-if="activeTab === 'accepted'">
            <div v-if="connections.accepted.length === 0" class="py-12 text-center">
              <p class="text-gray-500">No connections yet</p>
            </div>
            <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                v-for="connection in connections.accepted"
                :key="connection.id"
                class="p-6 transition-colors border border-gray-200 rounded-lg hover:border-indigo-600"
              >
                <div class="flex items-start mb-4">
                  <div class="flex items-center justify-center w-10 h-10 mr-4 text-sm font-medium text-gray-700 border border-gray-400 rounded-full">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="mb-1 font-medium text-gray-900">{{ connection.name }}</h4>
                    <p class="text-sm text-gray-600">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="mb-4 text-sm leading-relaxed text-gray-700">{{ connection.description }}</p>
                <div class="flex gap-2">
                  <button class="px-4 py-2 font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    Message
                  </button>
                  <button class="px-4 py-2 font-medium text-gray-700 transition-all duration-300 border border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Connections -->
          <div v-if="activeTab === 'pending'">
            <div v-if="connections.pending.length === 0" class="py-12 text-center">
              <p class="text-gray-500">No pending requests</p>
            </div>
            <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                v-for="connection in connections.pending"
                :key="connection.id"
                class="p-6 border rounded-lg border-amber-200 bg-amber-50"
              >
                <div class="flex items-start mb-4">
                  <div class="flex items-center justify-center w-10 h-10 mr-4 text-sm font-medium border rounded-full border-amber-400 text-amber-700">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="mb-1 font-medium text-gray-900">{{ connection.name }}</h4>
                    <p class="text-sm text-gray-600">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="mb-4 text-sm leading-relaxed text-gray-700">{{ connection.description }}</p>
                <div class="flex gap-2">
                  <button
                    @click="acceptConnection(connection.id)"
                    class="px-4 py-2 font-medium text-white transition-all duration-300 bg-green-700 rounded-lg hover:bg-green-800"
                  >
                    Accept
                  </button>
                  <button
                    @click="rejectConnection(connection.id)"
                    class="px-4 py-2 font-medium text-red-700 transition-all duration-300 border border-red-300 rounded-lg hover:border-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejected Connections -->
          <div v-if="activeTab === 'rejected'">
            <div v-if="connections.rejected.length === 0" class="py-12 text-center">
              <p class="text-gray-500">No rejected connections</p>
            </div>
            <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                v-for="connection in connections.rejected"
                :key="connection.id"
                class="p-6 border border-gray-200 rounded-lg opacity-60"
              >
                <div class="flex items-start mb-4">
                  <div class="flex items-center justify-center w-10 h-10 mr-4 text-sm font-medium text-gray-500 border border-gray-300 rounded-full">
                    {{ getInitials(connection.name) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="mb-1 font-medium text-gray-700">{{ connection.name }}</h4>
                    <p class="text-sm text-gray-500">{{ connection.profession }}</p>
                  </div>
                </div>
                <p class="mb-4 text-sm leading-relaxed text-gray-600">{{ connection.description }}</p>
                <div class="flex">
                  <button
                    @click="reconsiderConnection(connection.id)"
                    class="px-4 py-2 font-medium text-gray-600 transition-all duration-300 border border-gray-300 rounded-lg hover:border-gray-500"
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
    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 class="mb-6 text-xl font-bold text-gray-900">Edit Profile</h2>

        <div class="space-y-6">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Bio</label>
            <textarea
              v-model="editProfile.bio"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            ></textarea>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Profile Visibility</label>
            <div class="flex items-center space-x-4">
              <button
                @click="toggleVisibility"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  editProfile.isPublic ? 'bg-indigo-600' : 'bg-gray-300'
                ]"
              >
                <div
                  :class="[
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                    editProfile.isPublic ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                ></div>
              </button>
              <span>{{ editProfile.isPublic ? 'Public' : 'Private' }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-8 space-x-4">
          <button
            @click="cancelEdit"
            class="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600"
          >
            Cancel
          </button>
          <button
            @click="saveProfile"
            class="px-6 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
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
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.translate-x-0\.5 {
  transform: translateX(0.125rem);
}

.translate-x-6 {
  transform: translateX(1.5rem);
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

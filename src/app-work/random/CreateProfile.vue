<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Progress Bar -->
    <div class="w-full h-2 bg-gray-200">
      <div
        class="h-2 transition-all duration-500 ease-out bg-indigo-600"
        :style="{ width: `${(currentStep / 4) * 100}%` }"
      ></div>
    </div>

    <div class="max-w-2xl px-6 py-12 mx-auto">
      <!-- Step 1: Getting Started -->
      <div v-if="currentStep === 1" class="space-y-8">
        <div class="space-y-4 text-center">
          <h1 class="text-4xl font-bold text-gray-900">Create Your Profile</h1>
          <p class="max-w-md mx-auto text-lg text-gray-600">
            Build a professional presence that showcases your expertise and connects you with opportunities.
          </p>
        </div>

        <div class="space-y-4">
          <div class="p-6 transition-all duration-300 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:shadow-lg">
            <div class="flex items-center space-x-4">
              <div class="flex items-center justify-center w-12 h-12 text-white transition-transform duration-300 bg-indigo-600 rounded-full hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Professional Details</h3>
                <p class="text-sm text-gray-600">Add your experience, skills, and background</p>
              </div>
            </div>
          </div>

          <div class="p-6 transition-all duration-300 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:shadow-lg">
            <div class="flex items-center space-x-4">
              <div class="flex items-center justify-center w-12 h-12 text-white transition-transform duration-300 bg-indigo-600 rounded-full hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Contact Preferences</h3>
                <p class="text-sm text-gray-600">Choose how clients and collaborators reach you</p>
              </div>
            </div>
          </div>

          <div class="p-6 transition-all duration-300 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:shadow-lg">
            <div class="flex items-center space-x-4">
              <div class="flex items-center justify-center w-12 h-12 text-white transition-transform duration-300 bg-indigo-600 rounded-full hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Privacy Settings</h3>
                <p class="text-sm text-gray-600">Control the visibility of your profile</p>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="nextStep"
          class="w-full px-8 py-4 mt-6 font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Start Building Profile
        </button>
      </div>

      <!-- Step 2: Contact Method Selection -->
      <div v-if="currentStep === 2" class="space-y-8">
        <div class="space-y-2 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Contact Preferences</h2>
          <p class="text-gray-600">How would you like clients to reach you?</p>
        </div>

        <div class="space-y-4">
          <div
            :class="[
              'border-2 p-6 cursor-pointer transition-all duration-300 rounded-lg group',
              contactMethod === 'whatsapp'
                ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
            ]"
            @click="selectContactMethod('whatsapp')"
          >
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                contactMethod === 'whatsapp' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21l4-4 4 4M3 9l4-4 4 4"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">WhatsApp</h3>
                <p class="text-sm text-gray-600">Quick messaging and voice calls</p>
              </div>
              <div :class="[
                'w-6 h-6 border-2 rounded-full transition-all duration-300',
                contactMethod === 'whatsapp' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              ]">
                <div v-if="contactMethod === 'whatsapp'" class="w-2 h-2 m-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div
            :class="[
              'border-2 p-6 cursor-pointer transition-all duration-300 rounded-lg group',
              contactMethod === 'phone'
                ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
            ]"
            @click="selectContactMethod('phone')"
          >
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                contactMethod === 'phone' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">Phone Number</h3>
                <p class="text-sm text-gray-600">Direct phone calls</p>
              </div>
              <div :class="[
                'w-6 h-6 border-2 rounded-full transition-all duration-300',
                contactMethod === 'phone' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
              ]">
                <div v-if="contactMethod === 'phone'" class="w-2 h-2 m-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="contactMethod" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ contactMethod === 'whatsapp' ? 'WhatsApp Number' : 'Phone Number' }}
          </label>
          <input
            v-model="contactValue"
            type="tel"
            placeholder="+1 (555) 123-4567"
            class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div class="flex space-x-4">
          <button
            @click="prevStep"
            class="flex-1 px-6 py-3 font-medium text-gray-700 transition-all duration-300 border border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600"
          >
            ← Back
          </button>
          <button
            @click="nextStep"
            :disabled="!canProceedStep2"
            :class="[
              'flex-1 py-3 px-6 transition-all duration-300 font-medium rounded-lg',
              canProceedStep2
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            Continue →
          </button>
        </div>
      </div>

      <!-- Step 3: Professional Information -->
      <div v-if="currentStep === 3" class="space-y-8">
        <div class="space-y-2 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Professional Information</h2>
          <p class="text-gray-600">Tell us about your expertise and background</p>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">Basic Information</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  v-model="profile.fullName"
                  type="text"
                  placeholder="John Doe"
                  class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Profession *</label>
                <input
                  v-model="profile.profession"
                  type="text"
                  placeholder="Software Engineer"
                  class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Company</label>
                <input
                  v-model="profile.company"
                  type="text"
                  placeholder="Tech Corp Inc."
                  class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Location</label>
                <input
                  v-model="profile.location"
                  type="text"
                  placeholder="New York, NY"
                  class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <label class="block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                v-model="profile.email"
                type="email"
                placeholder="john@example.com"
                class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">About</h3>
            <textarea
              v-model="profile.bio"
              placeholder="Tell us about your experience, expertise, and what makes you unique in your field..."
              rows="4"
              class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            ></textarea>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Skills</h3>
            <div class="flex space-x-3">
              <input
                v-model="skillInput"
                type="text"
                placeholder="Add a skill (e.g. JavaScript, Project Management)"
                @keyup.enter="addSkill"
                class="flex-1 px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <button
                @click="addSkill"
                type="button"
                class="px-6 py-3 font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div v-if="profile.skills.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                @click="removeSkill(index)"
                class="flex items-center px-3 py-2 space-x-2 text-sm text-gray-800 transition-all duration-300 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 group"
              >
                <span>{{ skill }}</span>
                <svg class="w-4 h-4 transition-colors duration-300 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </span>
            </div>
          </div>

          <div class="pt-6 space-y-4 border-t border-gray-200">
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Privacy Settings</h3>
            <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div class="flex-1">
                <div class="flex items-center mb-1 space-x-2">
                  <svg v-if="profile.isPublic" class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2 2 2 0 002-2V9.76"/>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span class="font-medium text-gray-900">
                    {{ profile.isPublic ? 'Public Profile' : 'Private Profile' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">
                  {{ profile.isPublic
                    ? 'Your profile will be discoverable and visible to everyone'
                    : 'Only people with direct access can view your profile' }}
                </p>
              </div>
              <button
                @click="togglePrivacy"
                :class="[
                  'relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none',
                  profile.isPublic ? 'bg-indigo-600' : 'bg-gray-300'
                ]"
              >
                <div
                  :class="[
                    'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300',
                    profile.isPublic ? 'translate-x-7' : 'translate-x-1'
                  ]"
                ></div>
              </button>
            </div>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            @click="prevStep"
            class="flex-1 px-6 py-3 font-medium text-gray-700 transition-all duration-300 border border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600"
          >
            ← Back
          </button>
          <button
            @click="nextStep"
            :disabled="!canProceedStep3"
            :class="[
              'flex-1 py-3 px-6 transition-all duration-300 font-medium rounded-lg',
              canProceedStep3
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            Create Profile →
          </button>
        </div>
      </div>

      <!-- Step 4: Success Screen -->
      <div v-if="currentStep === 4" class="space-y-8">
        <div class="space-y-6 text-center">
          <div class="flex items-center justify-center w-20 h-20 mx-auto bg-indigo-600 rounded-full">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <h2 class="mb-2 text-3xl font-bold text-gray-900">Profile Created Successfully</h2>
            <p class="max-w-md mx-auto text-gray-600">Your professional profile is now ready to attract opportunities and showcase your expertise.</p>
          </div>
        </div>

        <div class="p-8 border border-gray-200 rounded-lg bg-gray-50">
          <div class="flex items-start mb-8 space-x-6">
            <div class="flex items-center justify-center flex-shrink-0 w-16 h-16 text-xl font-medium text-white bg-indigo-600 rounded-full">
              {{ getInitials(profile.fullName) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center mb-2 space-x-3">
                <h1 class="text-2xl font-medium text-gray-900">{{ profile.fullName }}</h1>
                <div :class="[
                  'w-2 h-2 rounded-full',
                  profile.isPublic ? 'bg-green-500' : 'bg-gray-400'
                ]"></div>
              </div>
              <p class="mb-1 text-lg text-gray-700">{{ profile.profession }}</p>
              <div class="space-y-1 text-gray-600">
                <p v-if="profile.company">{{ profile.company }}</p>
                <p v-if="profile.location">{{ profile.location }}</p>
                <p>{{ profile.email }}</p>
              </div>
            </div>
          </div>

          <div v-if="profile.bio" class="mb-8">
            <h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">About</h3>
            <p class="leading-relaxed text-gray-700">{{ profile.bio }}</p>
          </div>

          <div v-if="profile.skills && profile.skills.length > 0" class="mb-8">
            <h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                class="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">Contact</h3>
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-indigo-600 text-white'
              ]">
                <svg v-if="contactMethod === 'whatsapp'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21l4-4 4 4M3 9l4-4 4 4"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">
                  {{ contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone' }}
                </p>
                <p class="text-gray-600">{{ contactValue }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex space-x-4">
          <button class="flex-1 px-6 py-3 font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700">
            View Full Profile
          </button>
          <button class="flex-1 px-6 py-3 font-medium text-gray-700 transition-all duration-300 border border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600">
            Share Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileCreator',
  data() {
    return {
      currentStep: 1,
      contactMethod: '',
      contactValue: '',
      skillInput: '',
      profile: {
        fullName: '',
        profession: '',
        company: '',
        location: '',
        email: '',
        bio: '',
        skills: [],
        isPublic: true
      }
    }
  },
  computed: {
    canProceedStep2() {
      return this.contactMethod && this.contactValue.trim();
    },
    canProceedStep3() {
      return this.profile.fullName.trim() &&
             this.profile.profession.trim() &&
             this.profile.email.trim();
    }
  },
  methods: {
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    },
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    selectContactMethod(method) {
      this.contactMethod = method;
    },
    addSkill() {
      if (this.skillInput.trim() && !this.profile.skills.includes(this.skillInput.trim())) {
        this.profile.skills.push(this.skillInput.trim());
        this.skillInput = '';
      }
    },
    removeSkill(index) {
      this.profile.skills.splice(index, 1);
    },
    togglePrivacy() {
      this.profile.isPublic = !this.profile.isPublic;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(149, 128, 255, 0.3);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>

<template>
  <div class="app">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: (currentStep / 4) * 100 + '%' }"></div>
    </div>

    <div class="container">
      <!-- Step 1: Getting Started -->
      <div v-if="currentStep === 1" class="step">
        <div class="header">
          <h1>Create Your Profile</h1>
          <p>Build a professional presence that showcases your expertise and connects you with opportunities.</p>
        </div>

        <div class="cards">
          <div class="card">
            <div class="card-icon">💼</div>
            <div class="card-content">
              <h3>Professional Details</h3>
              <p>Add your experience, skills, and background</p>
            </div>
          </div>

          <div class="card">
            <div class="card-icon">💬</div>
            <div class="card-content">
              <h3>Contact Preferences</h3>
              <p>Choose how clients and collaborators reach you</p>
            </div>
          </div>

          <div class="card">
            <div class="card-icon">🔒</div>
            <div class="card-content">
              <h3>Privacy Settings</h3>
              <p>Control the visibility of your profile</p>
            </div>
          </div>
        </div>

        <button @click="nextStep" class="btn btn-primary btn-block">
          Start Building Profile
        </button>
      </div>

      <!-- Step 2: Contact Method Selection -->
      <div v-if="currentStep === 2" class="step">
        <div class="header">
          <h2>Contact Preferences</h2>
          <p>How would you like clients to reach you?</p>
        </div>

        <div class="contact-options">
          <div 
            @click="selectContactMethod('whatsapp')"
            :class="['contact-card', { active: contactMethod === 'whatsapp' }]"
          >
            <div class="contact-icon">📱</div>
            <div class="contact-content">
              <h3>WhatsApp</h3>
              <p>Quick messaging and voice calls</p>
            </div>
            <div class="radio" :class="{ checked: contactMethod === 'whatsapp' }"></div>
          </div>

          <div 
            @click="selectContactMethod('phone')"
            :class="['contact-card', { active: contactMethod === 'phone' }]"
          >
            <div class="contact-icon">📞</div>
            <div class="contact-content">
              <h3>Phone Number</h3>
              <p>Direct phone calls</p>
            </div>
            <div class="radio" :class="{ checked: contactMethod === 'phone' }"></div>
          </div>
        </div>

        <div v-if="contactMethod" class="form-group">
          <label>{{ contactMethod === 'whatsapp' ? 'WhatsApp Number' : 'Phone Number' }}</label>
          <input 
            v-model="contactValue" 
            type="tel" 
            placeholder="+1 (555) 123-4567"
            class="input"
          />
        </div>

        <div class="button-row">
          <button @click="prevStep" class="btn btn-secondary">
            ← Back
          </button>
          <button 
            @click="nextStep" 
            :disabled="!canProceedStep2" 
            :class="['btn', canProceedStep2 ? 'btn-primary' : 'btn-disabled']"
          >
            Continue →
          </button>
        </div>
      </div>

      <!-- Step 3: Professional Information -->
      <div v-if="currentStep === 3" class="step">
        <div class="header">
          <h2>Professional Information</h2>
          <p>Tell us about your expertise and background</p>
        </div>

        <div class="form-section">
          <h3 class="section-title">Basic Information</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input 
                v-model="profile.fullName" 
                placeholder="John Doe"
                class="input"
                required
              />
            </div>
            <div class="form-group">
              <label>Profession *</label>
              <input 
                v-model="profile.profession" 
                placeholder="Software Engineer"
                class="input"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Company</label>
              <input 
                v-model="profile.company" 
                placeholder="Tech Corp Inc."
                class="input"
              />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input 
                v-model="profile.location" 
                placeholder="New York, NY"
                class="input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input 
              v-model="profile.email" 
              type="email" 
              placeholder="john@example.com"
              class="input"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">About</h3>
          <div class="form-group">
            <textarea 
              v-model="profile.bio" 
              placeholder="Tell us about your experience, expertise, and what makes you unique in your field..." 
              rows="4"
              class="textarea"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Skills</h3>
          <div class="skill-input">
            <input 
              v-model="skillInput" 
              placeholder="Add a skill (e.g. JavaScript, Project Management)" 
              @keyup.enter="addSkill"
              class="input"
            />
            <button @click="addSkill" class="btn btn-primary">Add</button>
          </div>
          
          <div v-if="profile.skills.length > 0" class="skills">
            <span
              v-for="(skill, index) in profile.skills" 
              :key="index"
              @click="removeSkill(index)"
              class="skill-tag"
            >
              {{ skill }} ×
            </span>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Privacy Settings</h3>
          <div class="privacy-toggle">
            <div class="privacy-info">
              <div class="privacy-title">
                {{ profile.isPublic ? '🌍 Public Profile' : '🔒 Private Profile' }}
              </div>
              <p>{{ profile.isPublic ? 'Your profile will be discoverable and visible to everyone' : 'Only people with direct access can view your profile' }}</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="profile.isPublic">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="button-row">
          <button @click="prevStep" class="btn btn-secondary">
            ← Back
          </button>
          <button 
            @click="nextStep" 
            :disabled="!canProceedStep3" 
            :class="['btn', canProceedStep3 ? 'btn-primary' : 'btn-disabled']"
          >
            Create Profile →
          </button>
        </div>
      </div>

      <!-- Step 4: Success Screen -->
      <div v-if="currentStep === 4" class="step">
        <div class="success-header">
          <div class="success-icon">✓</div>
          <h2>Profile Created Successfully</h2>
          <p>Your professional profile is now ready to attract opportunities and showcase your expertise.</p>
        </div>

        <div class="profile-preview">
          <div class="profile-header">
            <div class="avatar">{{ getInitials(profile.fullName) }}</div>
            <div class="profile-info">
              <div class="name-status">
                <h3>{{ profile.fullName }}</h3>
                <span :class="['status', profile.isPublic ? 'public' : 'private']"></span>
              </div>
              <p class="profession">{{ profile.profession }}</p>
              <div class="details">
                <p v-if="profile.company">{{ profile.company }}</p>
                <p v-if="profile.location">{{ profile.location }}</p>
                <p>{{ profile.email }}</p>
              </div>
            </div>
          </div>

          <div v-if="profile.bio" class="profile-section">
            <h4>About</h4>
            <p>{{ profile.bio }}</p>
          </div>

          <div v-if="profile.skills && profile.skills.length > 0" class="profile-section">
            <h4>Skills</h4>
            <div class="skills">
              <span
                v-for="(skill, index) in profile.skills" 
                :key="index"
                class="skill-tag readonly"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="profile-section">
            <h4>Contact</h4>
            <div class="contact-info">
              <div class="contact-method">
                {{ contactMethod === 'whatsapp' ? '📱' : '📞' }}
              </div>
              <div>
                <p class="contact-type">{{ contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone' }}</p>
                <p class="contact-value">{{ contactValue }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="button-row">
          <button class="btn btn-primary">View Full Profile</button>
          <button class="btn btn-secondary">Share Profile</button>
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
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #fff;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-top: 4px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f0f0f0;
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
}

.step {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.header h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.5;
}

.cards {
  margin-bottom: 40px;
}

.card {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 2rem;
  margin-right: 20px;
  min-width: 48px;
  text-align: center;
}

.card-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-content p {
  color: #666;
  font-size: 0.95rem;
}

.contact-options {
  margin-bottom: 30px;
}

.contact-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.contact-card:hover {
  border-color: #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.contact-card.active {
  border-color: #000;
  background: #f8f8f8;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 16px;
  min-width: 40px;
  text-align: center;
}

.contact-content {
  flex-grow: 1;
}

.contact-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.contact-content p {
  color: #666;
  font-size: 0.9rem;
}

.radio {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
}

.radio.checked {
  border-color: #000;
}

.radio.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
}

.form-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.input, .textarea {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: #000;
}

.input::placeholder, .textarea::placeholder {
  color: #999;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.skill-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.skill-input .input {
  flex-grow: 1;
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-tag:hover:not(.readonly) {
  background: #e0e0e0;
  border-color: #ccc;
}

.skill-tag.readonly {
  cursor: default;
  background: #f8f8f8;
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

.btn {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
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

.btn-disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 40px;
}

@media (max-width: 600px) {
  .button-row {
    grid-template-columns: 1fr;
  }
}

.success-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.profile-preview {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
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

.profile-info {
  flex-grow: 1;
}

.name-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.name-status h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status.public {
  background: #4ade80;
}

.status.private {
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

.profile-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 12px;
}

.profile-section p {
  color: #333;
  line-height: 1.6;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-method {
  width: 40px;
  height: 40px;
  background: #000;
  color: #fff;
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
</style>
<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-content">
        <!-- Left side - Logo/Brand -->
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            TrueLinq Work
          </router-link>
        </div>

        <!-- Right side - User menu -->
        <div class="nav-actions">
          <!-- User profile dropdown -->
          <div class="user-dropdown" ref="dropdownRef">
            <button 
              @click="toggleDropdown"
              class="user-button"
              type="button"
            >
              <img 
                :src="user.profile.picture" 
                :alt="user.profile.name"
                class="user-avatar"
              />
              <span class="user-name">{{ user.profile.name }}</span>
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div 
              class="dropdown-menu"
              :class="{ 'dropdown-menu-visible': showDropdown }"
              @click.stop
            >
              <button 
                @click="handleProfileClick"
                class="dropdown-item dropdown-button"
                type="button"
              >
                My Profile
              </button>
              <!-- <div class="dropdown-divider"></div> -->
              <button 
                @click="handleLogout"
                class="dropdown-item dropdown-button"
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDropdown: false
    }
  },
  methods: {
    toggleDropdown(event) {
      event.stopPropagation()
      this.showDropdown = !this.showDropdown
    },
    closeDropdown() {
      this.showDropdown = false
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.closeDropdown()
      }
    },
    handleProfileClick(event) {
      event.stopPropagation()
      this.closeDropdown()
      this.$router.push('/profile')
    },
    async handleLogout(event) {
      event.stopPropagation()
      
      try {
        await fetch('https://app.truelinq.com/linq/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
      
      this.closeDropdown()
      this.$emit('logout')
      window.location.href = '/linq/auth/login'
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.navbar {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  text-decoration: none;
}

.brand-link:hover {
  color: #333;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.user-dropdown {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 1001;
}

.user-button:hover {
  background: #f8f8f8;
}

.user-button:focus {
  outline: none;
  background: #f8f8f8;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  object-fit: cover;
  pointer-events: none; /* Prevent image from capturing clicks */
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
  display: none;
  pointer-events: none; /* Prevent text from capturing clicks */
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #666;
  pointer-events: none; /* Prevent SVG from capturing clicks */
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  width: 200px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none; /* Hidden by default */
}

.dropdown-menu-visible {
  display: block !important; /* Force show when class is present */
}

/* More specific selector to override any conflicting CSS */
.navbar .nav-actions .user-dropdown .dropdown-menu {
  display: none;
}

.navbar .nav-actions .user-dropdown .dropdown-menu[style*="display: block"] {
  display: block !important;
}

.dropdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.dropdown-button {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-weight: 400;
}

.dropdown-item:hover {
  background: #f8f8f8;
}

/* Mobile Responsive */
@media (min-width: 768px) {
  .user-name {
    display: block;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-content {
    height: 56px;
  }
  
  .brand-link {
    font-size: 1.1rem;
  }
  
  .dropdown-menu {
    width: 180px;
  }
}
</style>
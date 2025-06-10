<template>
  <header class="header">
    <div class="container">
      <div class="nav">
        <div class="logo" @click="$emit('navigate', 'home')">TruePilot</div>

        <nav class="nav-links">
          <button @click="$emit('navigate', 'signIn')" class="btn-primary">Sign in</button>
        </nav>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="mobile-menu">
        <button @click="$emit('navigate', 'reviews')" class="nav-link">Reviews</button>
        <button @click="$emit('navigate', 'business')" class="nav-link">Business</button>
        <a href="#" class="nav-link">About</a>
        <button @click="$emit('navigate', 'signIn')" class="btn-primary">Sign in</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  emits: ['navigate'],
  data() {
    return {
      mobileMenuOpen: false
    };
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  padding: 20px 0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  cursor: pointer;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
}

.nav-link:hover {
  color: #666;
}

.btn-primary {
  background: #000;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:hover {
  background: #333;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Mobile */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
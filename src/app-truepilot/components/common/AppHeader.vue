<template>
  <header class="header">
    <div class="container">
      <div class="nav">
        <router-link to="/" class="logo">TruePilot  <span>Reviews</span>
</router-link>
       
        <nav class="nav-links">
          <!-- <router-link to="/reviews" class="nav-link">Reviews</router-link>
          <router-link to="/business" class="nav-link">Business</router-link>
          <a href="#" class="nav-link">About</a> -->
          <router-link to="/signin" class="btn-primary">Sign in</router-link>
        </nav>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="mobile-menu">
        <router-link to="/reviews" class="nav-link" @click="closeMobileMenu">Reviews</router-link>
        <router-link to="/business" class="nav-link" @click="closeMobileMenu">Business</router-link>
        <a href="#" class="nav-link" @click="closeMobileMenu">About</a>
        <router-link to="/signin" class="btn-primary" @click="closeMobileMenu">Sign in</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      mobileMenuOpen: false,
    };
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }
  },
};
</script>

<style scoped>
.header {
  padding: var(--spacing-md) 0;
  background: var(--color-background);
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
  color: var(--color-text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: var(--color-light-text);
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
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
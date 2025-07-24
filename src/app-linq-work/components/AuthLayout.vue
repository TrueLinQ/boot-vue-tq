<template>
  <div class="auth-layout">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>

    <!-- Not logged in - redirect to auth -->
    <div v-else-if="!user || !user.loggedIn" class="auth-container">
      <div class="auth-card">
        <h1>Authentication Required</h1>
        <p>Please log in to access this application</p>
        <button 
          @click="redirectToAuth"
          class="btn btn-primary"
        >
          Login with Google
        </button>
      </div>
    </div>

    <!-- Authenticated - show navbar and content -->
    <div v-else class="app-container">
      <!-- Navbar Component -->
      <Navbar :user="user" @logout="handleLogout" />

      <!-- Main content -->
      <main class="main-content">
        <router-view :user="user"></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue'

export default {
  name: 'AuthLayout',
  components: {
    Navbar
  },
  data() {
    return {
      loading: true,
      user: null
    }
  },
  async mounted() {
    await this.fetchAuthStatus()
  },
  methods: {
    async fetchAuthStatus() {
      try {
        this.loading = true
        const response = await fetch('https://app.truelinq.com/linq/auth/meta', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          this.user = data.results[0]
        }
      } catch (error) {
        console.error('Error fetching auth status:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    },
    redirectToAuth() {
      window.location.href = 'https://app.truelinq.com/linq/auth/google'
    },
    handleLogout() {
      this.user = null
      this.redirectToAuth()
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-layout {
  min-height: 100vh;
  background: #fff;
  color: #000;
  font-family: "Inter", sans-serif;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  padding: 20px;
}

.auth-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.auth-card h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #000;
}

.auth-card p {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 1rem;
  line-height: 1.5;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
  gap: 8px;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.app-container {
  min-height: 100vh;
  background: #fff;
}

.main-content {
  min-height: calc(100vh - 64px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .auth-card {
    padding: 32px 24px;
    margin: 16px;
  }
  
  .auth-card h1 {
    font-size: 1.3rem;
  }
  
  .main-content {
    min-height: calc(100vh - 56px);
  }
}
</style>
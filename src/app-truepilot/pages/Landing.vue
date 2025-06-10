<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="nav">
          <div class="logo" @click="currentPage = 'home'">TruePilot</div>

          <nav class="nav-links">
            <!-- <button @click="currentPage = 'reviews'" class="nav-link">Reviews</button>
            <button @click="currentPage = 'business'" class="nav-link">Business</button>
            <a href="#" class="nav-link">About</a> -->
            <button @click="currentPage = 'signIn'" class="btn-primary">Sign in</button>
          </nav>

          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span v-if="!mobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>

        <div v-if="mobileMenuOpen" class="mobile-menu">
          <button @click="currentPage = 'reviews'" class="nav-link">Reviews</button>
          <button @click="currentPage = 'business'" class="nav-link">Business</button>
          <a href="#" class="nav-link">About</a>
          <button @click="currentPage = 'signIn'" class="btn-primary">Sign in</button>
        </div>
      </div>
    </header>

    <!-- Home Page -->
    <div v-if="currentPage === 'home'">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-block">
            <h1>
              We're all about<br />
              <strong class="highlight-text">
                <span class="text">consumer reviews</span>
                <img src="./STARS.gif" alt="Celebration" class="inline-gif" />
              </strong>
            </h1>
            <p>Get the story behind the star rating with authentic reviews from <br/>real customers</p>
          </div>

          <!-- Action Buttons -->
          <div class="actions">
            <div v-for="(action, index) in actions" :key="index" class="action-item" @click="action.action">
              <div class="action-icon">
                <component :is="action.icon" :size="24" />
              </div>
              <div class="action-label">{{ action.label }}</div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="Search for any company..."
              class="search-input"
            />
            <button @click="handleSearch" class="search-btn">
              <Search :size="20" />
            </button>
          </div>
        </div>
      </section>

      
      <section>
        <!-- 🖼️ Centered image -->
        <div class="stats-image">
          <img src="./LovingDoodle.png" alt="Stats Illustration" />
        </div>

        <!-- 💬 Centered quote -->
        <div class="quote-block">
          <p class="quote">“Your voice builds trust. Share your experience, shape the future.”</p>
        </div>
      </section>
      <ReviewSlider />

      <!-- Categories Section -->
      <section class="categories">
        <div class="container">
          <h2 class="section-title">Popular Categories</h2>
          <div class="categories-grid">
            <div
              v-for="(category, index) in categories"
              :key="index"
              class="category-card"
              @click="currentPage = 'exploreCategory'"
            >
              <div class="category-header">
                <div></div>
                <div class="category-icon">
                  <component :is="category.icon" :size="32" />
                </div>
                <ArrowRight :size="20" />
              </div>
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-count">{{ category.count }} companies</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Other Pages -->
    <div v-else-if="currentPage === 'reviews'" class="page">
      <div class="container">
        <h1>Reviews</h1>
        <p>Browse and read customer reviews</p>
        <button @click="currentPage = 'home'" class="btn-primary">Back to Home</button>
      </div>
    </div>

    <div v-else-if="currentPage === 'signIn'" class="page">
      <div class="container">
        <div class="form-container">
          <h1>Sign In</h1>
          <div class="form-group">
            <input type="email" placeholder="Email" class="form-input" />
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" class="form-input" />
          </div>
          <button class="btn-primary btn-block">Sign In</button>
          <button @click="currentPage = 'home'" class="btn-link">Back to Home</button>
        </div>
      </div>
    </div>

    <div v-else-if="currentPage === 'writeReview'" class="page">
      <div class="container">
        <h1>Write a Review</h1>
        <button @click="currentPage = 'home'" class="btn-primary">Back to Home</button>
      </div>
    </div>

    <div v-else-if="currentPage === 'exploreCategory'" class="page">
      <div class="container">
        <h1>Explore Categories</h1>
        <button @click="currentPage = 'home'" class="btn-primary">Back to Home</button>
      </div>
    </div>

    <div v-else-if="currentPage === 'business'" class="page">
      <div class="container">
        <h1>Business</h1>
        <p>Manage your business profile and reviews</p>
        <button @click="currentPage = 'home'" class="btn-primary">Back to Home</button>
      </div>
    </div>

    <div v-else-if="currentPage === 'createCompany'" class="page">
      <div class="container">
        <h1>Create Company Profile</h1>
        <p>Company not found in our database. Create a new profile.</p>
        <button @click="currentPage = 'home'" class="btn-primary">Back to Home</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, Edit, Building, Megaphone, Star, ArrowRight, Users, Globe, MessageSquare } from "lucide-vue";
import { Monitor, ShoppingBag, Plane, Heart, Briefcase, DollarSign } from "lucide-vue";
import ReviewSlider from './ReviewSlider.vue';

export default {
  name: "TruePilot",
  components: {
    Search,
    Edit,
    Building,
    Megaphone,
    Star,
    ArrowRight,
    Users,
    Globe,
    MessageSquare,
    Monitor,
    ShoppingBag,
    Plane,
    Heart,
    Briefcase,
    DollarSign,
    ReviewSlider,
  },
  data() {
    return {
      currentPage: "home",
      mobileMenuOpen: false,
      searchQuery: "",
      actions: [
        { icon: "Edit", label: "Write Review", action: () => (this.currentPage = "writeReview") },
        { icon: "Search", label: "Find Companies", action: () => (this.currentPage = "exploreCategory") },
        { icon: "Building", label: "Business", action: () => (this.currentPage = "business") },
        { icon: "MessageSquare", label: "Reviews", action: () => (this.currentPage = "reviews") },
      ],
      stats: [
        { number: "118M", label: "Reviews", icon: "MessageSquare" },
        { number: "785K", label: "Companies", icon: "Building" },
        { number: "140", label: "Countries", icon: "Globe" },
        { number: "23", label: "Languages", icon: "Users" },
      ],
      categories: [
        { name: "Electronics & Technology", count: "12,543", icon: "Monitor" },
        { name: "Shopping & Fashion", count: "18,291", icon: "ShoppingBag" },
        { name: "Travel & Vacation", count: "9,876", icon: "Plane" },
        { name: "Health & Medical", count: "7,432", icon: "Heart" },
        { name: "Business Services", count: "15,678", icon: "Briefcase" },
        { name: "Money & Insurance", count: "5,321", icon: "DollarSign" },
      ],
    };
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    handleSearch() {
      if (!this.searchQuery.trim()) return;

      const query = this.searchQuery.trim().toLowerCase();
      const companies = [
        "apple",
        "google",
        "microsoft",
        "amazon",
        "facebook",
        "tesla",
        "netflix",
        "spotify",
        "uber",
        "airbnb",
      ];
      const found = companies.some((company) => company.includes(query));

      if (!found) {
        this.currentPage = "createCompany";
      } else {
        alert(`Found company: ${this.searchQuery}`);
      }

      this.searchQuery = "";
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: #000;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.stats-image {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.stats-image img {
  max-width: 292px;
  height: auto;
  object-fit: contain;
}
.highlight-text {
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: 0.5rem;
}

.inline-gif {
  width: 66px;
  height: auto;
  position: absolute;
  left: 93%; /* Shift over part of the text */
  top: -10px; /* Slight upward lift */
  transform: rotate(-10deg);
  pointer-events: none;
  z-index: 2;
}

/* Responsive: Stack text and gif on small screens */
@media (max-width: 640px) {
  .highlight-text {
    flex-direction: column;
    align-items: center;
  }

  .inline-gif {
    position: static;
    transform: none;
    margin-top: 0.25rem;
  }
}

.gif-wrapper {
  position: absolute;
  left: -120px; /* Adjust based on your image size */
  top: 0;
  width: 100px;
  height: auto;
}

.hero-block {
  position: relative;
}

.gif-wrapper img {
  width: 100%;
  height: auto;
  display: block;
}

.quote-block {
  text-align: center;
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-style: italic;
  font-size: 1.2rem;
  color: #555;
  /* border-left: 4px solid #ccc; */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Header */
.header {
  /* border-bottom: 1px solid #e5e5e5; */
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

/* Hero Section */
.hero {
  text-align: center;
  padding: 80px 0;
}

.hero h1 {
  font-size: 48px;
  font-weight: 400;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero p {
  font-size: 20px;
  color: #666;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Actions */
.actions {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.action-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-item:hover {
  /* transform: translateY(-2px); */
}

.action-icon {
  width: 60px;
  height: 60px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  transition: all 0.2s;
}

.action-item:hover .action-icon {
  /* background: #000;
  color: #fff; */
  border: 2px solid #000000;
}

.action-label {
  font-weight: 500;
  color: #000;
}

/* Search */
.search-container {
  max-width: 500px;
  margin: 0 auto 60px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 20px 60px 20px 24px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  /* background: #000; */
  color: #030303;
  border: none;
  width: 54px;
  height: 54px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Trust Score */
.trust-score {
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 32px;
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
}

.trust-score-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
}

.star.filled {
  color: #000;
}

.star.empty {
  color: #ccc;
}

.trust-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.trust-reviews {
  color: #666;
  font-size: 14px;
}

/* Stats */
.stats {
  background: #f8f8f8;
  padding: 80px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border: 2px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

/* Categories */
.categories {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 60px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.category-card {
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card:hover {
  border-color: #000;
  /* transform: translateY(-2px); */
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-icon {
  font-size: 32px;
}

.category-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.category-count {
  color: #666;
}

/* Footer */
.footer {
  background: #000;
  color: #fff;
  padding: 24px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.footer-link:hover {
  color: #ccc;
}

/* Pages */
.page {
  min-height: 100vh;
  padding: 80px 0;
  text-align: center;
}

.page h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
}

.page p {
  font-size: 20px;
  color: #666;
  margin-bottom: 40px;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
}

.form-input:focus {
  border-color: #000;
}

.btn-block {
  width: 100%;
  padding: 16px;
  margin-bottom: 16px;
}

.btn-link {
  background: none;
  border: none;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
  padding: 16px;
  width: 100%;
}

/* Mobile */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .hero h1 {
    font-size: 36px;
  }

  .actions {
    gap: 40px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

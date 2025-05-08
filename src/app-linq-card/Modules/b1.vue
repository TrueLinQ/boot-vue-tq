// BusinessCard.vue
<template>
  <div class="root-container">
    <div class="business-card-root">
      <div v-if="isLoading" class="loading-container">
        <div class="loading">Loading...</div>
      </div>
      <div v-else-if="error" class="error-container">
        <div class="error">{{ error }}</div>
      </div>
      <div v-else class="card-container">
        <div class="card" :class="{ flipped: isFlipped }" @click="flipCard">
          <div class="card-face front">
            <div class="brand-pattern"></div>
            <div class="header-container">
              <div class="logo-box" id="frontLogoBox">
                <span v-if="!verificationData.picture" class="logo-placeholder">C</span>
                <img v-else :src="verificationData.picture" alt="Logo" class="logo-image" />
              </div>
              <div class="logo">{{ companyName }}</div>
            </div>

            <div class="section">
              <div class="name">{{ userData.name }}</div>
              <div class="title">{{ cardData.verification.title }}</div>
            </div>

            <div class="contact-info">
              <div class="label">Contact</div>
              <div class="contact">{{ userData.profile.email }}</div>
              <div class="contact" v-if="userData.profile.phone">{{ userData.profile.phone }}</div>
            </div>

            <div class="qr-container">
              <div class="qr-code">
                <img src="/api/placeholder/70/70" alt="Contact QR Code" />
              </div>
            </div>

            <div class="click-hint">Tap to flip</div>
          </div>

          <div class="card-face back">
            <div class="brand-pattern"></div>
            <div class="header-container">
              <div class="logo-box" id="frontLogoBox">
                <img v-if="verificationData.picture" :src="verificationData.picture" alt="Logo" class="logo-image" />
                <span v-else class="logo-placeholder">C</span>
              </div>
              <div class="logo">{{ companyName }}</div>
            </div>

            <div class="section">
              <div class="label">Address</div>
              <div class="contact">{{ formattedAddress }}</div>
            </div>

            <div class="section" v-if="hasWebsite">
              <div class="label">Website</div>
              <div class="contact">{{ websiteFromEmail }}</div>
            </div>

            <div class="social-links">
              <div class="social-icon">in</div>
              <div class="social-icon">fb</div>
              <div class="social-icon">tw</div>
            </div>

            <div class="qr-container">
              <div class="qr-code">
                <img src="/api/placeholder/70/70" alt="Website QR Code" />
              </div>
            </div>

            <div class="click-hint">Tap to flip</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "../services/CardApi.js";
export default {
  name: "BusinessCard",
  data() {
    return {
      isFlipped: false,
      isLoading: true,
      cardData: null,
      error: null,
      verificationId: "6809187bd62b6702f00d00e6",
      membershipId: "680918f0d62b6702f00d00eb",
    };
  },
  created() {
    // if (this.$route.params.verificationId && this.$route.params.membershipId) {
    //   this.verificationId = this.$route.params.verificationId;
    //   this.membershipId = this.$route.params.membershipId;
    // }
    this.fetchCardData();
  },
  mounted() {
    // Theme will be applied after data is loaded
  },
  computed: {
    userData() {
      if (!this.cardData || !this.cardData.user) {
        return {
          name: "Loading...",
          profile: {
            email: "",
            phone: ""
          }
        };
      }
      return this.cardData.user;
    },
    verificationData() {
      if (!this.cardData || !this.cardData.verification) {
        return {
          title: "",
          description: "",
          config: { scheme: "#d4af37" }
        };
      }
      return this.cardData.verification;
    },
    companyName() {
      // Extract company name from API or use default
      return "CONAY";
    },
    formattedAddress() {
      if (!this.verificationData || !this.verificationData.description) {
        return "No address available";
      }
      
      // Split the description into lines and return as address
      const addressLines = this.verificationData.description.split('\n');
      return addressLines;
    },
    websiteFromEmail() {
      if (!this.userData || !this.userData.profile || !this.userData.profile.email) {
        return "";
      }
      
      // Extract domain from email
      const email = this.userData.profile.email;
      const domain = email.split('@')[1];
      return domain || "";
    },
    hasWebsite() {
      return !!this.websiteFromEmail;
    },
    themeColor() {
      // Get color from verification config or use default
      return this.verificationData.config?.scheme || "#d4af37";
    }
  },
  methods: {
    async fetchCardData() {
      this.isLoading = true;
      try {
        // Use the API service
        const response = await apiService.getCardData(this.verificationId, this.membershipId);
        
        if (response && response.results && response.results.length > 0) {
          this.cardData = response.results[0];
          console.log("Card data fetched:", this.cardData);
          this.applyThemeFromApi();
        } else {
          throw new Error("No card data found");
        }
      } catch (err) {
        console.error("Error in component:", err);
        this.error = err.message || "Failed to load card data";
      } finally {
        this.isLoading = false;
      }
    },
    flipCard(e) {
      // Only flip if not clicking on a button
      if (!e.target.closest(".icon-button")) {
        this.isFlipped = !this.isFlipped;
        // Play flip sound
        if (this.$refs.flipSound) {
          this.$refs.flipSound.currentTime = 0;
          this.$refs.flipSound.play();
        }
      }
    },
    applyThemeFromApi() {
      if (!this.cardData || !this.cardData.verification || !this.cardData.verification.config) {
        return;
      }
      
      const colorScheme = this.cardData.verification.config.scheme;
      
      if (!colorScheme) {
        return;
      }
      
      // Apply the color scheme from API
      const primaryColor = colorScheme;
      
      // Generate lighter and darker versions for secondary and accent
      const secondaryColor = this.lightenColor(primaryColor, 30);
      const accentColor = this.darkenColor(primaryColor, 20);
      
      // Convert hex to RGB for gradients
      const primaryRgb = this.hexToRgb(primaryColor);
      const secondaryRgb = this.hexToRgb(secondaryColor);
      const accentRgb = this.hexToRgb(accentColor);
      
      // Set CSS variables
      document.documentElement.style.setProperty("--primary-color", primaryColor);
      document.documentElement.style.setProperty("--secondary-color", secondaryColor);
      document.documentElement.style.setProperty("--accent-color", accentColor);
      document.documentElement.style.setProperty("--primary-color-rgb", primaryRgb);
      document.documentElement.style.setProperty("--secondary-color-rgb", secondaryRgb);
      document.documentElement.style.setProperty("--accent-color-rgb", accentRgb);
    },
    hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Parse RGB components
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    },
    lightenColor(hex, percent) {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Lighten
      r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
      g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
      b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    darkenColor(hex, percent) {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Darken
      r = Math.max(0, Math.floor(r * (1 - percent / 100)));
      g = Math.max(0, Math.floor(g * (1 - percent / 100)));
      b = Math.max(0, Math.floor(b * (1 - percent / 100)));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

/* Root component wrapper to ensure styles are properly scoped */
.business-card-root {
  font-family: "Montserrat", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

:root {
  /* Brand color variables - Default Gold Theme */
  --primary-color: #d4af37;
  --secondary-color: #f2d272;
  --accent-color: #b88a44;
  --text-color: #e0e0e0;
  --background-color: #121212;
  --card-background: rgba(30, 30, 30, 0.97);
  --page-background: #000000;
  --border-color: rgba(255, 255, 255, 0.1);

  /* RGB versions for gradients */
  --primary-color-rgb: 212, 175, 55;
  --secondary-color-rgb: 242, 210, 114;
  --accent-color-rgb: 184, 138, 68;
}

.root-container {
  background-color: #121212;
  margin: 0;
}

.card-container {
  width: 288px;
  height: 448px;
  perspective: 1500px;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container, .error-container {
  width: 288px;
  height: 448px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--card-background);
  border-radius: 16px;
  color: var(--text-color);
  padding: 20px;
}

.loading, .error {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.error {
  color: #e74c3c;
}

.card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center center;
  position: relative;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  background-color: var(--card-background);
  padding: 30px;
  box-sizing: border-box;
  overflow: hidden;
  top: 0;
  left: 0;
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

/* Corner accent design */
.card-face::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  /* background: var(--primary-color); */
  opacity: 0.15;
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  z-index: 1;
}

/* Side accent line */
.card-face::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  /* background: linear-gradient(to bottom, 
      var(--primary-color) 0%, 
      var(--secondary-color) 50%,
      var(--accent-color) 100%); */
  z-index: 2;
}

.brand-pattern {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 120px;
  height: 120px;
  opacity: 0.07;
  z-index: 0;
  /* background-image: repeating-linear-gradient(
      45deg,
      var(--primary-color),
      var(--primary-color) 2px,
      transparent 2px,
      transparent 10px
  ); */
  border-radius: 50%;
}

/* Header layout with logo and name */
.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 3;
}

/* Logo box styling */
.logo-box {
  width: 48px;
  height: 48px;
  background-color: var(--primary-color);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin-right: 15px;
  position: relative;
  overflow: hidden;
}

.logo-box::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  z-index: 1;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 2;
  position: relative;
}

/* Logo text styling */
.logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  z-index: 3;
  transition: background 0.3s ease;
}

.name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: -0.5px;
  color: var(--text-color);
  position: relative;
  z-index: 3;
  border-left: 2px solid var(--primary-color);
  padding-left: 10px;
  margin-left: 5px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 25px;
  letter-spacing: 1px;
  color: var(--text-color);
  position: relative;
  z-index: 3;
  margin-left: 17px;
  transition: color 0.3s ease;
}

.contact-info {
  margin-top: auto;
  position: relative;
  z-index: 3;
  background: linear-gradient(
    90deg,
    rgba(var(--primary-color-rgb), 0.15) 0%,
    rgba(var(--primary-color-rgb), 0.02) 100%
  );
  padding: 15px;
  border-radius: 8px;
  text-align: left;
}

.contact {
  font-size: 13px;
  margin-bottom: 12px;
  color: var(--text-color);
  position: relative;
  z-index: 3;
  text-align: left;
}

.contact:last-child {
  margin-bottom: 0;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  position: relative;
  z-index: 3;
}

.qr-code {
  padding: 5px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.qr-code::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%);
}

.click-hint {
  text-align: center;
  font-size: 11px;
  opacity: 0.6;
  width: 100%;
  font-weight: 500;
  margin-bottom: 15px;
  color: var(--text-color);
  position: relative;
  z-index: 3;
}

.section {
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
  text-align: left;
  align-self: flex-start;
  width: 100%;
}

.label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--accent-color);
  position: relative;
  z-index: 3;
  display: inline-block;
  background-color: rgba(var(--accent-color-rgb), 0.08);
  padding: 3px 8px;
  border-radius: 4px;
  text-align: left;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px 0;
  padding: 10px;
  background: linear-gradient(to right, rgba(var(--primary-color-rgb), 0.1), transparent);
  border-radius: 30px;
}

.social-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
}

/* fix for flip issues */
.card-container {
  perspective: 1000px;
}

.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  -webkit-transform-style: preserve-3d; /* For older Chrome/Safari */
  -webkit-transition: -webkit-transform 0.6s; /* Old WebKit support */
}

.card.is-flipped {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Old Chrome */
}

.card .front,
.card .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  top: 0;
  left: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -moz-backface-visibility: hidden; /* Helps older Firefox versions */
  transform: rotateY(0deg); /* Reset before rotation to ensure visibility */
  -webkit-transform: rotateY(0deg); /* Needed for proper rendering */
}

.card .back {
  transform: rotateY(180deg);
}
</style>
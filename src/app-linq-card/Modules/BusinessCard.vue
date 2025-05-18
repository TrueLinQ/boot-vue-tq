<template>
  <div class="root-container">
    <div class="card-wrapper">
      <div class="business-card-root">
        <div v-if="isLoading" class="loading-container">
          <div class="loading">Loading...</div>
        </div>
        <div v-else-if="error" class="error-container">
          <div class="error">{{ error }}</div>
        </div>
        <div v-else class="card-container">
          <div class="cards" :class="{ flipped: isFlipped }">
            <div class="card-face front">
              <div class="header-container">
                <div v-if="companyLogo" class="logo-box" id="frontLogoBox">
                  <img :src="companyLogo" alt="Logo" class="logo-image" />
                </div>
                <div class="logo">{{ companyName }}</div>
              </div>

              <div class="section" id="frontSection">
                <div class="name">{{ cardData.name }}</div>
                <div class="title">{{ cardData.jobRole || null }}</div>
              </div>

              <div class="contact-info">
                <div class="label">Contact</div>
                <div class="contact">{{ cardData.email }}</div>
                <div class="contact" v-if="cardData.phone">{{ cardData.phone }}</div>
              </div>

              <div class="qr-container">
                <div class="qr-code">
                  <qr-code
                    :value="cardLink"
                    :options="{
                      size: 110,
                      padding: 5,
                    }"
                  ></qr-code>
                </div>
              </div>

              <div class="click-hint" @click="flipCard">Tap to flip</div>
            </div>

            <div class="card-face back">
              <div class="header-container">
                <div v-if="companyLogo" class="logo-box" id="frontLogoBox">
                  <img :src="companyLogo" alt="Logo" class="logo-image" />
                </div>
                <div class="logo">{{ companyName }}</div>
              </div>

              <div class="section" v-if="cardData.address">
                <div class="label">Address</div>
                <div class="contact">{{ cardData.address }}</div>
              </div>

              <div class="section" v-if="website">
                <div class="label">Website</div>
                <div class="contact">{{ website }}</div>
              </div>

              <div class="social-links">
                <div
                  v-for="profile in activeSocialProfiles"
                  :key="profile.provider"
                  class="social-icon"
                  @click.stop="handleSocialClick(profile.link)"
                >
                  <i :class="getSocialIconClass(profile.provider)"></i>
                </div>
              </div>

              <div class="qr-container">
                <div class="qr-code">
                  <qr-code
                    :value="vCardData"
                    :options="{
                      size: 130,
                      padding: 5,
                    }"
                  ></qr-code>
                </div>
              </div>

              <div class="click-hint" @click="flipCard">Tap to flip</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "../services/CardApi.js";
import QrCode from "./Qr.vue"; // Import the QrCode component

export default {
  name: "BusinessCard",
  components: {
    QrCode, // Register the QrCode component
  },
  data() {
    return {
      isFlipped: false,
      isLoading: true,
      apiResponse: null,
      error: null,
      cardId: "card-123", // This would come from your route or props
      vCardData: "", // vCard data for QR code
      // themeColor: themeColorFromCard, // Default theme color
      // verificationId: "68237e44d62b6702e7a54fae",
      // membershipId: "68237e44d62b6702e7a54faf",
      verificationId: "682848fbd62b6748a85eff58",
      membershipId: "682848fbd62b6748a85eff59",
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
    // Apply theme colors once mounted
    this.applyTheme();
  },
  computed: {
    cardData() {
      if (!this.apiResponse || !this.apiResponse.results || !this.apiResponse.results[0]) {
        return {
          name: "Loading...",
          email: "",
          phone: "",
          socialProfiles: [],
        };
      }
      return this.apiResponse.results[0].cardData;
    },
    companyName() {
      return this.cardData.company || "CONAY";
    },
    themeColorFromCard() {
      const theme = this.cardData.theme;
      return theme && theme.toLowerCase() !== "alvia" ? theme : "#d4af37"; // Default color
    },

    companyLogo() {
      return this.cardData.companyLogo || null;
    },
    website() {
      return this.cardData.website || null;
    },
    cardLink() {
      // Generate public card link
      return `https://app.conay.com/card/${this.cardId}`;
    },
    activeSocialProfiles() {
      // Return only social profiles that have a link
      return (this.cardData.socialProfiles || []).filter((profile) => profile.link);
    },
  },
  methods: {
    async fetchCardData() {
      this.isLoading = true;
      try {
        // Use the API service
        const response = await apiService.getCardData(this.verificationId, this.membershipId);

        if (response && response.results && response.results.length > 0) {
          this.apiResponse = response; // Store the entire response
          this.generateVCardData(); // Generate vCard after data is loaded
          this.applyTheme();
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
    generateVCardData() {
      // Create a basic vCard format
      const name = this.cardData.name || "";
      const email = this.cardData.email || "";
      const phone = this.cardData.phone || "";
      const company = this.companyName || "";

      this.vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
EMAIL:${email}
TEL:${phone}
END:VCARD`;
    },
    flipCard() {
      this.isFlipped = !this.isFlipped;
    },
    applyTheme() {
      const theme = this.themeColorFromCard;

      // Set CSS variables for theme colors
      document.documentElement.style.setProperty("--primary-color", theme);
      document.documentElement.style.setProperty("--secondary-color", this.lightenColor(theme, 30));
      document.documentElement.style.setProperty("--accent-color", this.darkenColor(theme, 20));

      // Convert hex to RGB for gradients
      const primaryRgb = this.hexToRgb(theme);
      const secondaryRgb = this.hexToRgb(this.lightenColor(theme, 30));
      const accentRgb = this.hexToRgb(this.darkenColor(theme, 20));

      document.documentElement.style.setProperty("--primary-color-rgb", primaryRgb);
      document.documentElement.style.setProperty("--secondary-color-rgb", secondaryRgb);
      document.documentElement.style.setProperty("--accent-color-rgb", accentRgb);
    },
    hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace("#", "");

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
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    },
    getSocialIconClass(provider) {
      const icons = {
        linkedin: "fab fa-linkedin-in",
        facebook: "fab fa-facebook-f",
        twitter: "fab fa-twitter",
        whatsapp: "fab fa-whatsapp",
        instagram: "fab fa-instagram",
        google: "fab fa-google",
        github: "fab fa-github",
        youtube: "fab fa-youtube",
        tiktok: "fab fa-tiktok",
        pinterest: "fab fa-pinterest-p",
        snapchat: "fab fa-snapchat-ghost",
        reddit: "fab fa-reddit-alien",
        discord: "fab fa-discord",
        telegram: "fab fa-telegram-plane",
        medium: "fab fa-medium-m",
        behance: "fab fa-behance",
        dribbble: "fab fa-dribbble",
        mobile: "fas fa-phone",
      };

      return icons[provider.toLowerCase()] || "fas fa-link";
    },
    // Add this method to your methods object
    // Updated method with explicit event parameter
    handleSocialClick(link) {
      // Prevent the card from flipping when clicking social links
      event.stopPropagation();

      // Open the link in a new tab
      window.open(link, "_blank", "noopener,noreferrer");

      // Return false to prevent any default behavior
      return false;
    },
    shareCard() {
      if (navigator.share) {
        navigator
          .share({
            title: `${this.cardData.name}'s Business Card`,
            text: `Check out ${this.cardData.name}'s digital business card`,
            url: this.cardLink,
          })
          .catch((err) => console.error("Share failed:", err));
      } else {
        // Fallback - copy link to clipboard
        navigator.clipboard
          .writeText(this.cardLink)
          .then(() => alert("Card link copied to clipboard!"))
          .catch((err) => console.error("Copy failed:", err));
      }
    },
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
  /* min-height: 448px ;
  max-height: max-content; */
  min-height: 100vh;
  /* height: 100vh; */
  position: relative;
  background: #000000;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
}

body {
  background: #000000;
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

/* .root-container {
  background-color: #121212;
  margin: 0;
} */

.root-container {
  background-color: #000000;
  margin: 0;
  min-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding: 16px 0;
}
.card-container {
  width: 288px;
  /* height: 448px; */
  min-height: 448px;
  max-height: max-content;
  perspective: 1500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: -4rem;
}

.loading-container,
.error-container {
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

.loading,
.error {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.error {
  color: #e74c3c;
}

.cards {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center center;
  position: relative;
}

.cards.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  /* height: 100%; */
  min-height: 100%;
  height: auto;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  background-color: var(--card-background);
  padding: 30px;
  box-sizing: border-box;
  /* overflow: hidden; */
  top: 0;
  left: 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
}

/* Back face rotation */
.card-face.back {
  transform: rotateY(180deg);
}

/* Corner accent design */
.card-face::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  opacity: 0.15;
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  z-index: 1;
}

/* Header layout with logo and name */
.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  position: relative;
  z-index: 3;
}

/* Logo box styling */
.logo-box {
  width: 48px;
  height: 48px;
  /* background-color: var(--primary-color); */
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3); */
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
  /* background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.05) 100%
  ); */
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

#frontSection {
  margin-bottom: 0;
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
  text-align: left;
  line-height: 20px;
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
  margin: 8px 0 0 0;
  position: relative;
  z-index: 3;
}

.qr-code {
  padding-bottom: 4px;
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
  cursor: pointer;
  padding: 5px 0;
}

.section {
  position: relative;
  z-index: 3;
  text-align: left;
  align-self: flex-start;
  width: 100%;
  margin-bottom: 20px;
}

.section:last-child {
  margin-bottom: 0;
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
  margin: 8px 0;
  padding: 10px;
  background: rgba(var(--primary-color-rgb), 0.1);
  border-radius: 30px;
}

/* .social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
  text-decoration: none;
} */
.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}

.social-icon i {
  /* display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; */
  pointer-events: none;
}

/* Logo placeholder styling */
.logo-placeholder {
  font-size: 24px;
  font-weight: bold;
  color: white;
}
</style>

// BusinessCard.vue
<template>
  <div class="root-container">
    <div class="business-card-root">
      <!-- Controls container with color options -->
      <div class="controls-container">
        <div
          v-for="color in colorOptions"
          :key="color.name"
          :class="['color-option', `color-${color.name}`, { active: activeColor === color.name }]"
          :data-color="color.name"
          @click="changeColor(color.name)"
        ></div>
      </div>

      <div class="card-container">
        <div class="card" :class="{ flipped: isFlipped }" @click="flipCard">
          <div class="card-face front">
            <div class="brand-pattern"></div>
            <!-- <div class="logo">CONAY</div> -->
            <div class="header-container">
              <div class="logo-box" id="frontLogoBox">
                <!-- Logo placeholder - will be replaced with actual logo in the future -->
                <span class="logo-placeholder">C</span>
              </div>
              <div class="logo">CONAY</div>
            </div>

            <div class="section">
              <div class="name">Alex Morgan</div>
              <div class="title">Product Designer</div>
            </div>

            <div class="contact-info">
              <div class="label">Contact</div>
              <div class="contact">alex@conay.design</div>
              <div class="contact">+1 (555) 123-4567</div>
            </div>

            <div class="qr-container">
              <div class="qr-code">
                <img src="/api/placeholder/70/70" alt="Contact QR Code" />
              </div>
            </div>

            <div class="click-hint">Tap to flip</div>

            <!-- <div class="action-icons">
              <button class="icon-button download-btn" @click.stop="downloadCard">
                <span class="icon">⬇️</span>
              </button>
              <button class="icon-button share-btn" @click.stop="shareCard">
                <span class="icon">🔗</span>
              </button>
            </div> -->
          </div>

          <div class="card-face back">
            <div class="brand-pattern"></div>
            <!-- <div class="logo">CONAY</div> -->
            <div class="header-container">
              <div class="logo-box" id="frontLogoBox">
                <!-- Logo placeholder - will be replaced with actual logo in the future -->
                <span class="logo-placeholder">C</span>
              </div>
              <div class="logo">CONAY</div>
            </div>

            <div class="section">
              <div class="label">Address</div>
              <div class="contact">123 Design Avenue</div>
              <div class="contact">San Francisco, CA 94107</div>
            </div>

            <div class="section">
              <div class="label">Website</div>
              <div class="contact">conay.design</div>
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

            <!-- <div class="action-icons">
              <button class="icon-button download-btn" @click.stop="downloadCard">
                <span class="icon">⬇️</span>
              </button>
              <button class="icon-button share-btn" @click.stop="shareCard">
                <span class="icon">🔗</span>
              </button>
            </div> -->
          </div>
        </div>
      </div>

      <!-- Audio element for the flip sound -->
      <!-- <audio ref="flipSound" src="./cflip.mp3"></audio> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "BusinessCard",
  data() {
    return {
      isFlipped: false,
      activeColor: "gold",
      colorOptions: [{ name: "gold" }, { name: "blue" }, { name: "green" }, { name: "red" }, { name: "purple" }],
      themes: {
        gold: {
          primary: "#d4af37",
          secondary: "#f2d272",
          accent: "#b88a44",
          primaryRgb: "212, 175, 55",
          secondaryRgb: "242, 210, 114",
          accentRgb: "184, 138, 68",
        },
        blue: {
          primary: "#3498db",
          secondary: "#85c1e9",
          accent: "#2874a6",
          primaryRgb: "52, 152, 219",
          secondaryRgb: "133, 193, 233",
          accentRgb: "40, 116, 166",
        },
        green: {
          primary: "#27ae60",
          secondary: "#82e0aa",
          accent: "#196f3d",
          primaryRgb: "39, 174, 96",
          secondaryRgb: "130, 224, 170",
          accentRgb: "25, 111, 61",
        },
        red: {
          primary: "#e74c3c",
          secondary: "#f5b7b1",
          accent: "#943126",
          primaryRgb: "231, 76, 60",
          secondaryRgb: "245, 183, 177",
          accentRgb: "148, 49, 38",
        },
        purple: {
          primary: "#9b59b6",
          secondary: "#d7bde2",
          accent: "#6c3483",
          primaryRgb: "155, 89, 182",
          secondaryRgb: "215, 189, 226",
          accentRgb: "108, 52, 131",
        },
      },
    };
  },
  mounted() {
    // Apply default theme on mount
    this.applyTheme(this.activeColor);
  },
  methods: {
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
    downloadCard(e) {
      e.stopPropagation();
      alert("Download functionality would go here");
    },
    shareCard(e) {
      e.stopPropagation();
      alert("Share functionality would go here");
    },
    changeColor(color) {
      this.activeColor = color;
      this.applyTheme(color);
    },
    applyTheme(color) {
      const theme = this.themes[color];
      document.documentElement.style.setProperty("--primary-color", theme.primary);
      document.documentElement.style.setProperty("--secondary-color", theme.secondary);
      document.documentElement.style.setProperty("--accent-color", theme.accent);
      document.documentElement.style.setProperty("--primary-color-rgb", theme.primaryRgb);
      document.documentElement.style.setProperty("--secondary-color-rgb", theme.secondaryRgb);
      document.documentElement.style.setProperty("--accent-color-rgb", theme.accentRgb);
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

.action-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 5px;
  position: relative;
  z-index: 3;
}

.icon-button {
  width: 40px;
  height: 40px;
  background: none;
  border: 1px solid #dddddd;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.03);
  border-color: var(--primary-color);
}

.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.back {
  transform: rotateY(180deg);
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

/* Controls container */
.controls-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 100;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 0 2px black;
}

/* Color options */
.color-gold {
  background-color: #d4af37;
}

.color-blue {
  background-color: #3498db;
}

.color-green {
  background-color: #27ae60;
}

.color-red {
  background-color: #e74c3c;
}

.color-purple {
  background-color: #9b59b6;
}
/* flip issue fix */
.card-container {
  perspective: 1000px;
}

.card {
  /* width: 300px;
  height: 200px; */
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

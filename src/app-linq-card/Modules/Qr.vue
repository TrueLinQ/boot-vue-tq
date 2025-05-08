<template>
    <div class="qr-containers" :style="containerStyle">
      <canvas ref="qrCanvas" class="qr-canvas"></canvas>
    </div>
  </template>
  
  <script>
  import QRCode from 'qrcode';
  
  export default {
    name: "QrCode",
    props: {
      value: {
        type: String,
        required: true,
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        defaultOptions: {
          size: 150,
          padding: 10,
          level: "H",
          background: "#FFFFFF",
          foreground: "#000000",
        },
      };
    },
    computed: {
      mergedOptions() {
        return { ...this.defaultOptions, ...this.options };
      },
      containerStyle() {
        return {
          width: `${this.mergedOptions.size}px`,
          height: `${this.mergedOptions.size}px`,
        };
      },
    },
    watch: {
      value: {
        handler() {
          this.$nextTick(() => {
            this.generateQrCode();
          });
        },
        immediate: true,
      },
      options: {
        handler() {
          this.$nextTick(() => {
            this.generateQrCode();
          });
        },
        deep: true,
      },
    },
    mounted() {
      this.generateQrCode();
    },
    methods: {
      generateQrCode() {
        if (!this.value || !this.$refs.qrCanvas) {
          return;
        }
        
        try {
          // Convert error correction level
          const errorCorrectionLevel = {
            'L': 'L', // 7%
            'M': 'M', // 15%
            'Q': 'Q', // 25%
            'H': 'H'  // 30%
          }[this.mergedOptions.level] || 'H';
          
          // Generate QR code
          QRCode.toCanvas(this.$refs.qrCanvas, this.value, {
            width: this.mergedOptions.size,
            margin: this.mergedOptions.padding,
            color: {
              dark: this.mergedOptions.foreground,
              light: this.mergedOptions.background
            },
            errorCorrectionLevel
          }, (error) => {
            if (error) {
              console.error('Error generating QR code:', error);
              this.$emit("error", error);
            } else {
              this.$emit("generated", this.$refs.qrCanvas.toDataURL());
            }
          });
        } catch (error) {
          console.error("Failed to generate QR code:", error);
          this.$emit("error", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .qr-containers {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .qr-canvas {
    width: 100%;
    height: 100%;
  }
  </style>
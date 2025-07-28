<template>
  <div class="loader-overlay">
    <div class="spinner">
      <Loader :size="24" class="spinner-icon" />
    </div>
  </div>
</template>

<script>
import { Loader } from "lucide-vue";

export default {
  name: "FullScreenLoader",
  components: { Loader },
};
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner-icon {
  animation: spin 1s linear infinite;
  color: #333;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

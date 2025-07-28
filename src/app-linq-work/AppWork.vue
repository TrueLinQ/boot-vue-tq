<template>
  <div class="app">
    <AuthLayout />
  </div>
</template>

<script>
import AuthLayout from "./components/AuthLayout.vue";

export default {
  name: "AppWork",
  components: {
    AuthLayout,
  },
};
</script>

<style>
* {
  box-sizing: border-box;

  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
}

body {
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
  background: #fff;
  color: #000;
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  background: #fff;
  color: #000;
}

/* Global button styles to match your theme */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
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

.btn-secondary {
  background: transparent;
  color: #000;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #ccc;
  background: #f8f8f8;
}

/* Global container styles */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Global card styles */
.card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

/* Global form styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #000;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.form-input::placeholder {
  color: #999;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }

  .card {
    padding: 24px;
  }
}
</style>

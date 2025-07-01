<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-logo">TruePilot</div>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Contact Us</a>
      </div>
      <div class="footer-copyright">
        &copy; {{ new Date().getFullYear() }} TruePilot. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.footer {
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-md) 0;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.footer-logo {
  font-size: 20px;
  font-weight: 700;
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease-in-out;
}

.footer-link:hover {
  color: #ccc;
}

.footer-copyright {
  font-size: 14px;
  color: #ccc;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
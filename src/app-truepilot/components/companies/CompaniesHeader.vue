<template>
  <div class="header-section">
    <h1>Browse Companies</h1>
    <p>Discover and explore companies based on authentic reviews</p>
    <div class="stats-image">
      <img src="../../assets/images/love-doodle.png" alt="Companies Illustration" />
    </div>
  </div>
</template>

<script setup>
// No script needed for this simple display component
</script>

<style scoped>
/* Scoped styles for CompaniesHeader */
.header-section {
  text-align: center;
  margin-bottom: var(--spacing-xxl); /* Using a variable from base.css */
}

.header-section h1 {
  font-size: var(--font-size-xxl); /* Using a variable from base.css */
  font-weight: var(--font-weight-semibold); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  margin-bottom: var(--spacing-sm); /* Using a variable from base.css */
  letter-spacing: -0.01em;
}

.header-section p {
  font-size: var(--font-size-md); /* Using a variable from base.css */
  color: var(--color-text-light); /* Using a variable from base.css */
  margin: 0;
  font-weight: var(--font-weight-regular); /* Using a variable from base.css */
}

.stats-image {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xxl); /* Add some space above the image */
}

.stats-image img {
  max-width: 292px;
  height: auto;
  object-fit: contain;
}
</style>
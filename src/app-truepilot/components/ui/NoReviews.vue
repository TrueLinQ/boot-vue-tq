<template>
  <div class="no-reviews">
    <div class="no-reviews-icon">
      <svg class="star-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="16"></line>
      </svg>
    </div>
    <h3>No Reviews Yet</h3>
    <p>Be the first to share your experience with this company!</p>
  </div>
</template>

<script>
export default {
  name: 'NoReviews'
};
</script>

<style scoped>
.no-reviews {
  text-align: center;
  padding: 60px 20px;
  color: var(--secondary-color);
}

.no-reviews-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--border-color); /* Adjust icon color */
}

.no-reviews-icon svg {
  width: 48px;
  height: 48px;
}

.no-reviews h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 8px 0;
}

.no-reviews p {
  font-size: 16px;
  margin: 0;
}
</style>
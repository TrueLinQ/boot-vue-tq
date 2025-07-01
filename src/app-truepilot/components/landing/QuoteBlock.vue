<template>
  <div class="quote-block">
    <p class="quote">“Your voice builds trust. Share your experience, shape the future.”</p>
  </div>
</template>

<script>
export default {
  name: 'QuoteBlock',
};
</script>

<style scoped>
.quote-block {
  text-align: center;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--color-light-text);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
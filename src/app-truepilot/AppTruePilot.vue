<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
import AppFooter from './components/common/AppFooter.vue';

export default {
  name: 'AppTruePilot',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
/* Global styles specific to App.vue can go here, though most should be in base.css or component-specific */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; /* Ensures main content takes up available space */
}

.page {
  /* Basic page padding to ensure content isn't too close to header/footer */
  min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
  padding: var(--spacing-xxl) 0;
}
</style>
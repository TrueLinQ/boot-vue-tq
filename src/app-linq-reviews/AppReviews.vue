<template>
  <div class="app">
    <!-- <AuthLayout /> -->
     <router-view></router-view>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import AuthLayout from '../app-linq-work/components/AuthLayout.vue';

export default {
  name: "AppReviews",
  components: {
    // AuthLayout,
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
</style>

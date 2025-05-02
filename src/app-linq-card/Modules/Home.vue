<template>
  <div class="">
    <!-- <div class="pane">THis is card</div> -->
    <BusinessCard />
  </div>
</template>

<script>
import BusinessCard from "./BusinessCard.vue"; 

export default {
  name: "Home",
  components: {
    BusinessCard, 
  },
  data() {
    return {};
  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>

<style>
.container {
  max-width: 600px;
}
</style>

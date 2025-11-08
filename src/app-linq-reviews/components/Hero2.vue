<template>
  <div class="compact-search-bar">
    <CompanySearch :simple-search="true" @company-selected="handleCompanySelected" />
    <WriteReviewButton @click="handleWriteReview" />
  </div>
</template>

<script>
import CompanySearch from './SearchDropdown.vue';
import WriteReviewButton from './WriteReviewButton.vue';

export default {
  name: "Hero2",

  components: {
    CompanySearch,
    WriteReviewButton,
  },

  emits: ['company-selected', 'write-review'],

  methods: {
    handleCompanySelected(company) {
      this.$emit('company-selected', company);
    },

    handleWriteReview() {
      this.$emit('write-review');
    },
  },
};
</script>

<style scoped>
.compact-search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.compact-search-bar> :first-child {
  flex: 1;
  min-width: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .compact-search-bar {
    flex-direction: column;
    gap: 10px;
  }

  .compact-search-bar> :first-child {
    width: 100%;
  }
}
</style>
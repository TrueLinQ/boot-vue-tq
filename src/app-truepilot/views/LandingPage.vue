<template>
  <div class="home-page">
    <HeroSection>
      <template #actions>
        <ActionButtons />
      </template>
      <template #search>
        <SearchBar v-model="searchQuery" @search="handleSearch" />
      </template>
    </HeroSection>

    <section>
      <div class="stats-image">
        <img src="../assets/images/love-doodle.png" alt="Stats Illustration" />
      </div>
      <QuoteBlock />
    </section>

    <ReviewSlider />

    <CategoriesSection />
  </div>
</template>

<script>
import HeroSection from '../components/landing/HeroSection.vue';
import ActionButtons from '../components/landing/ActionButtons.vue';
import SearchBar from '../components/common/SearchBar.vue';
import QuoteBlock from '../components/landing/QuoteBlock.vue';
import CategoriesSection from '../components/landing/CategoriesSection.vue';
import ReviewSlider from '../components/landing/ReviewSlider.vue';

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    ActionButtons,
    SearchBar,
    QuoteBlock,
    CategoriesSection,
    ReviewSlider,
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    handleSearch(query) {
      if (!query.trim()) return;

      const companies = [
        "apple", "google", "microsoft", "amazon", "facebook",
        "tesla", "netflix", "spotify", "uber", "airbnb",
      ];
      const found = companies.some((company) => company.includes(query.toLowerCase()));

      if (!found) {
        this.$router.push({ name: 'CreateCompany', query: { company: query } });
      } else {
        alert(`Found company: ${query}`); // In a real app, navigate to company page
      }

      this.searchQuery = ''; // Clear search
    },
  },
};
</script>

<style scoped>
.stats-image {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.stats-image img {
  max-width: 292px;
  height: auto;
  object-fit: contain;
}
</style>
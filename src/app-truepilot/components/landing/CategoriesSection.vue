<template>
  <section class="categories section-padding">
    <div class="container">
      <h2 class="section-title">Popular Categories</h2>
      <div class="categories-grid">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          @click="handleCategoryClick(category.name)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import CategoryCard from "../ui/CategoryCard.vue";

export default {
  name: 'CategoriesSection',
  components: {
    CategoryCard,
  },
  data() {
    return {
      categories: [
        { name: "Electronics & Technology", count: "12,543", icon: "Monitor" },
        { name: "Shopping & Fashion", count: "18,291", icon: "ShoppingBag" },
        { name: "Travel & Vacation", count: "9,876", icon: "Plane" },
        { name: "Health & Medical", count: "7,432", icon: "Heart" },
        { name: "Business Services", count: "15,678", icon: "Briefcase" },
        { name: "Money & Insurance", count: "5,321", icon: "DollarSign" },
      ],
    };
  },
  methods: {
    handleCategoryClick(categoryName) {
      // You can pass the category name as a prop or query param to the explore page
      this.$router.push({ name: 'ExploreCategory', params: { category: categoryName } });
    },
  },
};
</script>

<style scoped>
.section-title {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
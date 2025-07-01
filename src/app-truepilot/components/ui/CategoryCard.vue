<template>
  <div class="category-card" @click="$emit('click')">
    <div class="category-header">
      <div></div>
      <div class="category-icon">
        <component :is="category.icon" :size="32" />
      </div>
      <ArrowRight :size="20" />
    </div>
    <h3 class="category-name">{{ category.name }}</h3>
    <p class="category-count">{{ category.count }} companies</p>
  </div>
</template>

<script>
import { ArrowRight, Monitor, ShoppingBag, Plane, Heart, Briefcase, DollarSign } from "lucide-vue";

export default {
  name: 'CategoryCard',
  components: {
    ArrowRight,
    Monitor, ShoppingBag, Plane, Heart, Briefcase, DollarSign // Import all possible icons
  },
  props: {
    category: {
      type: Object,
      required: true,
      validator: (value) =>
        typeof value.name === 'string' &&
        typeof value.count === 'string' &&
        typeof value.icon === 'string',
    },
  },
};
</script>

<style scoped>
.category-card {
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xxl);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.category-card:hover {
  border-color: var(--color-primary);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.category-icon {
  font-size: 32px;
}

.category-name {
  margin-bottom: var(--spacing-xs);
}

.category-count {
  color: var(--color-light-text);
}
</style>
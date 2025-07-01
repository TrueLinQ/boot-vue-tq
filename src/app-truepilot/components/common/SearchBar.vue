<template>
  <div class="search-container">
    <input
      type="text"
      v-model="internalSearchQuery"
      @keyup.enter="handleSearch"
      placeholder="Search for any company..."
      class="search-input"
    />
    <button @click="handleSearch" class="search-btn">
      <Search :size="20" />
    </button>
  </div>
</template>

<script>
import { Search } from "lucide-vue";

export default {
  name: 'SearchBar',
  components: { Search },
  props: {
    modelValue: String, // Use modelValue for v-model compatibility
  },
  data() {
    return {
      internalSearchQuery: this.modelValue || '',
    };
  },
  watch: {
    modelValue(newValue) {
      this.internalSearchQuery = newValue;
    },
    internalSearchQuery(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.internalSearchQuery);
    },
  },
};
</script>

<style scoped>
.search-container {
  max-width: 500px;
  margin: 0 auto var(--spacing-xl);
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  outline: none;
}

.search-btn {
  position: absolute;
  right: var(--spacing-xs);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text);
  border: none;
  width: 54px;
  height: 54px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none; /* Ensure no default background */
}
</style>
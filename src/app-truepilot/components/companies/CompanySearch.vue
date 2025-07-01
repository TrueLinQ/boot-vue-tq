<template>
  <div class="search-input-wrapper">
    <SearchIcon class="search-icon" :size="20" />
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="search-input"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import { Search as SearchIcon } from "lucide-vue";

defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: "Search...",
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
/* Scoped styles for SearchBar - these will use base.css variables/mixins if defined */
.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light); /* Using a variable from base.css */
}

.search-input {
  width: 100%;
  border: 1px solid var(--color-border); /* Using a variable from base.css */
  border-radius: var(--border-radius-md); /* Using a variable from base.css */
  padding: 12px 16px 12px 48px;
  font-size: var(--font-size-md); /* Using a variable from base.css */
  transition: var(--transition-ease); /* Using a variable from base.css */
  background: var(--color-background); /* Using a variable from base.css */
  color: var(--color-text); /* Using a variable from base.css */
  font-weight: var(--font-weight-regular); /* Using a variable from base.css */
  font-family: inherit;
}

.search-input:focus {
  border-color: var(--color-primary); /* Using a variable from base.css */
  outline: none;
  box-shadow: none;
}

.search-input::placeholder {
  color: var(--color-text-light); /* Using a variable from base.css */
}
</style>
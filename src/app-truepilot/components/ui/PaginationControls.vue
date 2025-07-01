<template>
  <div v-if="totalPages > 1" class="pagination-section">
    <button @click="$emit('prev-page')" :disabled="currentPage === 1" class="pagination-btn">
      Previous
    </button>

    <div class="pagination-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('go-to-page', page)"
        :class="['pagination-number', { active: page === currentPage }]"
      >
        {{ page }}
      </button>
    </div>

    <button @click="$emit('next-page')" :disabled="currentPage === totalPages" class="pagination-btn">
      Next
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

defineEmits(['prev-page', 'next-page', 'go-to-page']);

const visiblePages = computed(() => {
  const pages = [];
  let start = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<style scoped>
/* Scoped styles for PaginationControls */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md); /* Using a variable from base.css */
  margin-top: var(--spacing-xxl); /* Using a variable from base.css */
  padding: var(--spacing-lg) 0; /* Using a variable from base.css */
}

.pagination-btn {
  background: var(--color-background); /* Using a variable from base.css */
  border: 1px solid var(--color-border); /* Using a variable from base.css */
  border-radius: var(--border-radius-md); /* Using a variable from base.css */
  padding: 10px 16px;
  font-size: var(--font-size-sm); /* Using a variable from base.css */
  font-weight: var(--font-weight-medium); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  cursor: pointer;
  transition: var(--transition-ease); /* Using a variable from base.css */
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary); /* Using a variable from base.css */
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: var(--spacing-sm); /* Using a variable from base.css */
}

.pagination-number {
  background: var(--color-background); /* Using a variable from base.css */
  border: 1px solid var(--color-border); /* Using a variable from base.css */
  border-radius: var(--border-radius-md); /* Using a variable from base.css */
  padding: 10px 14px;
  font-size: var(--font-size-sm); /* Using a variable from base.css */
  font-weight: var(--font-weight-medium); /* Using a variable from base.css */
  color: var(--color-heading); /* Using a variable from base.css */
  cursor: pointer;
  transition: var(--transition-ease); /* Using a variable from base.css */
  min-width: 44px;
}

.pagination-number:hover {
  border-color: var(--color-primary); /* Using a variable from base.css */
}

.pagination-number.active {
  background: var(--color-primary); /* Using a variable from base.css */
  color: var(--color-white); /* Using a variable from base.css */
  border-color: var(--color-primary); /* Using a variable from base.css */
}

@media (max-width: 768px) {
  .pagination-section {
    gap: var(--spacing-md); /* Using a variable from base.css */
  }

  .pagination-numbers {
    gap: var(--spacing-xs); /* Using a variable from base.css */
  }

  .pagination-number {
    padding: 8px 12px;
    min-width: 40px;
  }
}
</style>
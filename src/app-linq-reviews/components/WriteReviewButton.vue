<template>
  <button @click="handleClick" class="write-review-btn">
    <span>Write a Review</span>
    <ArrowRight :size="16" />
  </button>
</template>

<script>
import { ArrowRight } from 'lucide-vue';

export default {
  name: 'WriteReviewButton',
  components: {
    ArrowRight,
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.write-review-btn {
  background: #000;
  color: #fff;
  font-size: 0.9rem;
  padding: 10px 18px;
  white-space: nowrap;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.write-review-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

.write-review-btn:active {
  transform: translateY(0);
}
</style>
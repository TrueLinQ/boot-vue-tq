<template>
  <a :href="website" target="_blank" rel="noopener noreferrer" class="visit-website-btn">
    <span>Visit Website</span>
    <ArrowUpRight :size="16" />
  </a>
</template>

<script>
import { ArrowUpRight } from 'lucide-vue';


export default {
  name: 'VisitWebsiteButton',
  components: {
    ArrowUpRight,
  },
  props: {
    website: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.visit-website-btn {
  background: #fff;
  color: #000;
  font-size: 0.9rem;
  padding: 10px 18px;
  white-space: nowrap;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;
}

.visit-website-btn:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.visit-website-btn:active {
  transform: translateY(0);
}
</style>
<template>
  <div class="actions">
    <div v-for="(action, index) in actions" :key="index" class="action-item" @click="handleAction(action.route)">
      <div class="action-icon">
        <component :is="action.icon" :size="24" />
      </div>
      <div class="action-label">{{ action.label }}</div>
    </div>
  </div>
</template>

<script>
import { Edit, Search, Building, MessageSquare } from "lucide-vue";

export default {
  name: 'ActionButtons',
  components: {
    Edit, Search, Building, MessageSquare
  },
  data() {
    return {
      actions: [
        { icon: "Edit", label: "Write Review", route: "/write-review" },
        { icon: "Search", label: "Find Companies", route: "/explore-categories" },
        { icon: "Building", label: "Post Ad", route: "/business" },
        { icon: "MessageSquare", label: "View Reviews", route: "/reviews" },
      ],
    };
  },
  methods: {
    handleAction(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
  flex-wrap: wrap;
}

.action-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-icon {
  width: 60px;
  height: 60px;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-sm);
  transition: all 0.2s;
}

.action-item:hover .action-icon {
  border: 2px solid var(--color-primary);
}

.action-label {
  font-weight: 500;
  color: var(--color-text);
}
</style>
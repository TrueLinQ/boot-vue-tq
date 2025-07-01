<template>
  <div class="company-header-section">
    <div class="company-main-info">
      <div class="company-logo-large">
        <img :src="company.logo" :alt="company.name + ' logo'" />
      </div>
      <div class="company-details">
        <h1 class="company-title">{{ company.name }}</h1>
        <span class="company-category-badge">{{ getCategoryName(company.category) }}</span>
        <div class="company-meta">
          <span class="meta-item">Founded: {{ company.founded }}</span>
          <span class="meta-divider">•</span>
          <span class="meta-item">{{ company.employees }} employees</span>
        </div>
        <p class="company-description">{{ company.description }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="$emit('write-review')" class="btn-primary">
        <Edit3 :size="16" />
        Write Review
      </button>
      <button @click="$emit('visit-website')" class="btn-secondary">
        <ExternalLink :size="16" />
        Visit Website
      </button>
    </div>
  </div>
</template>

<script>
import { Edit3, ExternalLink } from "lucide-vue";

export default {
  name: "CompanyDetail",
  components: {
    Edit3,
    ExternalLink,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  emits: ['write-review', 'visit-website'],
  methods: {
    getCategoryName(category) {
      const categories = {
        technology: "Technology",
        healthcare: "Healthcare",
        finance: "Finance",
        retail: "Retail",
        education: "Education",
        food: "Food & Beverage",
        automotive: "Automotive",
        "real-estate": "Real Estate",
      };
      return categories[category] || category;
    },
  },
};
</script>

<style scoped>
.company-header-section {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
}

.company-main-info {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.company-logo-large {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.company-logo-large img {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-lg);
  object-fit: cover;
}

.company-details {
  flex: 1;
  min-width: 0;
}

.company-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.2;
}

.company-category-badge {
  display: inline-block;
  background: var(--color-gray-light);
  color: var(--color-text-dark);
  padding: 6px var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-md);
}

.company-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--font-size-sm);
  color: var(--color-light-text);
  font-weight: var(--font-weight-medium);
}

.meta-divider {
  color: var(--color-gray);
}

.company-description {
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: var(--color-light-text);
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-ease);
}

.btn-primary:hover {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-white);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  padding: 10px 18px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-ease);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .company-header-section {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .company-main-info {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .company-logo-large {
    align-self: center;
    width: 80px;
    height: 80px;
  }

  .company-title {
    font-size: var(--font-size-xl);
    text-align: center;
  }

  .company-meta {
    justify-content: center;
  }

  .company-description {
    text-align: center;
  }

  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .company-title {
    font-size: var(--font-size-lg);
  }
}
</style>
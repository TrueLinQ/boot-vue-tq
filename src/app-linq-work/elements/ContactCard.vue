<template>
  <div class="contact-option-card">
    <div class="contact-option-header">
      <div class="contact-option-icon">
        <component :is="icon" :size="24" />
      </div>
      <div class="contact-option-info">
        <h4>{{ title }}</h4>
        <p>{{ number }}</p>
      </div>
    </div>
     
    <div v-if="linked" class="status-linked">
      <span>Linked</span>
    </div>
    <button
      v-else
      @click="onLink"
      :disabled="linking"
      :class="['btn', linking ? 'btn-loading' : 'btn-primary']"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ContactCard',
  props: {
    title: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    linked: {
      type: Boolean,
      default: false
    },
    linking: {
      type: Boolean,
      default: false
    },
    icon: {
      required: true
    },
    hasVerifiedNumber: {
      type: Boolean,
      default: false
    }
  },
  emits: ['link'],
  setup(props, { emit }) {
    const onLink = () => {
      emit('link')
    }

    const buttonText = computed(() => {
      if (props.linking) {
        return props.hasVerifiedNumber ? "Linking..." : "Verifying..."
      }
      return props.hasVerifiedNumber ? "Link Now" : "Verify Now"
    })

    return {
      onLink,
      buttonText
    }
  }
}
</script>

<style scoped>
.contact-option-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-option-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-option-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-option-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f5f5f5;
  color: #666;
}

.contact-option-info {
  flex-grow: 1;
}

.contact-option-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.contact-option-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  text-align: center;
  position: relative;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-loading {
  background: #f5f5f5 !important;
  color: #999 !important;
  cursor: not-allowed !important;
}

.btn-loading:hover {
  transform: none !important;
  background: #f5f5f5 !important;
}
.status-linked{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #25d366;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.9rem;
    justify-content: center;
}
</style>

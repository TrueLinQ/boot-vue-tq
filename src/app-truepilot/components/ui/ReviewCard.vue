<template>
  <div class="review-card">
    <div class="review-header">
      <div class="reviewer-info">
        <div class="reviewer-avatar">
          {{ review.author.charAt(0).toUpperCase() }}
        </div>
        <div class="reviewer-details">
          <span class="reviewer-name">{{ review.author }}</span>
          <span class="review-date">{{ formatDate(review.date) }}</span>
        </div>
      </div>
      <div class="review-rating">
        <div class="review-stars">
          <Star
            v-for="i in 5"
            :key="i"
            :size="14"
            :class="['star-small', i <= review.rating ? 'star-filled' : 'star-empty']"
          />
        </div>
        <span class="rating-text">{{ review.rating }}.0</span>
      </div>
    </div>

    <div class="review-content">
      <h4 class="review-title">{{ review.title }}</h4>
      <p class="review-text">{{ review.content }}</p>
    </div>

    <div class="review-actions">
      <button
        @click="$emit('toggle-helpful')"
        :class="['helpful-btn', { active: review.isHelpful }]"
      >
        <ThumbsUp :size="14" />
        Helpful ({{ review.helpfulCount }})
      </button>
    </div>
  </div>
</template>

<script>
import { Star, Edit3, ExternalLink, ArrowLeft, ThumbsUp, X } from "lucide-vue";


export default {
  name: "ReviewCard",
  components: {
    Star,
    ThumbsUp,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  emits: ['toggle-helpful'],
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.review-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 0; /* Changed from 24px 0 to 24px for consistent padding */
  /* border: 1px solid #e5e5e5;  */
  transition: border-color 0.2s ease;
}

.review-card:hover {
  border-color: #d1d5db;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.reviewer-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: #666;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

/* Star icon styling - ensure your Star component accepts these classes or adjust */
.star-small {
    /* You might need to adjust based on your Star component's internal SVG or element */
    width: 14px; /* Assuming size prop directly controls width/height */
    height: 14px;
}

.star-small.star-filled {
  color: #000; /* This assumes the SVG fill is controlled by 'color' or 'fill' CSS property */
  fill: #000;
}

.star-small.star-empty {
  color: #d1d5db;
  fill: #d1d5db;
}

.rating-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.review-content {
  margin-bottom: 16px;
  text-align: left;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.helpful-btn:hover {
  border-color: #000000;
  color: #000000;
}

.helpful-btn.active {
  background: #000000;
  color: #fff;
  border-color: #000000;
}
</style>
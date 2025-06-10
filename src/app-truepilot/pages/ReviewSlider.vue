// ReviewSlider.vue component
<template>
  <div class="review-slider">
    <div class="slider-container">
      <div class="fade-left"></div>
      <div class="fade-right"></div>
      
      <div class="slider-track" :style="{ transform: `translateX(${translateX}px)` }">
        <div
          v-for="(review, index) in duplicatedReviews"
          :key="`${review.id}-${Math.floor(index / reviews.length)}`"
          class="review-card"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ review.name.charAt(0) }}</div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ review.name }}</div>
                <div class="review-date">{{ review.date }}</div>
              </div>
            </div>
            <div class="review-stars">
              <Star
                v-for="i in 5"
                :key="i"
                :size="18"
                :class="i <= review.rating ? 'star filled' : 'star empty'"
              />
            </div>
          </div>
          <p class="review-text">{{ review.text }}</p>
          <div class="review-company">{{ review.company }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Star } from "lucide-vue";

export default {
  name: "ReviewSlider",
  components: {
    Star,
  },
  data() {
    return {
      translateX: 0,
      animationId: null,
      speed: 0.5, // pixels per frame
      reviews: [
        {
          id: 1,
          name: "Sarah Johnson",
          date: "2 days ago",
          rating: 5,
          text: "Absolutely fantastic service! The team went above and beyond my expectations. Will definitely recommend to friends and family.",
          company: "TechCorp Solutions"
        },
        {
          id: 2,
          name: "Michael Chen",
          date: "1 week ago",
          rating: 4,
          text: "Great product quality and fast delivery. Customer support was very helpful when I had questions.",
          company: "GreenLife Products"
        },
        {
          id: 3,
          name: "Emma Davis",
          date: "3 days ago",
          rating: 5,
          text: "Outstanding experience from start to finish. The attention to detail is remarkable and the results exceeded my expectations.",
          company: "Creative Studios"
        },
        {
          id: 4,
          name: "David Wilson",
          date: "5 days ago",
          rating: 4,
          text: "Solid service with competitive pricing. The process was smooth and professional throughout.",
          company: "BuildRight Construction"
        },
        {
          id: 5,
          name: "Lisa Thompson",
          date: "1 day ago",
          rating: 5,
          text: "Incredible value for money! The team was responsive, professional, and delivered exactly what was promised.",
          company: "Digital Marketing Pro"
        },
        {
          id: 6,
          name: "James Rodriguez",
          date: "4 days ago",
          rating: 4,
          text: "Very satisfied with the service. Quick turnaround time and excellent communication throughout the project.",
          company: "CloudTech Solutions"
        },
        {
          id: 7,
          name: "Amanda White",
          date: "6 days ago",
          rating: 5,
          text: "Exceptional quality and attention to detail. This company truly cares about customer satisfaction.",
          company: "Elegant Designs"
        },
        {
          id: 8,
          name: "Robert Kim",
          date: "2 weeks ago",
          rating: 4,
          text: "Professional service with great results. The team was knowledgeable and easy to work with.",
          company: "InnovateTech"
        }
      ]
    };
  },
  computed: {
    duplicatedReviews() {
      // Duplicate reviews multiple times for infinite scroll effect
      return [...this.reviews, ...this.reviews, ...this.reviews];
    }
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    startAnimation() {
      const animate = () => {
        // Move the slider to the left
        this.translateX -= this.speed;
        
        // Reset position when we've scrolled through one full set of reviews
        const cardWidth = 380; // updated width + gap
        const resetPoint = -(this.reviews.length * cardWidth);
        
        if (this.translateX <= resetPoint) {
          this.translateX = 0;
        }
        
        this.animationId = requestAnimationFrame(animate);
      };
      
      this.animationId = requestAnimationFrame(animate);
    },
    
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }
};
</script>

<style scoped>
.review-slider {
  padding: 50px 0;
  overflow: hidden;
  background: #fff;
}

.slider-container {
  position: relative;
  height: 280px;
  overflow: hidden;
  max-width: 1140px;
  margin: 0 auto;
}

.fade-left,
.fade-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: 10;
  pointer-events: none;
}

.fade-left {
  left: 0;
  background: linear-gradient(to right, #fff, transparent);
}

.fade-right {
  right: 0;
  background: linear-gradient(to left, #fff, transparent);
}

.slider-track {
  display: flex;
  gap: 24px;
  transition: none;
  will-change: transform;
}

.review-card {
  flex: 0 0 360px;
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); */
  padding: 28px;
  height: 240px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.review-card:hover {
     border: 2px solid #000000;
  /* transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); */
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.reviewer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  text-transform: uppercase;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
  text-align: left;
}

.reviewer-name {
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.review-date {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.review-stars {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  align-items: center;
  margin-top: 2px;
}

/* .star.filled {
  color: #fbbf24;
  filter: drop-shadow(0 1px 1px rgba(251, 191, 36, 0.3));
} */

.star.filled {
  color: #000;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}
.star.empty {
  color: #d1d5db;
}

.review-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.5;
  color: #374151;
  margin-bottom: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-align: left;
}

.review-company {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
  text-align: right;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .slider-container {
    max-width: 100%;
    height: 260px;
  }
  
  .review-card {
    flex: 0 0 320px;
    padding: 24px;
    height: 220px;
  }
  
  .fade-left,
  .fade-right {
    width: 40px;
  }
  
  .slider-track {
    gap: 20px;
  }
  
  .reviewer-avatar {
    width: 40px;
    height: 40px;
    font-size: 15px;
  }
  
  .reviewer-name {
    font-size: 15px;
  }
  
  .review-text {
    font-size: 14px;
    -webkit-line-clamp: 3;
  }
}

@media (max-width: 480px) {
  .review-card {
    flex: 0 0 280px;
    padding: 20px;
  }
  
  .slider-track {
    gap: 16px;
  }
}
</style>
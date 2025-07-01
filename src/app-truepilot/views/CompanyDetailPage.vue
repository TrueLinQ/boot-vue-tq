<template>
  <div class="company-detail-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          
          <!-- Company Header Section -->
          <CompanyDetail 
            :company="company" 
            @write-review="showWriteReview = true"
            @visit-website="visitWebsite"
          />

          <!-- Rating Overview Section -->
          <CompanyRating 
            :company="company"
            :reviews="reviews"
            :selected-rating-filter="selectedRatingFilter"
            @filter-by-rating="filterByRating"
          />

          <!-- Reviews Section -->
          <ComapnyReviews 
            :reviews="filteredReviews"
            :review-sort="reviewSort"
            :selected-rating-filter="selectedRatingFilter"
            :current-page="currentReviewPage"
            :total-pages="totalReviewPages"
            @update-sort="reviewSort = $event"
            @clear-rating-filter="clearRatingFilter"
            @toggle-helpful="toggleHelpful"
            @prev-page="currentReviewPage--"
            @next-page="currentReviewPage++"
            @go-to-page="page => currentReviewPage = page"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyDetail from '../components/companydetail/CompanyDetail.vue';
import CompanyRating from '../components/companydetail/CompanyRating.vue';
import ComapnyReviews from '../components/companydetail/ComapnyReviews.vue';

export default {
  name: "CompanyDetailPage",
  components: {
    CompanyDetail,
    CompanyRating,
    ComapnyReviews,
    // WriteReviewModal,
  },
  data() {
    return {
      showWriteReview: false,
      selectedRatingFilter: null,
      reviewSort: "newest",
      currentReviewPage: 1,
      reviewsPerPage: 5,

      // Sample company data
      company: {
        id: 1,
        name: "TechCorp Solutions",
        logo: "https://via.placeholder.com/120x120/000000/FFFFFF?text=TC",
        category: "technology",
        rating: 4.5,
        reviewCount: 128,
        description: "Leading software development company specializing in enterprise solutions and cloud technologies. We help businesses transform their operations through innovative digital solutions.",
        founded: "2015",
        employees: "500-1000",
        website: "https://techcorp-solutions.com",
      },

      // Sample reviews data
      reviews: [
        {
          id: 1,
          author: "Sarah Johnson",
          rating: 5,
          title: "Excellent service and support",
          content: "TechCorp has been instrumental in our digital transformation. Their team is knowledgeable, responsive, and delivers quality solutions on time. Highly recommend their services.",
          date: new Date("2024-03-15"),
          helpfulCount: 12,
          isHelpful: false,
        },
        {
          id: 2,
          author: "Mike Chen",
          rating: 4,
          title: "Great results, minor communication issues",
          content: "The end product exceeded our expectations, but there were some communication gaps during the project. Overall, very satisfied with the outcome.",
          date: new Date("2024-03-10"),
          helpfulCount: 8,
          isHelpful: false,
        },
        {
          id: 3,
          author: "Emily Rodriguez",
          rating: 5,
          title: "Professional and innovative",
          content: "Working with TechCorp was a pleasure. They brought innovative ideas to our project and executed them flawlessly. The team is highly professional and skilled.",
          date: new Date("2024-03-05"),
          helpfulCount: 15,
          isHelpful: true,
        },
        {
          id: 4,
          author: "David Thompson",
          rating: 3,
          title: "Good service but pricey",
          content: "The quality of work is good, but the pricing is on the higher side compared to competitors. Service delivery was satisfactory.",
          date: new Date("2024-02-28"),
          helpfulCount: 6,
          isHelpful: false,
        },
        {
          id: 5,
          author: "Lisa Wang",
          rating: 5,
          title: "Outstanding customer support",
          content: "Their customer support team is outstanding. They were always available to help and went above and beyond to ensure our satisfaction.",
          date: new Date("2024-02-20"),
          helpfulCount: 11,
          isHelpful: false,
        },
        {
          id: 6,
          author: "James Miller",
          rating: 4,
          title: "Solid technical expertise",
          content: "TechCorp's technical team demonstrated solid expertise in handling complex requirements. The project was delivered successfully with minimal issues.",
          date: new Date("2024-02-15"),
          helpfulCount: 9,
          isHelpful: false,
        },
        {
          id: 7,
          author: "Rachel Green",
          rating: 2,
          title: "Delayed delivery",
          content: "While the final product was acceptable, the project was significantly delayed beyond the agreed timeline. Better project management needed.",
          date: new Date("2024-02-10"),
          helpfulCount: 4,
          isHelpful: false,
        },
        {
          id: 8,
          author: "Tom Anderson",
          rating: 5,
          title: "Exceptional problem-solving skills",
          content: "When we encountered technical challenges, TechCorp's team showed exceptional problem-solving skills. They found creative solutions quickly.",
          date: new Date("2024-02-05"),
          helpfulCount: 13,
          isHelpful: false,
        },
      ],
    };
  },
  computed: {
    filteredReviews() {
      let filtered = [...this.reviews];
      
      // Apply rating filter
      if (this.selectedRatingFilter) {
        filtered = filtered.filter(review => review.rating === this.selectedRatingFilter);
      }
      
      // Apply sorting
      switch (this.reviewSort) {
        case "newest":
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "highest":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "lowest":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "helpful":
          filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
      }
      
      return filtered;
    },

    totalReviewPages() {
      return Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    },
  },
  methods: {
    filterByRating(rating) {
      if (this.selectedRatingFilter === rating) {
        this.selectedRatingFilter = null;
      } else {
        this.selectedRatingFilter = rating;
      }
      this.currentReviewPage = 1;
    },

    clearRatingFilter() {
      this.selectedRatingFilter = null;
      this.currentReviewPage = 1;
    },

    toggleHelpful(reviewId) {
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        if (review.isHelpful) {
          review.helpfulCount--;
          review.isHelpful = false;
        } else {
          review.helpfulCount++;
          review.isHelpful = true;
        }
      }
    },

    visitWebsite() {
      window.open(this.company.website, '_blank');
    },

    closeModal() {
      this.showWriteReview = false;
    },

    submitReview(reviewData) {
      const review = {
        id: Date.now(),
        ...reviewData,
        date: new Date(),
        helpfulCount: 0,
        isHelpful: false,
      };
      
      this.reviews.unshift(review);
      this.company.reviewCount++;
      
      // Recalculate overall rating
      const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      this.company.rating = totalRating / this.reviews.length;
      
      this.closeModal();
      console.log("Review submitted:", review);
    },
  },
  watch: {
    selectedRatingFilter() {
      this.currentReviewPage = 1;
    },
    reviewSort() {
      this.currentReviewPage = 1;
    },
  },
};
</script>

<style scoped>
.company-detail-container {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: var(--spacing-xxl);
}

.container {
  margin-top: var(--spacing-xxxl);
  max-width: var(--content-max-width);
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--spacing-md);
}

.row {
  display: flex;
  justify-content: center;
}

.col-lg-10 {
  width: 100%;
  max-width: 960px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
}
</style>
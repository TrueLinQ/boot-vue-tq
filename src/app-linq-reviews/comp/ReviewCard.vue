<template>
  <div class="review-card">
    <div class="card-header">
      <!-- Reviewer Info -->
      <div class="reviewer-avatar">
        {{ getInitials(review.userName) }}
      </div>
      <div class="reviewer-info">
        <h4>{{ review.userName || "Anonymous" }}</h4>
        <span class="review-date">{{ formatDate(review.updatedAt) }}</span>
      </div>
    </div>

    <!-- Rating -->
    <div class="rating-section">
      <div class="stars">
        <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (review.overAllRating || 0) }"> ★ </span>
      </div>
    </div>

    <!-- Product URL -->
    <a v-if="review.productUrl && !isEditing" :href="formatProductUrl(review.productUrl)" target="_blank"
      rel="noopener noreferrer" class="product-link">
      <span>View Product</span>
      <ExternalLink :size="14" />

    </a>

    <!-- Detailed Ratings Toggle Button -->
    <div v-if="!isEditing && hasDetailedRatings && review.overAllRating <= 3" class="detailed-ratings-toggle">
      <button @click="showDetailedRatings = !showDetailedRatings" class="toggle-btn">
        <span>{{ showDetailedRatings ? "Hide" : "View" }} Detailed Ratings</span>
        <svg :class="{ rotated: showDetailedRatings }" width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Detailed Ratings Component (collapsible) -->
    <transition name="slide-fade">
      <DetailedRatingsDisplay v-if="!isEditing && showDetailedRatings && hasDetailedRatings"
        :ratings="review.ratings" />
    </transition>

    <!-- Review Title -->
    <h5 v-if="review.title" class="review-title">{{ review.title }}</h5>

    <!-- Review Text -->
    <div class="review-content">
      <!-- View Mode -->
      <template v-if="!isEditing">
        <p class="description" :class="{ expanded: isExpanded }">
          {{ review.description }}
        </p>
        <button v-if="review.description && review.description.length > 100" @click="toggleExpansion"
          class="see-more-btn">
          {{ isExpanded ? "See Less" : "See More" }}
        </button>
      </template>

      <!-- Edit Mode -->
      <template v-else>
        <div class="inline-edit-rating">
          <div class="stars-input">
            <span v-for="i in 5" :key="i" class="star-input" :class="{ filled: i <= editData.rating }"
              @click="editData.rating = i">
              ★
            </span>
          </div>
        </div>

        <input v-model="editData.title" class="form-input-inline" placeholder="Review title..." />

        <textarea v-model="editData.description" class="form-textarea-inline" rows="4"
          placeholder="Write your review..."></textarea>

        <DetailedRatings v-if="ratingCategories.length > 0 && editData.rating <= 3" :categories="ratingCategories"
          v-model="editData.detailedRatings" />

        <div class="inline-edit-actions">
          <button @click="cancelEdit" class="btn btn-secondary btn-sm" :disabled="isUpdating">Cancel</button>
          <button @click="saveEdit" class="btn btn-primary btn-sm" :disabled="isUpdating">
            <Loader v-if="isUpdating" class="loader-icon" :size="14" />
            <span>{{ isUpdating ? "Saving..." : "Save" }}</span>
          </button>
        </div>
      </template>
    </div>

    <!-- Action Buttons Row (Helpful + Comments) -->
    <div class="card-footer-actions" v-if="!isEditing && !canEdit">
      <!-- Helpful Section -->
      <div class="helpful-section">
        <span class="helpful-label">Helpful?</span>
        <button @click="handleReaction" :disabled="isReacting" class="helpful-btn"
          :class="{ active: review.reactedByUser }">
          <ThumbsUp :size="16" />
          <span v-if="review.helpfulCount && review.helpfulCount > 0" class="helpful-count">
            {{ review.helpfulCount }}
          </span>
        </button>
      </div>

      <!-- Comments Button -->
      <button @click="openComments" class="comments-btn">
        <MessageCircle :size="16" />
        <span v-if="commentCount > 0" class="comments-count">{{ commentCount }}</span>
      </button>
    </div>

    <!-- Card Actions (only show if canEdit is true) -->
    <div class="card-actions" v-if="canEdit && !isEditing">
      <button @click="startEdit" class="btn btn-icon" title="Edit">
        <Edit2 :size="16" />
      </button>
      <button @click="$emit('delete', review.id)" class="btn btn-icon btn-danger" title="Delete">
        <Trash2 :size="16" />
      </button>
    </div>

    <!-- Comments Modal -->
    <transition name="slide-fade">
      <ReviewComment v-if="showComments" :review-id="review.id" @comment-added="handleCommentAdded"
        @comment-deleted="handleCommentDeleted" />
    </transition>
  </div>
</template>

<script>
import { Edit2, Trash2, Loader, ThumbsUp, MessageCircle, ExternalLink } from "lucide-vue";
import DetailedRatingsDisplay from "../components/DetailedRatingsDisplay.vue";
import DetailedRatings from "../components/DetailedRatings.vue";
import ReviewComment from "./ReviewComment.vue";
import { getRatingConfig } from "../api/reviewCrud";

export default {
  name: "ReviewCard",
  components: {
    Edit2,
    Trash2,
    Loader,
    ThumbsUp,
    MessageCircle,
    ExternalLink,
    DetailedRatingsDisplay,
    DetailedRatings,
    ReviewComment
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    isUpdating: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update", "delete", "react"],
  data() {
    return {
      isExpanded: false,
      isEditing: false,
      isReacting: false,
      showDetailedRatings: false,
      isLoadingRatingConfig: false,
      ratingCategories: [],
      showComments: false, // Changed from showCommentsModal
      commentCount: this.review.commentCount || 0,
      editData: {
        rating: 0,
        title: "",
        description: "",
        detailedRatings: {},
      },
    };
  },
  methods: {

    formatProductUrl(url) {
      if (!url) return '#';
      return url.startsWith('http') ? url : `https://${url}`;
    },
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },

    openComments() {
      this.showComments = !this.showComments; // Toggle instead of opening modal
    },

    closeComments() {
      this.showComments = false;
    },

    handleCommentAdded() {
      this.commentCount += 1;
    },

    handleCommentDeleted() {
      this.commentCount = Math.max(0, this.commentCount - 1);
    },

    async handleReaction() {
      if (this.isReacting) return;

      this.isReacting = true;
      try {
        await this.$emit("react", this.review.id);
      } catch (error) {
        console.error("Failed to react to review:", error);
      } finally {
        this.isReacting = false;
      }
    },

    async startEdit() {
      this.isEditing = true;
      this.isLoadingRatingConfig = true;

      this.editData = {
        rating: this.review.overAllRating || 0,
        title: this.review.title || "",
        description: this.review.description || "",
        detailedRatings: {},
      };

      try {
        const response = await getRatingConfig(this.$parent.organizationId);

        if (response && response.data && response.data.results) {
          this.ratingCategories = response.data.results;

          if (this.review.ratings && this.review.ratings.length > 0) {
            const prefilledRatings = {};

            this.review.ratings.forEach((rating) => {
              prefilledRatings[rating.id] = {
                value: parseInt(rating.value) || 0,
                tagIds: rating.tagId || [],
              };
            });

            this.editData.detailedRatings = prefilledRatings;
          } else {
            const initialRatings = {};
            this.ratingCategories.forEach((cat) => {
              initialRatings[cat.id] = {
                value: 0,
                tagIds: [],
              };
            });
            this.editData.detailedRatings = initialRatings;
          }
        }
      } catch (error) {
        console.error("Error loading rating config:", error);
        alert("Failed to load rating options. Please try again.");
        this.cancelEdit();
      } finally {
        this.isLoadingRatingConfig = false;
      }
    },

    cancelEdit() {
      this.isEditing = false;
      this.ratingCategories = [];
      this.editData = {
        rating: 0,
        title: "",
        description: "",
        detailedRatings: {},
      };
    },

    async saveEdit() {
      if (this.isUpdating) return;

      if (!this.editData.rating || this.editData.rating < 1 || this.editData.rating > 5) {
        alert("Please provide a rating between 1 and 5 stars");
        return;
      }

      if (!this.editData.description || this.editData.description.trim().length === 0) {
        alert("Please write a review description");
        return;
      }

      try {
        const ratingsArray = Object.keys(this.editData.detailedRatings)
          .map((categoryId) => {
            const rating = this.editData.detailedRatings[categoryId];

            if (rating.value && rating.value > 0) {
              return {
                id: categoryId,
                value: rating.value.toString(),
                tagId: rating.tagIds || [],
              };
            }
            return null;
          })
          .filter((r) => r !== null);

        const updatePayload = {
          overAllratings: this.editData.rating,
          title: this.editData.title,
          description: this.editData.description,
        };

        if (ratingsArray.length > 0) {
          updatePayload.ratings = ratingsArray;
        }

        await this.$emit("update", this.review.id, updatePayload);

      } catch (error) {
        console.error("Failed to save edit:", error);
        alert("Failed to update review. Please try again.");
      }
    },

    getInitials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    formatDate(dateString) {
      if (!dateString) return "Date unknown";

      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return `${diffSec} seconds ago`;
      if (diffMin < 60) return `${diffMin} minutes ago`;
      if (diffHr < 24) return `${diffHr} hours ago`;

      if (diffDay === 0) return "Today";
      if (diffDay === 1) return "Yesterday";
      if (diffDay < 7) return `${diffDay} days ago`;
      if (diffDay < 30) return `${Math.floor(diffDay / 7)} weeks ago`;
      if (diffDay < 365) return `${Math.floor(diffDay / 30)} months ago`;

      return `${Math.floor(diffDay / 365)} years ago`;
    },
  },
  computed: {
    hasDetailedRatings() {
      return this.review.ratings && this.review.ratings.length > 0;
    },
  },
};
</script>

<style scoped>
.loading-config {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 12px;
  color: #666;
}

.review-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  height: fit-content;
  align-self: start;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  height: 100%;
}

.review-card:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 16px;
  flex-shrink: 0;
}

.reviewer-info {
  flex-grow: 1;
  min-width: 0;
}

.reviewer-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  word-wrap: break-word;
}

.review-date {
  color: #999;
  font-size: 0.85rem;
}

.rating-section {
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #e0e0e0;
  font-size: 1.5rem;
}

.star.filled {
  color: #ffd700;
}

.review-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.review-content {
  margin-bottom: 16px;
}

.description {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description.expanded {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
}

.see-more-btn {
  background: none;
  border: none;
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 8px;
  text-decoration: underline;
}

.see-more-btn:hover {
  color: #333;
}

/* Card Footer Actions (Helpful + Comments) */
.card-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.helpful-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 400;
}

.helpful-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  border: 1px solid #e8f5e8;
  border-radius: 6px;
  color: #2d7d2d;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
}

.helpful-btn:hover:not(:disabled) {
  background: #d4ecd4;
  border-color: #d4ecd4;
}

.helpful-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.helpful-count {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Comments Button */
.comments-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;
}

.comments-btn:hover {
  background: #e8e8e8;
  border-color: #ccc;
}

.comments-count {
  min-width: 16px;
  text-align: center;
}

.inline-edit-rating {
  margin-bottom: 12px;
}

.stars-input {
  display: flex;
  gap: 4px;
}

.star-input {
  color: #e0e0e0;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star-input:hover,
.star-input.filled {
  color: #ffd700;
}

.form-input-inline {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
  margin-bottom: 12px;
}

.form-input-inline:focus {
  outline: none;
  border-color: #000;
}

.form-textarea-inline {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
  margin-bottom: 12px;
}

.form-textarea-inline:focus {
  outline: none;
  border-color: #000;
}

.inline-edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: #000;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  border-color: #ccc;
  background: #f8f8f8;
}

.btn-sm {
  padding: 8px 14px;
  font-size: 0.85rem;
}

.btn-icon {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 10px;
  min-width: 40px;
}

.btn-icon:hover {
  background: #e8e8e8;
  border-color: #ccc;
}

.btn-danger {
  background: #fee;
  color: #c33;
  border-color: #fcc;
}

.btn-danger:hover {
  background: #fdd;
  color: #a22;
  border-color: #faa;
}

.loader-icon {
  animation: spin 1s linear infinite;
}

/* Detailed Ratings Toggle */
.detailed-ratings-toggle {
  margin-bottom: 12px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.toggle-btn svg {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

/* Transition for detailed ratings */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .review-card {
    padding: 16px;
  }

  .card-footer-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .helpful-section {
    justify-content: space-between;
  }

  .comments-btn {
    width: 100%;
    justify-content: center;
  }
}


.product-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 12px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  width: 100%;
}

.product-link:hover {
  background: #f0f0f0;
  border-color: #ccc;
}
</style>
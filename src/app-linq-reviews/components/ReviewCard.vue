
// ===== FILE 1: ReviewCard.vue =====
<template>
  <div>
    <div class="review-card">
      <div class="card-header">
        <div class="avatar">
          {{ review.reviewerInitials }}
        </div>
        <div class="user-info">
          <h4>{{ review.reviewerName }}</h4>
          <p class="company">{{ review.companyName }}</p>
        </div>
      </div>

      <div class="rating-section">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
        </div>
        <span class="date">{{ review.date }}</span>
      </div>

      <div v-if="isEditing" class="edit-section">
        <textarea 
          v-model="editedText" 
          class="edit-input"
          rows="5"
        ></textarea>
      </div>
      <div v-else>
        <p class="review-text">
          {{ displayText }}
          <span v-if="shouldShowMore && !isExpanded">...</span>
        </p>
        <button 
          v-if="shouldShowMore" 
          @click="isExpanded = !isExpanded" 
          class="see-more"
        >
          {{ isExpanded ? 'See Less' : 'See More' }}
        </button>
      </div>

      <div v-if="isMyReview" class="actions">
        <template v-if="isEditing">
          <button @click="saveEdit" class="btn btn-save">Save</button>
          <button @click="cancelEdit" class="btn btn-cancel">Cancel</button>
        </template>
        <template v-else>
          <button @click="startEdit" class="btn btn-edit">Edit</button>
          <button @click="showModal = true" class="btn btn-delete">Delete</button>
        </template>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
      <div class="modal" @click.stop>
        <h3>Delete Review?</h3>
        <p>Are you sure you want to delete this review? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showModal = false" class="btn btn-cancel">Cancel</button>
          <button @click="confirmDelete" class="btn btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewCard',
  props: {
    review: {
      type: Object,
      required: true
    },
    isMyReview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExpanded: false,
      isEditing: false,
      editedText: this.review.review,
      showModal: false
    };
  },
  computed: {
    shouldShowMore() {
      return this.review.review.length > 150;
    },
    displayText() {
      if (this.isExpanded) {
        return this.review.review;
      }
      return this.review.review.slice(0, 150);
    }
  },
  methods: {
    startEdit() {
      this.isEditing = true;
    },
    saveEdit() {
      this.$emit('edit', this.review.id, this.editedText);
      this.isEditing = false;
    },
    cancelEdit() {
      this.editedText = this.review.review;
      this.isEditing = false;
    },
    confirmDelete() {
      this.$emit('delete', this.review.id);
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.review-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.review-card:hover {
  border-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
}

.company {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}

.rating-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #333;
  font-size: 1.2rem;
}

.star.filled {
  color: #fbbf24;
}

.date {
  color: #666;
  font-size: 0.85rem;
}

.review-text {
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
  word-wrap: break-word;
}

.see-more {
  background: none;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  text-decoration: underline;
}

.see-more:hover {
  color: #ddd;
}

.edit-section {
  margin-bottom: 16px;
}

.edit-input {
  width: 100%;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #fff;
  resize: vertical;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  border-color: #fff;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save {
  background: #fff;
  color: #000;
}

.btn-save:hover {
  background: #e5e5e5;
}

.btn-cancel {
  background: transparent;
  color: #fff;
  border: 1px solid #333;
}

.btn-cancel:hover {
  border-color: #555;
  background: #1a1a1a;
}

.btn-edit {
  background: transparent;
  color: #fff;
  border: 1px solid #333;
}

.btn-edit:hover {
  border-color: #555;
  background: #1a1a1a;
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 1px solid #7f1d1d;
}

.btn-delete:hover {
  background: #450a0a;
  border-color: #991b1b;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 32px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.modal h3 {
  margin: 0 0 16px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
}

.modal p {
  margin: 0 0 24px 0;
  color: #999;
  font-size: 1rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions .btn {
  flex: 1;
}

@media (max-width: 640px) {
  .review-card {
    padding: 16px;
  }

  .actions {
    flex-direction: column;
  }

  .modal {
    padding: 24px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
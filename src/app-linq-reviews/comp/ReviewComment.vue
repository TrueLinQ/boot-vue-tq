<template>
  <div class="comments-section">

    <!-- Comments List -->
    <div class="comments-list">

      <div v-if="loading && comments.length === 0" class="loading-comments">
        <Loader :size="20" class="spinner-icon" />
      </div>

      <div v-else-if="comments.length === 0 && !loading" class="empty-comments">
        <MessageCircle :size="40" />
        <p>No comments yet</p>
        <span>Be the first to comment!</span>
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          {{ getInitials(comment.userName) }}
        </div>

        <div class="comment-content">
          <div class="comment-header">
            <div class="comment-user-info">
              <span class="comment-user-name">{{ comment.userName }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>

            <!-- Options Menu (only for user's own comments) -->
            <div v-if="comment.isOwner" class="comment-options">
              <button @click="toggleOptions(comment.id)" class="options-btn">
                <MoreVertical :size="16" />
              </button>

              <transition name="fade">
                <div v-if="showOptionsId === comment.id" class="options-menu">
                  <button @click="startEdit(comment)" class="option-item">
                    <Edit2 :size="14" />
                  </button>
                  <button @click="openDeleteModal(comment.id)" class="option-item danger">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Comment Text (View/Edit Mode) -->
          <div v-if="editingId === comment.id" class="edit-mode">
            <textarea v-model="editText" class="edit-textarea" rows="3" @keydown.esc="cancelEdit"
              :disabled="isEditingSaving"></textarea>
            <div class="edit-actions">
              <button @click="cancelEdit" class="btn-cancel" :disabled="isEditingSaving">Cancel</button>
              <button @click="saveEdit(comment.id)" class="btn-save" :disabled="isEditingSaving || !editText.trim()">
                <Check :size="16" />
                {{ isEditingSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
          <p v-else class="comment-text">{{ comment.comment }}</p>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="canLoadMore && !loading" class="load-more-section">
        <button @click="loadMoreComments" class="load-more-btn">
          Load More Comments
        </button>
      </div>

      <div v-if="loading && comments.length > 0" class="loading-more">
        <div class="spinner small"></div>
        <span>Loading more comments...</span>
      </div>
    </div>

    <!-- Add Comment Input (only show if user hasn't commented) -->
    <div v-if="!hasUserCommented && !(loading && comments.length === 0)" class="add-comment-section">
      <div class="input-wrapper">
        <textarea v-model="newComment" placeholder="Write a comment..." class="comment-input" rows="2"
          @keydown.enter.ctrl="submitComment" :disabled="isSubmitting"></textarea>
        <button @click="submitComment" :disabled="!newComment.trim() || isSubmitting" class="submit-btn">
          <Send :size="18" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <DeleteModal 
  :show="showDeleteModal" 
  :is-deleting="isDeletingComment" 
  item-type="Comment"
  @confirm="deleteCommentById" 
  @cancel="cancelDeleteModal" 
/>
  </div>
</template>

<script>
import { MessageCircle, Send, Trash2, Edit2, Check, MoreVertical ,Loader } from "lucide-vue";
import { getComments, createOrEditComment, deleteComment } from "../api/commentCrud";
import DeleteModal from "./DeleteModal.vue";

export default {
  name: "ReviewComments",
  components: {
    MessageCircle,
    Send,
    Trash2,
    Edit2,
    Check,
    MoreVertical,
    Loader,
    DeleteModal
  },
  props: {
    reviewId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: '',
      isSubmitting: false,
      editingId: null,
      editText: '',
      isEditingSaving: false,
      showOptionsId: null,
      currentUserName: 'You',
      loading: false,
      error: null,
      pageSize: 10,
      startIndex: 0,
      totalCount: 0,

      showDeleteModal: false,
      commentIdToDelete: null,
      isDeletingComment: false
    };
  },
  computed: {
    canLoadMore() {
      return this.comments.length < this.totalCount && this.totalCount > 0;
    },
    hasUserCommented() {
      return this.comments.some(comment => comment.isOwner);
    }
  },
  methods: {
    async loadComments(loadMore = false) {
      this.loading = true;
      this.error = null;

      let currentStartIndex;

      if (!loadMore) {
        currentStartIndex = 0;
        this.comments = [];
        this.totalCount = 0;
      } else {
        currentStartIndex = this.startIndex;
      }

      try {
        const params = {
          pageSize: this.pageSize,
          startIndex: currentStartIndex
        };

        const response = await getComments(this.reviewId, params);

        if (response && response.data && response.data.results) {
          const result = response.data.results[0];

          if (result && result.reviewComments && Array.isArray(result.reviewComments)) {
            const newComments = result.reviewComments;

            if (loadMore) {
              this.comments = [...this.comments, ...newComments];
            } else {
              this.comments = newComments;
            }

            this.totalCount = result.totalCount || 0;

            if (!loadMore) {
              this.startIndex = 1;
            } else {
              this.startIndex += 1;
            }
          } else {
            if (!loadMore) {
              this.comments = [];
              this.totalCount = 0;
              this.startIndex = 0;
            }
          }
        } else {
          if (!loadMore) {
            this.comments = [];
            this.totalCount = 0;
            this.startIndex = 0;
          }
        }
      } catch (error) {
        this.error = `Failed to load comments: ${error.message}`;
        console.error("Comments fetch error:", error);

        if (!loadMore) {
          this.comments = [];
          this.totalCount = 0;
          this.startIndex = 0;
        }
      } finally {
        this.loading = false;
      }
    },

    loadMoreComments() {
      this.loadComments(true);
    },

    async submitComment() {
      if (!this.newComment.trim() || this.isSubmitting) return;

      this.isSubmitting = true;
      this.error = null;

      const commentTextToSubmit = this.newComment.trim();

      try {
        await createOrEditComment(this.reviewId, commentTextToSubmit);
        this.newComment = '';
        this.$emit('comment-added');
        
        // Refetch comments from the beginning
        this.startIndex = 0;
        await this.loadComments(false);
      } catch (error) {
        this.error = `Failed to add comment: ${error.message}`;
        console.error("Submit comment error:", error);
      } finally {
        this.isSubmitting = false;
      }
    },

    toggleOptions(commentId) {
      this.showOptionsId = this.showOptionsId === commentId ? null : commentId;
    },

    startEdit(comment) {
      this.editingId = comment.id;
      this.editText = comment.comment;
      this.showOptionsId = null;
    },

    cancelEdit() {
      this.editingId = null;
      this.editText = '';
      this.isEditingSaving = false;
    },

    async saveEdit(commentId) {
      if (!this.editText.trim() || this.isEditingSaving) return;

      this.isEditingSaving = true;
      this.error = null;

      const newCommentText = this.editText.trim();

      try {
        await createOrEditComment(this.reviewId, newCommentText);
        this.cancelEdit();
        this.$emit('comment-updated');
        
        // Refetch comments to get updated data
        await this.loadComments(false);
      } catch (error) {
        this.error = `Failed to update comment: ${error.message}`;
        console.error("Update comment error:", error);
        this.isEditingSaving = false;
      }
    },

    

    openDeleteModal(commentId) {
  this.commentIdToDelete = commentId;
  this.showDeleteModal = true;
  this.showOptionsId = null;
},

cancelDeleteModal() {
  this.showDeleteModal = false;
  this.commentIdToDelete = null;
},

async deleteCommentById() {
  if (!this.commentIdToDelete) return;

  this.isDeletingComment = true;
  this.error = null;

  try {
    await deleteComment(this.commentIdToDelete);
    this.$emit('comment-deleted');
    
    this.showDeleteModal = false;
    this.commentIdToDelete = null;
    
    // Refetch comments from the beginning
    this.startIndex = 0;
    await this.loadComments(false);
  } catch (error) {
    this.error = `Failed to delete comment: ${error.message}`;
    console.error("Delete comment error:", error);
  } finally {
    this.isDeletingComment = false;
  }
},

    getInitials(name) {
      if (!name) return '?';
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    formatTime(timestamp) {
      if (!timestamp) return '';

      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  },
  mounted() {
    this.loadComments(false);
  },
  watch: {
    reviewId(newId, oldId) {
      if (newId !== oldId) {
        this.startIndex = 0;
        this.comments = [];
        this.totalCount = 0;
        this.loadComments(false);
      }
    }
  }
};
</script>

<style scoped>
/* Comments Section Container */
.comments-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  ;
  /* background: #fafafa; */
  /* border-radius: 8px; */
  /* padding: 16px; */
}

/* Comments Header */
.comments-header {
  margin-bottom: 16px;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

/* Comments List */
.comments-list {
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

.empty-comments svg {
  color: #ddd;
  margin-bottom: 12px;
}

.empty-comments p {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #666;
}

.empty-comments span {
  font-size: 0.85rem;
  color: #999;
}

/* Comment Item */
.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.comment-avatar.small {
  width: 32px;
  height: 32px;
  font-size: 0.75rem;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.comment-user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.comment-time {
  font-size: 0.8rem;
  color: #999;
}

.comment-text {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* Comment Options */
.comment-options {
  position: relative;
}

.options-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.options-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.options-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
  display: flex;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: #333;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.option-item:hover {
  background: #f5f5f5;
}

.option-item.danger {
  color: #dc3545;
}

.option-item.danger:hover {
  background: #fff5f5;
}

/* Edit Mode */
.edit-mode {
  margin-top: 8px;
}

.edit-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.edit-textarea:focus {
  outline: none;
  border-color: #000;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-cancel {
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background: #000;
  color: #fff;
}

.btn-save:hover {
  background: #333;
}

/* Add Comment Section */
.add-comment-section {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.input-wrapper {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.comment-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  transition: border-color 0.2s ease;
  background: #fff;
}

.comment-input:focus {
  outline: none;
  border-color: #000;
}

.comment-input::placeholder {
  color: #999;
}

.submit-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar Styling */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .comments-section {
    padding: 12px;
  }

  .add-comment-section {
    flex-direction: column;
    gap: 8px;
  }

  .input-wrapper {
    width: 100%;
  }
}


.error-message {
  margin-top: 12px;
  padding: 10px 12px;
  background: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 6px;
  color: #dc3545;
  font-size: 0.85rem;
}

.loading-comments,
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner.small {
  width: 16px;
  height: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.spinner-icon {
  animation: spin 1s linear infinite;
}

.load-more-section {
  text-align: center;
  padding: 12px 0;
}

.load-more-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #e8e8e8;
}
</style>
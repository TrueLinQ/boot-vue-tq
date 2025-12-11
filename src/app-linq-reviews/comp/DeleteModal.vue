<template>
  <portal to="modal-destination">
     <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
       <div class="review-modal" @click.stop>
         <div class="modal-header">
           <h3>Delete {{ itemType }}</h3>
         </div>
         <div class="modal-body">
           <p>Are you sure you want to delete this {{ itemType.toLowerCase() }}? This action cannot be undone.</p>
         </div>
         <div class="modal-actions">
           <button @click="$emit('cancel')" class="btn btn-secondary" :disabled="isDeleting">Cancel</button>
           <button @click="$emit('confirm')" class="btn btn-danger" :disabled="isDeleting">
             <Loader v-if="isDeleting" class="loader-icon" :size="14" />
             <span>{{ isDeleting ? "Deleting..." : "Delete" }}</span>
           </button>
         </div>
       </div>
     </div>
   </portal>
 </template>
 
 <script>
 import { Loader } from "lucide-vue";
 
 export default {
   name: "DeleteModal",
   components: {
     Loader,
   },
   props: {
     show: {
       type: Boolean,
       default: false,
     },
     isDeleting: {
       type: Boolean,
       default: false,
     },
     itemType: {
       type: String,
       default: "Review", // Default value
     },
   },
   emits: ["confirm", "cancel"],
 };
 </script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  padding: 0 30px;
}

.review-modal {
  background: #fff;
  border-radius: 8px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #000;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.9375rem;
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 90px;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover:not(:disabled) {
  background: #e8e8e8;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc3545;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-danger:disabled {
  background: #e9a6ae;
  cursor: not-allowed;
}

.loader-icon {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .modal {
    margin: 0 12px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>

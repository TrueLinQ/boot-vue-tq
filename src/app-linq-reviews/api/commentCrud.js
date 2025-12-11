import apiClient from "../../app-linq-work/api/apiConfig";

const BASE = "/api/review";

// 1️⃣ Create / Edit Comment (POST)
export const createOrEditComment = async (reviewId, commentText) => {
  try {
    const response = await apiClient.post(`${BASE}/comment?reviewId=${reviewId}`, commentText);
    return response;
  } catch (error) {
    console.error("Error creating/editing comment:", error);
    throw error;
  }
};

// 2️⃣ Get Comments on Review (POST)
export const getComments = async (reviewId, params = {}) => {
  try {
    const response = await apiClient.post(`/pub/review/comment/get?reviewId=${reviewId}`, params);
    return response;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 3️⃣ Delete Comment (DELETE)
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`${BASE}/delete-comment?commentId=${commentId}`);
    return response;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

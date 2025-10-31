import apiClient from "../../app-linq-work/api/apiConfig";

const BASE = "/api/reviews";

// 1️⃣ Create Review (POST)
export const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post(`${BASE}/create`, reviewData);
    return response;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// 2️⃣ Update Review (POST)
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.post(`${BASE}/update?reviewId=${reviewId}`, reviewData);
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// 3️⃣ Delete Review (DELETE)
export const deleteReview = async (id) => {
  try {
    const response = await apiClient.delete(`${BASE}/`, {
      params: { id },
    });
    return response;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// 4️⃣ Get Reviews (POST)
export const getReviews = async (orgId, options = {}, params = {}) => {
  const { byUser = false } = options;
  try {
    const response = await apiClient.post(`${BASE}/?orgId=${orgId}&byUser=${byUser}`, params);
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// 5️⃣ React to Review (POST)
export const reactToReview = async (reviewId) => {
  try {
    const response = await apiClient.get(`${BASE}/update-reaction?reviewId=${reviewId}`);
    return response;
  } catch (error) {
    console.error("Error reacting to review:", error);
    throw error;
  }
};

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

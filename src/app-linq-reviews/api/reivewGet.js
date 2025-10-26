import apiClient from "../../app-linq-work/api/apiConfig";

const BASE = "/pub/reviews";

// 1️⃣ Get Reviews / Get Reviews by User (POST)
export const getReviews = async (options = {}, params = {}) => {
  const { search = "", byUser = false } = options;
  try {
    const response = await apiClient.post(`${BASE}/?search=${search}&byUser=${byUser}`, params);
    // const response = await apiClient.post(`${BASE}/`, params);

    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// 2️⃣ Get Reviews by Organization (POST)
export const getReviewsByOrganization = async (organizationId) => {
  try {
    const response = await apiClient.post(`${BASE}/organization?organizationId=${organizationId}`);
    return response;
  } catch (error) {
    console.error("Error fetching reviews by organization:", error);
    throw error;
  }
};

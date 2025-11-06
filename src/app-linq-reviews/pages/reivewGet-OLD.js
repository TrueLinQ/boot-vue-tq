import apiClient from "../../app-linq-work/api/apiConfig";

const BASE = "/pub/reviews";

// 1️⃣ Get Reviews / Get Reviews by User (POST)
// export const getReviews = async (options = {}, params = {}) => {
//   const { search = "", byUser = false } = options;
//   try {
//     const response = await apiClient.post(`${BASE}/?search=${search}&byUser=${byUser}`, params);
//     return response;
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     throw error;
//   }
// };

// Updated getReviews function
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

// 2️⃣ Get Reviews by Organization (POST)
// export const getReviewsByOrganization = async (organizationId, params) => {
//   try {
//     const response = await apiClient.post(`${BASE}/organization?organizationId=${organizationId}&by`,params);
//     return response;
//   } catch (error) {
//     console.error("Error fetching reviews by organization:", error);
//     throw error;
//   }
// };

export const getReviewsByOrganization = async (organizationId, options = {}, params = {}) => {
  try {
    const { byUser = false } = options;
    
    // Build query params
    const queryParams = new URLSearchParams({
      organizationId,
      byUser
    });

    const response = await apiClient.post(
      `${BASE}/organization?${queryParams.toString()}`,
      params
    );
    
    return response;
  } catch (error) {
    console.error("Error fetching reviews by organization:", error);
    throw error;
  }
};

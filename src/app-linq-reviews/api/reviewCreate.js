import apiClient from "../../app-linq-work/api/apiConfig";


// 1️⃣ Search Business (POST)
export const searchBusiness = async (query) => {
  try {
    const response = await apiClient.post(`/pub/domain/search?query=${query}`);
    return response;
  } catch (error) {
    console.error("Error searching business:", error);
    throw error;
  }
};

// 2️⃣ Get Domain Meta (GET)
export const getDomainMeta = async (url) => {
  try {
    const response = await apiClient.post(`/pub/domain/get/meta?url=${url}`, {
    //   params: { url }, // axios automatically encodes params
    });
    return response;
  } catch (error) {
    console.error("Error fetching domain meta:", error);
    throw error;
  }
};

// 3️⃣ Create Business (POST)
export const createBusiness = async (businessData) => {
  try {
    const response = await apiClient.post(`/api/domain/create`, businessData);
    return response;
  } catch (error) {
    console.error("Error creating business:", error);
    throw error;
  }
};

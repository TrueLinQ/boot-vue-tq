import apiClient from "./apiConfig";

const BASE = '/api/professional';

export const getRequiredProvider = async (params = {}) => {
  try {
    const response = await apiClient.get(`${BASE}/get-required-provider`, { params });
    return response;
  } catch (error) {
    console.error("Error fetching required provider:", error);
    throw error;
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await apiClient.post(`${BASE}/profile/create`, profileData);
    return response;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.post(`${BASE}/profile/get`);
    return response;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

export const updateProfile = async (params) => {
  try {
    const response = await apiClient.post(`${BASE}/profile/update`, params);
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const searchProfessionals = async (params = {}) => {
  try {
    const response = await apiClient.post(`${BASE}/search`, params);
    return response;
  } catch (error) {
    console.error("Error searching professionals:", error);
    throw error;
  }
};

export const getContact = async (profileId) => {
  try {
    const response = await apiClient.get(`${BASE}/contact?profileId=${profileId}`);
    return response;
  } catch (error) {
    console.error("Error contacting professional:", error);
    throw error;
  }
};

export const getUserProfile = async (profileId) => {
  try {
    const response = await apiClient.get(`${BASE}/profile/get-profileid?profileId=${profileId}`);
    return response;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};


export const sendConnection = async (params = {}) => {
  try {
    const response = await apiClient.post(`${BASE}/connect`, params);
    return response;
  } catch (error) {
    console.error("Error sending connection:", error);
    throw error;
  }
};

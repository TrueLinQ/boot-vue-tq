import apiClient from "./apiConfig";

const BASE = "/connect";

export const getConnectionRequests = async (options = {}) => {
  const { ignored = false, type = "professional", pageSize = 10, startIndex = 0 } = options;
  try {
    const response = await apiClient.post(`${BASE}/get-requests?ignored=${ignored}&type=${type}`, {
      pageSize,
      startIndex,
    });
    return response;
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    throw error;
  }
};

export const getAcceptedConnections = async (options = {}) => {
  const { type = "professional", pageSize = 10, startIndex = 0 } = options;
  try {
    const response = await apiClient.post(`${BASE}/get-connections?type=${type}`, { pageSize, startIndex });
    return response;
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    throw error;
  }
};

export const respondToConnectionRequest = async (requestId, value = true, type = "professional") => {
  try {
    const response = await apiClient.post(
      `${BASE}/accept?value=${value}&type=${type}`,
      requestId // raw string ID in body
    );
    return response;
  } catch (error) {
    console.error("Error accepting/rejecting connection request:", error);
    throw error;
  }
};

import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      if (error.response.status === 401) {
        console.log('Unauthorized access. Please log in again.');
      }
    } else if (error.request) {
      console.error('API Request Error: No response received', error.request);
    } else {
      console.error('Error setting up API request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
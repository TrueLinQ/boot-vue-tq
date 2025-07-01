const API_BASE_URL = 'https://app.truelinq.com/linq';
const MY_APP_BASE_URL = 'http://localhost:8080/truepilot/profile/'; // Your app's base URL

class ApiService {
  /**
   * Redirect user to WhatsApp verification
   * @param {string} phoneNumber - Full phone number with country code (e.g., "919930104050")
   */
  redirectToWhatsAppVerification(phoneNumber) {
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const verificationUrl = `${API_BASE_URL}/pub/verify/whatsapp?phoneNumber=${cleanPhone}`;
    // It's important to use window.open for the new tab experience,
    // so the current app tab doesn't lose its state immediately.
    window.open(verificationUrl, "_blank");
  }

  /**
   * Fetches WhatsApp profile information for an authenticated user.
   * @param {string} userId - The ID of the logged-in user.
   * @returns {Promise<Object|null>} - WhatsApp profile data or null if not found.
   */
  async getWhatsAppProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/pub/v2/profiles?userId=${userId}&provider=whatsapp`);
      if (!response.ok) {
        if (response.status === 404) return null; // No WhatsApp profile found
        throw new Error(`Failed to fetch WhatsApp profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching WhatsApp profile:', error);
      throw error;
    }
  }

  /**
   * Fetches a professional profile by its UUID.
   * @param {string} profileUUId - The profile's unique identifier (e.g., "whatsapp:919930104050").
   * @returns {Promise<Object|null>} - Professional profile data or null if not found.
   */
  async getProfessionalProfile(profileUUId) {
    console.log("getting professional profile:", profileUUId);
    try {
      const response = await fetch(`${API_BASE_URL}/professional/profile/get?profileUUId=${profileUUId}`, {
        method: 'POST', // This API endpoint needs to be POST as per your description
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileUUId }) // Ensure the body contains the UUID if POST requires it
      });

      if (!response.ok) {
        if (response.status === 404) return null; // No professional profile found
        throw new Error(`Failed to fetch professional profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching professional profile:', error);
      throw error;
    }
  }

  /**
   * Generic handler for API responses, including custom error codes.
   * Attaches 'code' and 'message' from API response body to the thrown error object.
   * @param {Response} response - The fetch API response.
   * @returns {Promise<Object>} - Parsed JSON response or throws an error with custom properties.
   */
  async handleApiResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      if (data && data.code) { // Assuming your API returns { code: 1010, message: "..." } on error
        const error = new Error(data.message || 'API error');
        error.code = data.code; // Attach the custom error code
        // error.apiMessage = data.message; // Optionally, store original message if needed
        throw error;
      } else {
        throw new Error(data.message || `API request failed with status: ${response.status}`);
      }
    }
    return data;
  }

  /**
   * Create professional profile
   * @param {Object} profileData - Profile information
   * @returns {Promise<Object>} - API response
   */
  async createProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/professional/profile/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      return this.handleApiResponse(response); // Use the new handler
    } catch (error) {
      console.error('Profile creation error:', error);
      throw error; // Re-throw to be caught by the Vue component with error.code
    }
  }

  /**
   * Update professional profile
   * @param {Object} profileData - Profile information to update
   * @returns {Promise<Object>} - API response
   */
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/professional/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      return this.handleApiResponse(response); // Use the new handler
    } catch (error) {
      console.error('Profile update error:', error);
      throw error; // Re-throw to be caught by the Vue component with error.code
    }
  }

  /**
   * Get user's current location
   * @returns {Promise<{latitude: string, longitude: string}>}
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported. Using default location.');
        resolve({
          latitude: "26.449923", // Default to Kanpur coordinates
          longitude: "80.331871"
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve({
            latitude: "26.449923", // Default to Kanpur coordinates
            longitude: "80.331871"
          });
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Map frontend categories to API categories
   * @param {string} category - Frontend category
   * @returns {string} - API category
   */
  mapCategoryToAPI(category) {
    const categoryMapping = {
      'technology': 'TECHNOLOGY',
      'design': 'DESIGN',
      'other': 'OTHER'
    };
    return categoryMapping[category] || 'OTHER';
  }

  /**
   * Map frontend subcategories to API subcategories
   * @param {string} subCategory - Frontend subcategory
   * @returns {string} - API subcategory (Assuming API expects exact string or specific format)
   */
  mapSubCategoryToAPI(subCategory) {
    return subCategory; // Direct mapping for now, extend if API requires transformation
  }

  /**
   * Handles redirection from TrueLinq /linq/home.
   * This function should be called within the mounted hook of your Vue component.
   * It cleans URL parameters and redirects to MY_APP_BASE_URL if relevant.
   * @returns {boolean} - True if a redirect was detected and handled.
   */
  checkAndHandleTrueLinqRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const wasVerified = urlParams.has('verified') || urlParams.has('whatsapp_verified');

    if (wasVerified) {
      // Store the phone number if not already present (e.g., from a prior step)
      // For a robust solution, you'd need to pass the phone number as a URL param
      // back from TrueLinq or store it in localStorage before redirecting.
      // For now, let's assume if it was verified, we might not need the number here
      // if the authenticated flow immediately fetches it or if user re-enters.

      // Clean URL params to avoid re-triggering this on refresh
      const url = new URL(window.location);
      url.searchParams.delete('verified');
      url.searchParams.delete('whatsapp_verified');
      window.history.replaceState({}, document.title, url.pathname);

      // This function only reports if redirect was handled.
      // The component decides what step to go to.
      return true;
    }
    return false;
  }
}

// Export singleton instance
export default new ApiService();
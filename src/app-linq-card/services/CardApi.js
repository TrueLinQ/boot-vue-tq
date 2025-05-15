// const BASE_URL = 'https://app.truelinq.com/linq/pub/v1/verification/membership';
const BASE_URL = 'https://app.truelinq.com/linq/pub/v1/get/membership';


export default {
  async getCardData(verificationId, membershipId) {
    try {
      const url = `${BASE_URL}?verificationId=${verificationId}&membershipId=${membershipId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching card data:', error);
      throw error;
    }
  }
}

const API_BASE_URL = 'http://localhost:3000';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      auth: `${API_BASE_URL}/api/auth`,
      profile: `${API_BASE_URL}/api/profile`,
      product: `${API_BASE_URL}/api/product`,
      order: `${API_BASE_URL}/api/order`,
      admin: `${API_BASE_URL}/api/admin`
    }
  }
};
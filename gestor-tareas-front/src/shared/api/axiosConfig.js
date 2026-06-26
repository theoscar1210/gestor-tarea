import axios from "axios";

// Token en variable de módulo — inaccesible desde XSS a diferencia de sessionStorage.
let _authToken = null;

export const setAuthToken  = (token) => { _authToken = token; };
export const clearAuthToken = ()      => { _authToken = null; };
export const getAuthToken  = ()       => _authToken;

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  if (_authToken) {
    config.headers["Authorization"] = `Basic ${_authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event("auth:expired"));
    } else if (error.response?.status === 429) {
      console.warn("Rate limit alcanzado. Intenta más tarde.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

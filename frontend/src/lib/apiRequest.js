import axios from "axios";

const url = import.meta.env.VITE_API_URL_LOCAL || import.meta.env.VITE_API_URL_PROD;

const apiRequest = axios.create({
  baseURL: url,
  withCredentials: true,
});

export const setAuthToken = (token) => {

  if (token) {
    apiRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiRequest.defaults.headers.common["Authorization"];
  }
};

const token = localStorage.getItem("token");
setAuthToken(token);

export const removeAuthUser = () => localStorage.clear();

export default apiRequest;

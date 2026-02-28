import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

export default axiosClient;

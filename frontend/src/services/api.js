import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Change for production
});

// We can add interceptors here later to handle JWT tokens
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

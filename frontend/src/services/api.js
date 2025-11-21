import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register-user', data);
export const registerPartner = (data) => API.post('/auth/register-partner', data);

export const getFeed = (page, limit) => API.get(`/videos/all?page=${page}&limit=${limit}`);
export const getPartnerVideos = (id) => API.get(`/videos/by-partner/${id}`);
export const uploadVideo = (data) => API.post('/videos/upload', data);

export const likeVideo = (id) => API.put(`/videos/like/${id}`);
export const saveVideo = (id) => API.post(`/videos/save/${id}`);
export const getSavedVideos = () => API.get('/videos/saved');

export const getComments = (id) => API.get(`/videos/comments/${id}`);
export const postComment = (id, text) => API.post(`/videos/comment/${id}`, { text });
export const deleteComment = (id) => API.delete(`/videos/comment/${id}`);

export const getImageKitAuth = () => API.get('/videos/imagekit-auth');

export default API;

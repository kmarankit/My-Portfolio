
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Helper to get the token from storage
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

export const loginAdmin = (credentials) => API.post('/auth/login', credentials);

// Project Endpoints
export const fetchProjects = () => API.get('/projects'); 
export const addProject = (projectData) => API.post('/projects', projectData, getAuthHeader());
export const deleteProject = (id) => API.delete(`/projects/${id}`, getAuthHeader());

// Content Endpoints
export const fetchContent = (section) => API.get('/content', { params: section ? { section } : {} });
export const upsertContent = (payload) => API.post('/content', payload, getAuthHeader());

export default API;

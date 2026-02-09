import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth services
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
};

// Complaint services
export const complaintService = {
    create: (data) => api.post('/complaints', data),
    getAll: (params) => api.get('/complaints', { params }),
    getById: (id) => api.get(`/complaints/${id}`),
    updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
    submitFeedback: (id, data) => api.put(`/complaints/${id}/feedback`, data),
    getStats: () => api.get('/complaints/stats/dashboard'),
};

// Notification services
export const notificationService = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};

// Department services
export const departmentService = {
    getAll: () => api.get('/departments'),
    create: (data) => api.post('/departments', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
};

// Analytics services
export const analyticsService = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getDepartmentAnalytics: (department) =>
        api.get(`/analytics/department/${department}`),
};

// User services
export const userService = {
    getAll: (params) => api.get('/users', { params }),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

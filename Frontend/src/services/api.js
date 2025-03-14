import axios from 'axios';

const api = axios.create({
  // Use the production URL in production environment, otherwise use localhost
  baseURL: import.meta.env.PROD 
    ? 'https://hackathon-pccoe-vh1l.vercel.app/api'
    : 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.response?.data?.error?.message || 'Server error',
      errors: error.response?.data?.errors || error.response?.data?.error?.errors
    });
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      // Ensure all required fields are present and properly formatted
      const sanitizedData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        height: Number(userData.height),
        weight: Number(userData.weight),
        pregnancyDetails: {
          dueDate: userData.pregnancyDetails.dueDate,
          firstPregnancy: userData.pregnancyDetails.firstPregnancy,
          medicalConditions: userData.pregnancyDetails.medicalConditions || []
        },
        dietType: userData.dietType,
        notificationPreference: userData.notificationPreference,
        healthInfo: {
          medicalConditions: userData.healthInfo?.medicalConditions || []
        },
        notifications: {
          email: userData.notifications?.email || false,
          sms: userData.notifications?.sms || false,
          push: true
        },
        preferences: {
          dietaryRestrictions: [userData.dietType],
          notificationSettings: {
            email: userData.notifications?.email || false,
            push: true
          },
          language: 'English',
          theme: 'Light',
          units: 'Imperial'
        }
      };

      const response = await api.post('/auth/register', sanitizedData);
      return response;
    } catch (error) {
      console.error('Register API Error:', error);
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Get Current User API Error:', error);
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot Password API Error:', error);
      throw error;
    }
  },
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Reset Password API Error:', error);
      throw error;
    }
  }
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  logWeight: (weight) => api.post('/users/weight', { weight }),
  getWeightHistory: () => api.get('/users/weight'),
  getNutritionData: () => api.get('/users/nutrition'),
};

// Appointment API calls
export const appointmentAPI = {
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

export default api; 

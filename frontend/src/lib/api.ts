const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API client with authentication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {};

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Copy existing headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      // Token expired, attempting refresh
      await this.refreshToken();

      if (this.token) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${this.token}`;
        // Retrying request with refreshed token
        const retryResponse = await fetch(url, { ...options, headers });
        return retryResponse;
      } else {
        // Token refresh failed, redirecting to login
        return response; // Return original 401 response
      }
    }

    return response;
  }

  private async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // No refresh token found, logging out
      this.logout();
      return;
    }

    try {
      // Attempting to refresh token
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access;
        localStorage.setItem('access_token', data.access);
        // Token refreshed successfully
      } else {
        const errorText = await response.text();
        // Token refresh failed
        this.logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
    }
  }

  private logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      this.token = data.access;
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('profile', JSON.stringify(data.profile));
      return data;
    } else {
      const error = await response.json();
      // Handle Django validation errors
      let errorMessage = 'Login failed';
      if (error.non_field_errors && error.non_field_errors.length > 0) {
        errorMessage = error.non_field_errors[0];
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      }
      throw new Error(errorMessage);
    }
  }

  async getProfile() {
    const response = await this.request('/auth/profile/');
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to get profile');
  }

  // Generic CRUD methods
  async get(endpoint: string, params?: Record<string, any>) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await this.request(url, { method: 'GET' });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`GET ${endpoint} failed with status ${response.status}`);
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await this.request(endpoint, {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return response.json();
      }

      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }

      const error = new Error(errorData.message || `POST ${endpoint} failed`);
      (error as any).response = { data: errorData, status: response.status };
      throw error;
    } catch (error: any) {
      if (error.response) {
        throw error; // Re-throw if it already has response data
      }
      // Network error or other issue
      const networkError = new Error(`Network error: ${error.message}`);
      (networkError as any).response = undefined;
      throw networkError;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      const response = await this.request(endpoint, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return response.json();
      }

      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }

      const error = new Error(errorData.message || `PUT ${endpoint} failed`);
      (error as any).response = { data: errorData, status: response.status };
      throw error;
    } catch (error: any) {
      if (error.response) {
        throw error; // Re-throw if it already has response data
      }
      // Network error or other issue
      const networkError = new Error(`Network error: ${error.message}`);
      (networkError as any).response = undefined;
      throw networkError;
    }
  }

  async patch(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (response.ok) {
      return response.json();
    }
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `PATCH ${endpoint} failed`);
  }

  async delete(endpoint: string) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });

    if (response.ok) {
      return response.status === 204 ? null : response.json();
    }
    throw new Error(`DELETE ${endpoint} failed`);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Specific API methods for different entities
export const api = {
  // Authentication
  auth: {
    login: (email: string, password: string) => apiClient.login(email, password),
    getProfile: () => apiClient.getProfile(),
  },

  // Hero Images
  heroImages: {
    list: (params?: any) => apiClient.get('/hero-images/', params),
    get: (id: string) => apiClient.get(`/hero-images/${id}/`),
    create: (data: FormData) => apiClient.post('/hero-images/', data),
    update: (id: string, data: FormData) => apiClient.patch(`/hero-images/${id}/`, data),
    patch: (id: string, data: FormData) => apiClient.patch(`/hero-images/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/hero-images/${id}/`),
  },

  // Notices
  notices: {
    list: (params?: any) => apiClient.get('/notices/', params),
    get: (id: string) => apiClient.get(`/notices/${id}/`),
    create: (data: any) => apiClient.post('/notices/', data),
    update: (id: string, data: any) => apiClient.put(`/notices/${id}/`, data),
    patch: (id: string, data: any) => apiClient.patch(`/notices/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/notices/${id}/`),
  },

  // Magazines
  magazines: {
    list: (params?: any) => apiClient.get('/magazines/', params),
    get: (id: string) => apiClient.get(`/magazines/${id}/`),
    create: (data: FormData) => apiClient.post('/magazines/', data),
    update: (id: string, data: FormData) => apiClient.put(`/magazines/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/magazines/${id}/`),
  },

  // Clubs
  clubs: {
    list: (params?: any) => apiClient.get('/clubs/', params),
    get: (id: string) => apiClient.get(`/clubs/${id}/`),
    create: (data: any) => apiClient.post('/clubs/', data),
    update: (id: string, data: any) => apiClient.put(`/clubs/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/clubs/${id}/`),
    events: (id: string) => apiClient.get(`/clubs/${id}/events/`),
  },

  // Campus Events
  campusEvents: {
    list: (params?: any) => apiClient.get('/campus-events/', params),
    get: (id: string) => apiClient.get(`/campus-events/${id}/`),
    create: (data: any) => apiClient.post('/campus-events/', data),
    update: (id: string, data: any) => apiClient.put(`/campus-events/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/campus-events/${id}/`),
    upcoming: () => apiClient.get('/campus-events/upcoming/'),
    featured: () => apiClient.get('/campus-events/featured/'),
    byClub: (clubId: string) => apiClient.get(`/campus-events/by_club/?club_id=${clubId}`),
  },

  // Academic Services
  academicServices: {
    list: (params?: any) => apiClient.get('/academic-services/', params),
    get: (id: string) => apiClient.get(`/academic-services/${id}/`),
    create: (data: any) => apiClient.post('/academic-services/', data),
    update: (id: string, data: any) => apiClient.put(`/academic-services/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/academic-services/${id}/`),
  },

  // Toppers
  toppers: {
    list: (params?: any) => apiClient.get('/toppers/', params),
    get: (id: string) => apiClient.get(`/toppers/${id}/`),
    create: (data: FormData) => apiClient.post('/toppers/', data),
    update: (id: string, data: FormData) => apiClient.put(`/toppers/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/toppers/${id}/`),
  },

  // Creative Works
  creativeWorks: {
    list: (params?: any) => apiClient.get('/creative-works/', params),
    get: (id: string) => apiClient.get(`/creative-works/${id}/`),
    create: (data: any) => apiClient.post('/creative-works/', data),
    update: (id: string, data: any) => apiClient.put(`/creative-works/${id}/`, data),
    patch: (id: string, data: any) => apiClient.patch(`/creative-works/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/creative-works/${id}/`),
  },

  // Student Submissions
  studentSubmissions: {
    list: (params?: any) => apiClient.get('/student-submissions/', params),
    get: (id: string) => apiClient.get(`/student-submissions/${id}/`),
    create: (data: any) => apiClient.post('/student-submissions/', data),
    update: (id: string, data: any) => apiClient.put(`/student-submissions/${id}/`, data),
    patch: (id: string, data: any) => apiClient.patch(`/student-submissions/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/student-submissions/${id}/`),
    review: (id: string, data: any) => apiClient.post(`/student-submissions/${id}/review/`, data),
    pending: () => apiClient.get('/student-submissions/pending/'),
    approved: () => apiClient.get('/student-submissions/approved/'),
  },

  // Programs
  programs: {
    list: (params?: any) => apiClient.get('/programs/', params),
    get: (id: string) => apiClient.get(`/programs/${id}/`),
    create: (data: any) => apiClient.post('/programs/', data),
    update: (id: string, data: any) => apiClient.put(`/programs/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/programs/${id}/`),
    hierarchy: () => apiClient.get('/programs/hierarchy/'),
  },

  // Trades
  trades: {
    list: (params?: any) => apiClient.get('/trades/', params),
    get: (id: string) => apiClient.get(`/trades/${id}/`),
    create: (data: any) => apiClient.post('/trades/', data),
    update: (id: string, data: any) => apiClient.put(`/trades/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/trades/${id}/`),
  },

  // Departments
  departments: {
    list: (params?: any) => apiClient.get('/departments/', params),
    get: (id: string) => apiClient.get(`/departments/${id}/`),
    create: (data: any) => apiClient.post('/departments/', data),
    update: (id: string, data: any) => apiClient.put(`/departments/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/departments/${id}/`),
  },

  // Campus Stats
  campusStats: {
    list: (params?: any) => apiClient.get('/campus-stats/', params),
    get: (id: string) => apiClient.get(`/campus-stats/${id}/`),
    create: (data: any) => apiClient.post('/campus-stats/', data),
    update: (id: string, data: any) => apiClient.put(`/campus-stats/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/campus-stats/${id}/`),
  },

  // News
  news: {
    list: (params?: any) => apiClient.get('/news/', params),
    get: (id: string) => apiClient.get(`/news/${id}/`),
    create: (data: FormData) => apiClient.post('/news/', data),
    update: (id: string, data: FormData) => apiClient.put(`/news/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/news/${id}/`),
  },

  // Contact Info
  contactInfo: {
    list: (params?: any) => apiClient.get('/contact-info/', params),
    get: (id: string) => apiClient.get(`/contact-info/${id}/`),
    create: (data: any) => apiClient.post('/contact-info/', data),
    update: (id: string, data: any) => apiClient.put(`/contact-info/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/contact-info/${id}/`),
  },

  // Office Locations
  officeLocations: {
    list: (params?: any) => apiClient.get('/office-locations/', params),
    get: (id: string) => apiClient.get(`/office-locations/${id}/`),
    create: (data: any) => apiClient.post('/office-locations/', data),
    update: (id: string, data: any) => apiClient.put(`/office-locations/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/office-locations/${id}/`),
  },

  // Quick Contact Information
  quickContactInfo: {
    list: (params?: any) => apiClient.get('/quick-contact-info/', params),
    get: (id: string) => apiClient.get(`/quick-contact-info/${id}/`),
    create: (data: any) => apiClient.post('/quick-contact-info/', data),
    update: (id: string, data: any) => apiClient.put(`/quick-contact-info/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/quick-contact-info/${id}/`),
  },

  // Aliases for compatibility
  amenities: {
    list: (params?: any) => apiClient.get('/contact-info/', params),
    get: (id: string) => apiClient.get(`/contact-info/${id}/`),
    create: (data: any) => apiClient.post('/contact-info/', data),
    update: (id: string, data: any) => apiClient.put(`/contact-info/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/contact-info/${id}/`),
  },

  // Stats alias
  stats: {
    list: (params?: any) => apiClient.get('/campus-stats/', params),
    get: (id: string) => apiClient.get(`/campus-stats/${id}/`),
    create: (data: any) => apiClient.post('/campus-stats/', data),
    update: (id: string, data: any) => apiClient.put(`/campus-stats/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/campus-stats/${id}/`),
  },

  // Department Gallery Images
  departmentGalleryImages: {
    list: (params?: any) => apiClient.get('/department-gallery-images/', params),
    get: (id: string) => apiClient.get(`/department-gallery-images/${id}/`),
    create: (data: FormData) => apiClient.post('/department-gallery-images/', data),
    update: (id: string, data: FormData) => apiClient.put(`/department-gallery-images/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/department-gallery-images/${id}/`),
  },

  // Timetables
  timetables: {
    list: () => apiClient.get('/timetables/'),
    get: (id: string) => apiClient.get(`/timetables/${id}/`),
    create: (data: any) => apiClient.post('/timetables/', data),
    update: (id: string, data: any) => apiClient.put(`/timetables/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/timetables/${id}/`),
    current: () => apiClient.get('/timetables/current/'),
  },

  // Users Management (for regular users only - not superadmins)
  users: {
    list: () => apiClient.get('/auth/users/'),
    get: (id: string) => apiClient.get(`/auth/users/${id}/`),
    create: (data: any) => apiClient.post('/auth/users/', data),
    update: (id: string, data: any) => apiClient.put(`/auth/users/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/auth/users/${id}/`),
    updateCredentials: (id: string, data: any) => apiClient.put(`/auth/users/${id}/credentials/`, data),
  },

  // Generic delete method
  delete: (endpoint: string) => apiClient.delete(endpoint),

  // Fees Structure
  fees: {
    list: (params?: any) => apiClient.get('/fees-structure/', params),
    get: (id: string) => apiClient.get(`/fees-structure/${id}/`),
    create: (data: any) => apiClient.post('/fees-structure/', data),
    update: (id: string, data: any) => apiClient.put(`/fees-structure/${id}/`, data),
    patch: (id: string, data: any) => apiClient.patch(`/fees-structure/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/fees-structure/${id}/`),
  },

  // Hostels
  hostels: {
    list: (params?: any) => apiClient.get('/hostels/', params),
    get: (id: string) => apiClient.get(`/hostels/${id}/`),
    create: (formData: FormData) => apiClient.post('/hostels/', formData),
    update: (id: string, formData: FormData) => apiClient.put(`/hostels/${id}/`, formData),
    patch: (id: string, data: any) => apiClient.patch(`/hostels/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/hostels/${id}/`),
    deleteImage: (hostelId: string, imageId: string) =>
      apiClient.delete(`/hostels/${hostelId}/images/${imageId}/`),
  },

  // Sports Facilities
  sportsFacilities: {
    list: (params?: any) => apiClient.get('/sports-facilities/', params),
    get: (id: string) => apiClient.get(`/sports-facilities/${id}/`),
    create: (formData: FormData) => apiClient.post('/sports-facilities/', formData),
    update: (id: string, formData: FormData) => apiClient.put(`/sports-facilities/${id}/`, formData),
    patch: (id: string, data: any) => apiClient.patch(`/sports-facilities/${id}/`, data),
    delete: (id: string) => apiClient.delete(`/sports-facilities/${id}/`),
    deleteImage: (facilityId: string, imageId: string) =>
      apiClient.delete(`/sports-facilities/${facilityId}/images/${imageId}/`),
  },
};

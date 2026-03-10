// API service layer for CarLogix
// Talks to the Spring Boot backend via REST

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

class ApiService {
  constructor() {
    this.token = localStorage.getItem('carlogix_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('carlogix_token', token);
    } else {
      localStorage.removeItem('carlogix_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}/api${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.reload();
      throw new Error('Session expired');
    }

    const data = response.status === 204 ? null : await response.json();

    if (!response.ok) {
      const fieldErrors = data?.fields ? Object.values(data.fields).join(', ') : null;
      throw new Error(fieldErrors || data?.error || 'Request failed');
    }

    return data;
  }

  // ==================== AUTH ====================

  async register(email, password, displayName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    this.setToken(data.token);
    return { success: true, user: data.user };
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return { success: true, user: data.user };
  }

  logout() {
    this.setToken(null);
  }

  // ==================== VEHICLES ====================

  async getVehicles() {
    return this.request('/vehicles');
  }

  async createVehicle(vehicleData) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id, vehicleData) {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id) {
    await this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DIAGNOSTICS ====================

  async getDiagnostics() {
    return this.request('/diagnostics');
  }

  async getVehicleDiagnostics(vehicleId) {
    return this.request(`/diagnostics/vehicle/${vehicleId}`);
  }

  async createDiagnostic(diagnosticData) {
    return this.request('/diagnostics', {
      method: 'POST',
      body: JSON.stringify(diagnosticData),
    });
  }

  async resolveDiagnostic(id) {
    return this.request(`/diagnostics/${id}/resolve`, {
      method: 'PATCH',
    });
  }

  // ==================== MAINTENANCE ====================

  async getMaintenanceRecords() {
    return this.request('/maintenance');
  }

  async createMaintenanceRecord(data) {
    return this.request('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenanceRecord(id, data) {
    return this.request(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMaintenanceRecord(id) {
    await this.request(`/maintenance/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== USER PROFILE ====================

  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(data) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data) {
    await this.request('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

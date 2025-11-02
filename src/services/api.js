import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';
// If your backend is running on a different port, update the URL above
// For example: const API_BASE_URL = 'http://localhost:9090/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use Bearer format if that's what your backend expects
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc)
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if needed (uncomment if desired)
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export this function for backward compatibility with Register.jsx
export const registerUser = (userData) => {
  // Kept as /patients to match your existing Register.jsx behavior
  return api.post('/patients', userData);
};

// Auth services
export const authService = {
  patientLogin: (credentials) => {
    return api.post('/auth/patient/login', credentials)
      .then(response => {
        if (!response.data || (!response.data.token && !response.data.success)) {
          throw new Error(response.data?.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  doctorLogin: (credentials) => {
    return api.post('/auth/doctor/login', credentials)
      .then(response => {
        if (!response.data || (!response.data.token && !response.data.success)) {
          throw new Error(response.data?.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  labtechLogin: (credentials) => {
    return api.post('/auth/labtech/login', credentials)
      .then(response => {
        if (!response.data || (!response.data.token && !response.data.success)) {
          throw new Error(response.data?.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  pharmacistLogin: (credentials) => {
    return api.post('/auth/pharmacist/login', credentials)
      .then(response => {
        if (!response.data || (!response.data.token && !response.data.success)) {
          throw new Error(response.data?.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  adminLogin: (credentials) => {
    return api.post('/auth/admin/login', credentials)
      .then(response => {
        if (!response.data || (!response.data.token && !response.data.success)) {
          throw new Error(response.data?.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  logout: () => api.post('/auth/logout'),
  validateToken: () => api.get('/auth/validate')
};

// Patient services
export const patientService = {
  getAllPatients: () => api.get('/patients'),
  getPatientById: (id) => api.get(`/patients/${encodeURIComponent(id)}`),
  createPatient: (data) => api.post('/patients', data),
  updatePatient: (id, data) => api.put(`/patients/${encodeURIComponent(id)}`, data),
  deletePatient: (id) => api.delete(`/patients/${encodeURIComponent(id)}`),
  searchPatientsByName: (name) => api.get(`/patients/search?name=${encodeURIComponent(name)}`),
  findPatientByEmail: (email) => api.get(`/patients/email?email=${encodeURIComponent(email)}`),
  findPatientsByContact: (contact) => api.get(`/patients/search-contact?contact=${encodeURIComponent(contact)}`),
  getPatientDetails: async (patientId) => {
    try {
      const response = await api.get(`/patients/${encodeURIComponent(patientId)}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch patient:", error);
      throw error;
    }
  },
  getDoctorPatients: (doctorId) => api.get(`/patients/doctor/${encodeURIComponent(doctorId)}`),
  changePassword: (patientId, passwordData) => api.put(`/patients/${encodeURIComponent(patientId)}/change-password`, passwordData),
};

// Doctor services
export const doctorService = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${encodeURIComponent(id)}`),
  addDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, data) => api.put(`/doctors/${encodeURIComponent(id)}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${encodeURIComponent(id)}`),
  getDoctorsBySpecialty: (specialtyId) => api.get(`/doctors/specialization/${encodeURIComponent(specialtyId)}`),
  getAllSpecializations: () => api.get('/specializations'),
  // New methods for doctor dashboard
  getDoctorStats: (id) => api.get(`/doctors/${encodeURIComponent(id)}/stats`),
  getDoctorTodayAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${encodeURIComponent(id)}/date/${encodeURIComponent(today)}`);
  },
  getDoctorPatientCount: (id) => api.get(`/doctors/${encodeURIComponent(id)}/patients/count`),
  getDoctorUpcomingAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${encodeURIComponent(id)}/upcoming?from=${encodeURIComponent(today)}`);
  },
  calculateDoctorStats: async (id) => {
    try {
      const appointmentsResponse = await appointmentService.getAppointmentsByDoctor(id);
      const appointments = appointmentsResponse.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAppointments = appointments.filter(app => {
        const appDate = new Date(app.appointmentDate || app.appointment_date || app.date);
        return appDate.toDateString() === today.toDateString();
      });
      const uniquePatients = new Set();
      appointments.forEach(app => {
        uniquePatients.add(app.pId || app.P_ID || app.patientId || app.patient_id);
      });
      return {
        data: {
          totalAppointments: appointments.length,
          todayAppointments: todayAppointments.length,
          patientCount: uniquePatients.size,
          todayAppointmentsList: todayAppointments
        }
      };
    } catch (error) {
      console.error('Error calculating doctor stats:', error);
      throw error;
    }
  },
};

// Labtech services
export const labtechService = {
  getAllLabTechs: () => api.get('/labtechs'),
  getLabTechById: (id) => api.get(`/labtechs/${encodeURIComponent(id)}`),
  addLabTech: (data) => api.post('/labtechs', data),
  updateLabTech: (id, data) => api.put(`/labtechs/${encodeURIComponent(id)}`, data),
  deleteLabTech: (id) => api.delete(`/labtechs/${encodeURIComponent(id)}`),

  // ===== Mock Data for Lab Tests =====
  getLabTestsByLabtech: (id) => {
    console.log(`MOCK API: Fetching lab tests for labtech ${id}`);
    const mockData = [
      { id: 101, patientId: 123, patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', status: 'Pending', date: '2025-10-25', priority: 'High' },
      { id: 102, patientId: 124, patientName: 'Jane Smith', testName: 'Blood Glucose Test', status: 'In Progress', date: '2025-10-24', priority: 'Medium' },
      { id: 104, patientId: 126, patientName: 'Emily Davis', testName: 'Urine Analysis', status: 'Pending', date: '2025-10-25', priority: 'Low' },
      { id: 105, patientId: 129, patientName: 'Mike Johnson', testName: 'Comprehensive Metabolic Panel', status: 'Pending', date: '2025-10-26', priority: 'High' },
    ];
    return Promise.resolve({ data: mockData.filter(t => t.status !== 'Completed') });
  },

  // ===== Mock Data for Completed Reports =====
  getCompletedLabReports: (id) => {
    console.log(`MOCK API: Fetching completed lab reports for labtech ${id}`);
    const mockData = [
      { id: 201, patientId: 125, patientName: 'Robert Brown', testName: 'Thyroid Function Test', dateCompleted: '2025-10-23', reportUrl: '#', resultSummary: 'T3 and T4 levels are normal.' },
      { id: 202, patientId: 126, patientName: 'Emily White', testName: 'Liver Function Test', dateCompleted: '2025-10-24', reportUrl: '#', resultSummary: 'ALT slightly elevated.' },
      { id: 203, patientId: 127, patientName: 'Chris Evans', testName: 'Lipid Panel', dateCompleted: '2025-10-22', reportUrl: '#', resultSummary: 'Elevated LDL cholesterol.' },
      { id: 204, patientId: 128, patientName: 'Jessica Alba', testName: 'Liver Function Test', dateCompleted: '2025-10-20', reportUrl: '#', resultSummary: 'Results are within normal limits.' },
    ];
    return Promise.resolve({ data: mockData });
  },

  // ===== Mock Function for Updating Test Status =====
  updateLabTestStatus: (testId, newStatus) => {
    console.log(`MOCK API: Updating test ${testId} status to ${newStatus}`);
    return Promise.resolve({ data: { success: true, message: 'Status updated successfully' } });
  }
};

// Pharmacist services (added/expanded)
export const pharmacistService = {
  getAllPharmacists: () => api.get('/pharmacists'),
  getPharmacistById: (id) => api.get(`/pharmacists/${encodeURIComponent(id)}`),
  addPharmacist: (data) => api.post('/pharmacists', data),
  updatePharmacist: (id, data) => api.put(`/pharmacists/${encodeURIComponent(id)}`, data),
  deletePharmacist: (id) => api.delete(`/pharmacists/${encodeURIComponent(id)}`),

  // Inventory endpoints - try pharmacist-specific then fallback to generic medicines endpoint
  getMedicineInventory: (pharmacistId) =>
    api.get(`/pharmacists/${encodeURIComponent(pharmacistId)}/inventory`)
      .catch(() => api.get('/medicines')),

  getMedicineById: (medicineId) => api.get(`/medicines/${encodeURIComponent(medicineId)}`),

  searchMedicines: (query) => api.get(`/medicines/search?q=${encodeURIComponent(query)}`),

  updateMedicineQuantity: (medicineId, updatePayload) =>
    api.put(`/medicines/${encodeURIComponent(medicineId)}`, updatePayload),

  reorderMedicine: (medicineId, quantity) =>
    api.post(`/medicines/${encodeURIComponent(medicineId)}/reorder`, { quantity })
      .catch(() => api.put(`/medicines/${encodeURIComponent(medicineId)}`, { reorderQuantity: quantity })),

  // Orders endpoints - try pharmacist-specific then fallback
  getMedicineOrdersByPharmacist: (pharmacistId) =>
    api.get(`/pharmacists/${encodeURIComponent(pharmacistId)}/orders`)
      .catch(() => api.get(`/medicine-orders?pharmacistId=${encodeURIComponent(pharmacistId)}`)),

  getCompletedMedicineOrders: (pharmacistId) =>
    api.get(`/pharmacists/${encodeURIComponent(pharmacistId)}/orders?status=completed`)
      .catch(() => api.get(`/medicine-orders?status=completed&pharmacistId=${encodeURIComponent(pharmacistId)}`)),

  getMedicineOrderById: (orderId) => api.get(`/medicine-orders/${encodeURIComponent(orderId)}`),

  createMedicineOrder: (orderData) => api.post('/medicine-orders', orderData),

  updateMedicineOrderStatus: (orderId, status) =>
    api.put(`/medicine-orders/${encodeURIComponent(orderId)}/status`, { status })
      .catch(() => api.put(`/medicine-orders/${encodeURIComponent(orderId)}`, { status })),

  // Mock helpers for frontend development
  getMedicineInventoryMock: (pharmacistId) => {
    const mock = [
      { id: 'M101', name: 'Paracetamol 500mg', quantity: 3, reorderLevel: 5, lastUpdatedBy: 'System' },
      { id: 'M102', name: 'Amoxicillin 250mg', quantity: 12, reorderLevel: 10 },
      { id: 'M103', name: 'Ibuprofen 200mg', quantity: 0, reorderLevel: 8 }
    ];
    console.log(`MOCK API: getMedicineInventory for ${pharmacistId}`);
    return Promise.resolve({ data: mock });
  },

  getMedicineOrdersMock: (pharmacistId) => {
    const mock = [
      { id: 201, patientName: 'A. Khan', medicines: ['Paracetamol'], status: 'Pending', date: '2025-10-30' },
      { id: 202, patientName: 'S. Patel', medicines: ['Amoxicillin'], status: 'Processing', date: '2025-10-29' },
      { id: 203, patientName: 'R. Singh', medicines: ['Ibuprofen'], status: 'Completed', date: '2025-10-25' }
    ];
    console.log(`MOCK API: getMedicineOrders for ${pharmacistId}`);
    return Promise.resolve({ data: mock });
  }
};

// Specialty services
export const specialtyService = {
  getAllSpecialties: () => api.get('/specializations')
};

// Appointment services
export const appointmentService = {
  getAllAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${encodeURIComponent(id)}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, data) => api.put(`/appointments/${encodeURIComponent(id)}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${encodeURIComponent(id)}`),
  getAppointmentsByDoctor: (doctorId) => api.get(`/appointments/doctor/${encodeURIComponent(doctorId)}`),
  getAppointmentsByPatient: (patientId) => api.get(`/appointments/patient/${encodeURIComponent(patientId)}`),
  getAppointmentsByStatus: (status) => api.get(`/appointments/status/${encodeURIComponent(status)}`),
  getAppointmentsByDate: (date) => api.get(`/appointments/date/${encodeURIComponent(date)}`),
  getAppointmentsByDoctorAndDate: (doctorId, date) => api.get(`/appointments/doctor/${encodeURIComponent(doctorId)}/date/${encodeURIComponent(date)}`),
  updateAppointmentStatus: (id, status) => {
    console.log(`Updating appointment ${id} status to ${status}`);
    try {
      return api.put(`/appointments/${encodeURIComponent(id)}/status?status=${encodeURIComponent(status)}`)
        .catch(error => {
          console.log('First endpoint attempt failed, trying alternative format');
          return api.put(`/appointments/${encodeURIComponent(id)}`, { status });
        });
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      throw error;
    }
  },
  checkAvailability: (doctorId, date, time) =>
    api.get(`/appointments/check?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`),
  getDoctorPatients: (doctorId) => api.get(`/appointments/${encodeURIComponent(doctorId)}/patients`),
};

// Prescription services
export const prescriptionService = {
  getAllPrescriptions: () => api.get('/prescriptions'),
  getPrescriptionById: (id) => api.get(`/prescriptions/${encodeURIComponent(id)}`),
  getPrescriptionsByPatient: (patientId) => api.get(`/prescriptions/patient/${encodeURIComponent(patientId)}`),
  getPrescriptionsByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${encodeURIComponent(doctorId)}`),
  getPrescriptionsByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${encodeURIComponent(appointmentId)}`),
  createPrescription: (prescriptionData) => {
    console.log('Sending prescription data:', prescriptionData);
    return api.post('/prescriptions', prescriptionData);
  },
  updatePrescription: (id, data) => api.put(`/prescriptions/${encodeURIComponent(id)}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${encodeURIComponent(id)}`)
};

export default api;
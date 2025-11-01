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
      config.headers['Authorization'] = token;
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
        // Redirect to login if needed
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export this function for backward compatibility with Register.jsx
export const registerUser = (userData) => {
  return api.post('/patients', userData);
};

// Auth services
export const authService = {
  patientLogin: (credentials) => {
    return api.post('/auth/patient/login', credentials)
      .then(response => {
        // Check if response is successful but doesn't have expected data
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
        }
        return response;
      })
      .catch(error => {
        // If there's a response from server with error message
        if (error.response && error.response.data) {
          throw { ...error, message: error.response.data.message || 'Login failed' };
        }
        throw error;
      });
  },
  doctorLogin: (credentials) => {
    return api.post('/auth/doctor/login', credentials)
      .then(response => {
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
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
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
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
        if (!response.data.token || !response.data.success) {
          throw new Error(response.data.message || 'Invalid login response');
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

// Staff auth
// (no staff auth configured here)

// Patient services
export const patientService = {
  getAllPatients: () => api.get('/patients'),
  getPatientById: (id) => api.get(`/patients/${id}`),
  createPatient: (data) => api.post('/patients', data),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  searchPatientsByName: (name) => api.get(`/patients/search?name=${name}`),
  findPatientByEmail: (email) => api.get(`/patients/email?email=${email}`),
  findPatientsByContact: (contact) => api.get(`/patients/search-contact?contact=${contact}`),
  getPatientDetails: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch patient:", error);
      throw error;
    }
  },
  getDoctorPatients: (doctorId) => api.get(`/patients/doctor/${doctorId}`),
  changePassword: (patientId, passwordData) => api.put(`/patients/${patientId}/change-password`, passwordData),
};

// Staff services (minimal)
// export const staffService = {
//   createStaff: (data) => {
//     const designation = (data.designation || '').toUpperCase();

//     // const mapping = {
//     //   ADMIN: '/admins',
//     //   DOCTOR: '/doctors',
//     //   LABTECH: '/labtech'
//     // };

//     const endpoint = '/doctors';
//     return api.post(endpoint.trim(), data); 
//   }
// };

// Staff services
// (no staffService defined)

// Doctor services
export const doctorService = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  addDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  getDoctorsBySpecialty: (specialtyId) => api.get(`/doctors/specialization/${specialtyId}`),
  getAllSpecializations: () => api.get('/specializations'),
  // New methods for doctor dashboard
  getDoctorStats: (id) => api.get(`/doctors/${id}/stats`),
  getDoctorTodayAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${id}/date/${today}`);
  },
  getDoctorPatientCount: (id) => api.get(`/doctors/${id}/patients/count`),
  getDoctorUpcomingAppointments: (id) => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/appointments/doctor/${id}/upcoming?from=${today}`);
  },
  // This is a fallback method if your backend doesn't support the endpoints above
  calculateDoctorStats: async (id) => {
    try {
      // Get all appointments for this doctor
      const appointmentsResponse = await appointmentService.getAppointmentsByDoctor(id);
      const appointments = appointmentsResponse.data || [];
      
      // Current date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate stats
      const todayAppointments = appointments.filter(app => {
        const appDate = new Date(app.appointmentDate || app.appointment_date || app.date);
        return appDate.toDateString() === today.toDateString();
      });
      
      // Get unique patients
      const uniquePatients = new Set();
      appointments.forEach(app => {
        uniquePatients.add(app.pId || app.P_ID);
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

export const labtechService = {
  getAllLabTechs: () => api.get('/labtechs'),
  getLabTechById: (id) => api.get(`/labtechs/${id}`),
  addLabTech: (data) => api.post('/labtechs', data),
  updateLabTech: (id, data) => api.put(`/labtechs/${id}`, data),
  deleteLabTech: (id) => api.delete(`/labtechs/${id}`),

  // ===== Mock Data for Lab Tests =====
  getLabTestsByLabtech: (id) => {
    console.log(`MOCK API: Fetching lab tests for labtech ${id}`);
    const mockData = [
      { id: 101, patientId: 123, patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', status: 'Pending', date: '2025-10-25', priority: 'High' },
      { id: 102, patientId: 124, patientName: 'Jane Smith', testName: 'Blood Glucose Test', status: 'In Progress', date: '2025-10-24', priority: 'Medium' },
      { id: 104, patientId: 126, patientName: 'Emily Davis', testName: 'Urine Analysis', status: 'Pending', date: '2025-10-25', priority: 'Low' },
      { id: 105, patientId: 129, patientName: 'Mike Johnson', testName: 'Comprehensive Metabolic Panel', status: 'Pending', date: '2025-10-26', priority: 'High' },
      // ... additional mock tests
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
      // ... additional mock reports
    ];
    return Promise.resolve({ data: mockData });
  },

  // ===== Mock Function for Updating Test Status =====
  updateLabTestStatus: (testId, newStatus) => {
    console.log(`MOCK API: Updating test ${testId} status to ${newStatus}`);
    return Promise.resolve({ data: { success: true, message: 'Status updated successfully' } });
  }
};

// Specialty services
export const specialtyService = {
  getAllSpecialties: () => api.get('/specializations')
};

// Appointment services
export const appointmentService = {
  getAllAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getAppointmentsByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getAppointmentsByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getAppointmentsByStatus: (status) => api.get(`/appointments/status/${status}`),
  getAppointmentsByDate: (date) => api.get(`/appointments/date/${date}`),
  getAppointmentsByDoctorAndDate: (doctorId, date) => api.get(`/appointments/doctor/${doctorId}/date/${date}`),
  updateAppointmentStatus: (id, status) => {
    console.log(`Updating appointment ${id} status to ${status}`);
    
    // Try both endpoint formats since backends can vary
    try {
      return api.put(`/appointments/${id}/status?status=${status}`)
        .catch(error => {
          console.log('First endpoint attempt failed, trying alternative format');
          // If the first format fails, try the second common format
          return api.put(`/appointments/${id}`, { status: status });
        });
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      throw error;
    }
  },
  checkAvailability: (doctorId, date, time) => 
    api.get(`/appointments/check?doctorId=${doctorId}&date=${date}&time=${time}`),
  getDoctorPatients: (doctorId) => api.get(`/appointments/${doctorId}/patients`),
};

// Prescription services
export const prescriptionService = {
  getAllPrescriptions: () => api.get('/prescriptions'),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getPrescriptionsByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getPrescriptionsByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
  createPrescription: (prescriptionData) => {
    console.log('Sending prescription data:', prescriptionData);
    return api.post('/prescriptions', prescriptionData);
  },
  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`)
};


export default api;




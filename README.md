# MediLink - Hospital Management System Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

This is the frontend repository for MediLink, a comprehensive Hospital Management System (HMS) built with React, Vite, and Tailwind CSS. It provides a complete user interface for various roles within a hospital, including patients, doctors, lab technicians, pharmacists, and administrators.

---

## ✨ Features

The application is split into a public-facing site and role-based private dashboards.

### Public Pages
* **Home:** Landing page with an overview of services and stats.
* **About Us:** Information about the hospital and its team.
* **Services:** Detailed list of medical services offered.
* **Our Doctors:** A public list of doctors on staff.
* **Contact Us:** A contact form and location details.

### 🔐 Authentication
* **Role-Based Login:** Separate login portals for Patients, Doctors, Lab Techs, Pharmacists, and Admins.
* **Registration:** A multi-step registration process for new patients and a separate flow for staff registration.
* **Protected Routes:** Client-side routing is protected based on user role and authentication status.

### 👤 Patient Dashboard
* **Dashboard:** A summary of upcoming appointments and recent prescriptions.
* **Book Appointment:** An interface to select a specialty and doctor to book a new appointment.
* **My Appointments:** View upcoming, past, and cancelled appointments.
* **My Prescriptions:** View a list of all prescriptions issued by doctors.
* **Lab Appointments:** View status and results of lab test appointments.
* **Billing:** View and pay outstanding bills (integrates with Razorpay).
* **Profile Management:** Update personal details and change password.

### 🩺 Doctor Dashboard
* **Dashboard:** A summary of today's appointments and other key stats.
* **Appointments:** View and manage the appointment schedule (today, upcoming, past).
* **Create Prescription:** A form to issue new prescriptions to patients during an appointment.
* **Patients:** View a list of patients associated with the doctor.
* **Profile Management:** Update professional details.

### 🔬 Lab Technician Dashboard
* **Dashboard:** A summary of pending and completed lab tests.
* **Manage Lab Tests:** Add, edit, and delete available lab test types and their fees.
* **Manage Appointments:** View assigned lab appointments, update status, and add remarks/results.
* **Profile Management:** Update personal details.

### 💊 Pharmacist Dashboard
* **Dashboard:** A summary of pending orders and inventory status.
* **Medicine Inventory:** Manage the list of available medicines, update stock levels, and add new medicines.
* **Medicine Orders:** View and process pending medicine orders from patients/doctors.
* **Profile Management:** Update personal details.

### 🖥️ Admin Dashboard
* **Dashboard:** High-level overview of hospital statistics (total doctors, patients, appointments).
* **Manage Doctors:** Add new doctors, view all doctors, and remove doctors.
* **Manage Patients:** View a complete list of all registered patients.
* **Manage Appointments:** View and manage all appointments in the system.

---

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/) (v19)
* **Bundler:** [Vite](https://vitejs.dev/)
* **Routing:** [React Router](https://reactrouter.com/) (v6)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **API Client:** [Axios](https://axios-http.com/)
* **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* `npm` or `yarn`

### Installation

1.  **Clone the repository:**
   
2.  **Install dependencies:**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

### Running the Development Server

1.  **Run the Vite dev server:**
    ```sh
    npm run dev
    ```

2.  Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view the application in your browser.

---

## 🌐 Backend API

This frontend application is designed to work with a separate backend API, backend is in a separate repository HMSBackend.

* The API connection is configured in `src/services/api.js`.
* By default, the application attempts to connect to **`http://localhost:8080/api`**.
* You must have the corresponding backend server running at this address for the application to function correctly (including login, registration, and data fetching).

---

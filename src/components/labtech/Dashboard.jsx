// // // import { useState, useEffect } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import { 
// // //   ClockIcon,
// // //   CheckIcon,
// // //   ArrowRightIcon,
// // //   UserIcon,
// // //   DocumentTextIcon,
// // //   ChartBarIcon,
// // //   BeakerIcon,
// // //   ClipboardDocumentListIcon,
// // //   HomeIcon,
// // //   CalendarDaysIcon
// // // } from '@heroicons/react/24/outline';
// // // import { labtechService } from '../../services/api'; 
// // // import { toast } from 'react-toastify';

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [labCounts, setLabCounts] = useState({
// // //     pending: 0,
// // //     inProgress: 0,
// // //     completed: 0,
// // //     total: 0
// // //   });
// // //   const [techInfo, setTechInfo] = useState({
// // //     name: '',
// // //     role: 'Lab Technician',
// // //     lab: 'Central Diagnostics Lab'
// // //   });
// // //   const [recentTests, setRecentTests] = useState([]);
// // //   const [recentReports, setRecentReports] = useState([]);
  
// // //   useEffect(() => {
// // //     const init = async () => {
// // //       try {
// // //         setLoading(true);
// // //         setError(null);

// // //         const userStr = localStorage.getItem('user');
// // //         if (!userStr) {
// // //           throw new Error('User data not found. Please log in again.');
// // //         }

// // //         const userData = JSON.parse(userStr);
// // //         // Use a static ID for mock data if user ID is missing
// // //         const labtechId = userData.id || 'mock_labtech_id';

// // //         // Set basic tech info from user data
// // //         setTechInfo({
// // //           name: userData.name || 'LabTech',
// // //           role: userData.role || 'Lab Technician',
// // //           lab: userData.lab || 'Central Diagnostics Lab'
// // //         });

// // //         // Fetch active tests (Pending/In Progress)
// // //         const testsRes = await labtechService.getLabTestsByLabtech(labtechId);
// // //         const tests = testsRes.data || [];
        
// // //         // Fetch completed reports
// // //         const reportsRes = await labtechService.getCompletedLabReports(labtechId);
// // //         const reports = reportsRes.data || [];

// // //         // Calculate counts
// // //         const pendingCount = tests.filter(t => t.status === 'Pending').length;
// // //         const inProgressCount = tests.filter(t => t.status === 'In Progress').length;
// // //         const completedCount = reports.length;

// // //         setLabCounts({
// // //           pending: pendingCount,
// // //           inProgress: inProgressCount,
// // //           completed: completedCount,
// // //           total: pendingCount + inProgressCount + completedCount
// // //         });

// // //         // Set top 3 lists
// // //         setRecentTests(tests.slice(0, 3));
// // //         setRecentReports(reports.slice(0, 3));

// // //       } catch (err) {
// // //         console.error('Error initializing lab dashboard:', err);
// // //         setError(err.message || 'Failed to load dashboard data');
// // //         toast.error(`Dashboard Error: ${err.message || 'Failed to load data'}`);
// // //         // Fallback to mock data display if API call fails
// // //         setLabCounts({ pending: 3, inProgress: 1, completed: 5, total: 9 });
// // //         setRecentTests([
// // //           { id: 101, patientName: 'John Doe', testName: 'CBC', status: 'Pending', date: '2025-10-25' },
// // //           { id: 102, patientName: 'Jane Smith', testName: 'Glucose', status: 'In Progress', date: '2025-10-24' },
// // //         ]);
// // //         setRecentReports([
// // //           { id: 201, patientName: 'R. Brown', testName: 'Thyroid', dateCompleted: '2025-10-23', resultSummary: 'Normal.' },
// // //         ]);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     init();
// // //   }, []);

// // //   const handleCardClick = (cardId) => {
// // //     if (cardId === 'pending' || cardId === 'inProgress') navigate('/labtech/lab-tests');
// // //     else if (cardId === 'completed') navigate('/labtech/lab-reports');
// // //     else navigate('/labtech/dashboard');
// // //   };

// // //   const labCards = [
// // //     {
// // //       id: 'pending',
// // //       title: 'Pending Tests',
// // //       count: labCounts.pending,
// // //       icon: <ClockIcon className="h-8 w-8 text-yellow-500" />,
// // //       color: 'bg-yellow-50 border-yellow-100',
// // //       textColor: 'text-yellow-900'
// // //     },
// // //     {
// // //       id: 'inProgress',
// // //       title: 'In-Progress Tests',
// // //       count: labCounts.inProgress,
// // //       icon: <ChartBarIcon className="h-8 w-8 text-blue-500" />,
// // //       color: 'bg-blue-50 border-blue-100',
// // //       textColor: 'text-blue-900'
// // //     },
// // //     {
// // //       id: 'completed',
// // //       title: 'Completed Reports',
// // //       count: labCounts.completed,
// // //       icon: <CheckIcon className="h-8 w-8 text-green-500" />,
// // //       color: 'bg-green-50 border-green-100',
// // //       textColor: 'text-green-900'
// // //     }
// // //   ];

// // //   const quickActions = [
// // //     {
// // //       title: 'View Active Tests',
// // //       icon: <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />,
// // //       path: '/labtech/lab-tests',
// // //       description: 'Review and start tests'
// // //     },
// // //     {
// // //       title: 'Manage Reports',
// // //       icon: <DocumentTextIcon className="h-6 w-6 text-green-500" />,
// // //       path: '/labtech/lab-reports',
// // //       description: 'Upload or view final reports'
// // //     },
// // //     {
// // //       title: 'My Profile',
// // //       icon: <UserIcon className="h-6 w-6 text-purple-500" />,
// // //       path: '/labtech/profile',
// // //       description: 'Update your details'
// // //     }
// // //   ];
  
// // //   const getStatusColor = (status) => {
// // //     switch ((status || '').toLowerCase()) {
// // //       case 'pending':
// // //         return 'bg-yellow-100 text-yellow-800';
// // //       case 'in progress':
// // //         return 'bg-blue-100 text-blue-800';
// // //       case 'completed':
// // //         return 'bg-green-100 text-green-800';
// // //       default:
// // //         return 'bg-gray-100 text-gray-800';
// // //     }
// // //   };


// // //   return (
// // //     <div className="flex flex-col p-6">
// // //       {/* Welcome Banner */}
// // //       <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl shadow-md mb-8 text-white p-6">
// // //         <div className="flex justify-between items-center">
// // //           <div>
// // //             <h1 className="text-3xl font-bold flex items-center">
// // //                 <HomeIcon className="h-7 w-7 mr-2" /> Welcome, {techInfo.name.split(' ')[0]}
// // //             </h1>
// // //             <p className="mt-1 text-teal-100">{techInfo.role} • {techInfo.lab}</p>
// // //           </div>
// // //           <div className="text-right">
// // //             <p className="text-teal-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
// // //             <p className="mt-1 text-white font-medium">Have a productive day!</p>
// // //           </div>
// // //         </div>
// // //       </div>
      
// // //       {loading ? (
// // //         <div className="flex items-center justify-center h-40">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
// // //         </div>
// // //       ) : error ? (
// // //         <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 mb-6">
// // //           <p>{error}</p>
// // //         </div>
// // //       ) : (
// // //         <>
// // //           {/* Lab Cards */}
// // //           <div className="grid md:grid-cols-3 gap-6 mb-8">
// // //             {labCards.map((card) => (
// // //               <div
// // //                 key={card.id}
// // //                 onClick={() => handleCardClick(card.id)}
// // //                 className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 ${card.color} hover:shadow-xl`}
// // //               >
// // //                 <div className="flex justify-between items-start">
// // //                   <div>
// // //                     <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
// // //                     <p className={`text-5xl font-bold ${card.textColor}`}>{card.count}</p>
// // //                   </div>
// // //                   <div className="p-2">
// // //                     {card.icon}
// // //                   </div>
// // //                 </div>
// // //                 <div className="mt-6 flex items-center text-gray-700">
// // //                   <span className="text-sm">View details</span>
// // //                   <ArrowRightIcon className="ml-2 h-4 w-4" />
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
          
// // //           {/* Quick Actions and Recent Tests (2 columns) */}
// // //           <div className="grid md:grid-cols-2 gap-6 mb-8">
// // //             {/* Quick Actions */}
// // //             <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
// // //               <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
// // //               <div className="grid grid-cols-3 gap-4">
// // //                 {quickActions.map((action, index) => (
// // //                   <Link
// // //                     key={index}
// // //                     to={action.path}
// // //                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors"
// // //                   >
// // //                     <div className="p-3 rounded-full bg-gray-100 mb-2">
// // //                       {action.icon}
// // //                     </div>
// // //                     <h3 className="text-sm font-medium text-gray-900 text-center">{action.title}</h3>
// // //                     <p className="text-xs text-gray-500 text-center mt-1 hidden sm:block">{action.description}</p>
// // //                   </Link>
// // //                 ))}
// // //                 {/* Placeholder for future actions */}
// // //                 <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
// // //                     <div className="p-3 rounded-full bg-gray-100 mb-2">
// // //                       <CalendarDaysIcon className="h-6 w-6" />
// // //                     </div>
// // //                     <h3 className="text-sm font-medium text-center">Schedule Follow-up</h3>
// // //                 </div>
// // //               </div>
// // //             </div>
            
// // //             {/* Recent Tests (Pending/In Progress) */}
// // //             <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
// // //               <div className="flex justify-between items-center mb-6">
// // //                 <h2 className="text-xl font-semibold">Recent Tests (Active)</h2>
// // //                 <Link to="/labtech/lab-tests" className="text-sm text-teal-600 hover:text-teal-700">View All</Link>
// // //               </div>
// // //               <div className="space-y-4">
// // //                 {recentTests.length === 0 ? (
// // //                   <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No pending or in-progress tests.</div>
// // //                 ) : (
// // //                   recentTests.map(test => (
// // //                     <div key={test.id} className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
// // //                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
// // //                         <BeakerIcon className="h-6 w-6 text-teal-500" />
// // //                       </div>
// // //                       <div className="flex-grow">
// // //                         <div className="flex justify-between">
// // //                           <p className="text-sm font-medium text-gray-900">{test.testName}</p>
// // //                           <span className="text-xs text-gray-500">Req: {test.date || 'N/A'}</span>
// // //                         </div>
// // //                         <div className="flex justify-between items-center mt-1">
// // //                            <span className="text-xs text-gray-600">Patient: {test.patientName}</span>
// // //                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
// // //                              {test.status}
// // //                            </span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           {/* Recent Reports (Completed) */}
// // //           <div className="bg-white rounded-xl shadow p-6 mt-8 border border-gray-100">
// // //             <div className="flex justify-between items-center mb-6">
// // //               <h2 className="text-xl font-semibold">Recent Reports (Completed)</h2>
// // //               <Link to="/labtech/lab-reports" className="text-sm text-teal-600 hover:text-teal-700">View All</Link>
// // //             </div>
// // //             <div className="space-y-4">
// // //               {recentReports.length === 0 ? (
// // //                 <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">No recent reports generated.</div>
// // //               ) : (
// // //                 recentReports.map(report => (
// // //                   <div key={report.id} className="flex flex-col md:flex-row border-l-4 border-indigo-400 bg-indigo-50/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
// // //                     <div className="flex-shrink-0 flex flex-col items-center justify-center mr-4">
// // //                       <div className="bg-indigo-100 p-2 rounded-full mb-2">
// // //                         <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
// // //                       </div>
// // //                       <span className="text-xs text-gray-400 font-mono">#{report.id}</span>
// // //                     </div>
// // //                     <div className="flex-grow">
// // //                       <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2">
// // //                         <div>
// // //                           <span className="font-semibold text-gray-900 text-base">
// // //                             {report.testName} for {report.patientName}
// // //                           </span>
// // //                           <span className="ml-2 text-xs text-gray-400">Date: {report.dateCompleted || 'N/A'}</span>
// // //                         </div>
// // //                         <div className="mt-2 md:mt-0">
// // //                           <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
// // //                             Completed
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                       <div className="mt-2 text-sm text-gray-600">
// // //                         <p className="font-medium line-clamp-2">{report.resultSummary}</p>
// // //                         {report.reportUrl && (
// // //                           <a href={report.reportUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">Download Report</a>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>
// // //           </div>
          
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;
// // import React, { useEffect, useState } from "react";
// // import {
// //   ClipboardDocumentListIcon,
// //   ClockIcon,
// //   CheckCircleIcon,
// //   ArchiveBoxIcon,
// // } from "@heroicons/react/24/outline";
// // import { labtechService } from "../../services/api";
// // import { toast } from "react-toastify";

// // const Dashboard = () => {
// //   const [loading, setLoading] = useState(true);
// //   const [labTech, setLabTech] = useState(null);
// //   const [upcomingLabs, setUpcomingLabs] = useState([]);
// //   const [completedLabs, setCompletedLabs] = useState([]);
// //   const [pastLabs, setPastLabs] = useState([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         // Load user info
// //         const userStr = localStorage.getItem("user");
// //         if (!userStr) throw new Error("User not found. Please login again.");
// //         const user = JSON.parse(userStr);
// //         const labTechId = user.lbId || user.id || user.labTechId;
// //         if (!labTechId) throw new Error("Lab technician ID missing in user data.");

// //         // Fetch labtech details
// //         const labtechRes = await labtechService.getLabTechById(labTechId);
// //         setLabTech(labtechRes.data);

// //         // Fetch all appointment categories
// //         const [upcomingRes, completedRes, pastRes] = await Promise.all([
// //           labtechService.getAllUpcomingOrPendingAppointments(),
// //           labtechService.getAllCompletedAppointments(),
// //           labtechService.getAllPastAppointments(),
// //         ]);

// //         // Filter for this lab tech
// //         const filterByTech = (list) =>
// //           (list || []).filter(
// //             (item) =>
// //               item.labTechId === labTechId ||
// //               item.lbId === labTechId ||
// //               item.labtechId === labTechId
// //           );

// //         setUpcomingLabs(filterByTech(upcomingRes.data));
// //         setCompletedLabs(filterByTech(completedRes.data));
// //         setPastLabs(filterByTech(pastRes.data));
// //       } catch (err) {
// //         console.error("Error loading dashboard:", err);
// //         toast.error(err.message || "Failed to load dashboard data");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   if (loading)
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
// //       </div>
// //     );

// //   return (
// //     <div className="p-6">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <h1 className="text-3xl font-bold text-teal-700 flex items-center">
// //           <ClipboardDocumentListIcon className="h-8 w-8 mr-2 text-teal-600" />
// //           Lab Dashboard
// //         </h1>
// //         {labTech && (
// //           <div className="text-gray-500 text-sm">
// //             {labTech.lbName} • {labTech.emailId}
// //           </div>
// //         )}
// //       </div>

// //       {/* Stats */}
// //       <div className="grid md:grid-cols-3 gap-6 mb-10">
// //         <StatCard
// //           title="Upcoming Labs"
// //           count={upcomingLabs.length}
// //           icon={<ClockIcon className="h-8 w-8 text-yellow-500" />}
// //           color="bg-yellow-50 border-yellow-100"
// //           textColor="text-yellow-800"
// //         />
// //         <StatCard
// //           title="Completed Labs"
// //           count={completedLabs.length}
// //           icon={<CheckCircleIcon className="h-8 w-8 text-green-500" />}
// //           color="bg-green-50 border-green-100"
// //           textColor="text-green-800"
// //         />
// //         <StatCard
// //           title="Past Labs"
// //           count={pastLabs.length}
// //           icon={<ArchiveBoxIcon className="h-8 w-8 text-blue-500" />}
// //           color="bg-blue-50 border-blue-100"
// //           textColor="text-blue-800"
// //         />
// //       </div>

// //       {/* Sections */}
// //       <Section
// //         title="Upcoming Labs"
// //         color="text-yellow-600"
// //         icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
// //         items={upcomingLabs}
// //         empty="No upcoming labs found."
// //       />
// //       <Section
// //         title="Completed Labs"
// //         color="text-green-600"
// //         icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
// //         items={completedLabs}
// //         empty="No completed labs yet."
// //       />
// //       <Section
// //         title="Past Labs"
// //         color="text-blue-600"
// //         icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
// //         items={pastLabs}
// //         empty="No past labs found."
// //       />
// //     </div>
// //   );
// // };

// // // Small reusable components
// // const StatCard = ({ title, count, icon, color, textColor }) => (
// //   <div
// //     className={`rounded-xl border p-6 transition-all duration-200 ${color} hover:shadow-md`}
// //   >
// //     <div className="flex justify-between items-center">
// //       <div>
// //         <h3 className="text-lg font-semibold">{title}</h3>
// //         <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
// //       </div>
// //       {icon}
// //     </div>
// //   </div>
// // );

// // const Section = ({ title, icon, items, empty }) => (
// //   <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
// //     <div className="flex items-center mb-4">
// //       {icon}
// //       <h2 className="text-xl font-semibold ml-2">{title}</h2>
// //     </div>

// //     {items.length === 0 ? (
// //       <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">{empty}</div>
// //     ) : (
// //       <div className="space-y-3">
// //         {items.map((lab) => (
// //           <div
// //             key={lab.appointmentId}
// //             className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
// //           >
// //             <div className="flex justify-between items-center">
// //               <p className="font-medium text-gray-800">
// //                 Appointment #{lab.appointmentId}
// //               </p>
// //               <span className="text-sm text-gray-500">
// //                 {lab.appointmentDate
// //                   ? new Date(lab.appointmentDate).toLocaleDateString()
// //                   : "N/A"}
// //               </span>
// //             </div>
// //             <p className="text-sm text-gray-700 mt-1">
// //               Patient ID: {lab.patientId || "Unknown"} | Test ID:{" "}
// //               {lab.testId || "N/A"}
// //             </p>
// //             <p className="text-sm text-gray-600 mt-1">
// //               Status: {lab.status || "Pending"}
// //             </p>
// //           </div>
// //         ))}
// //       </div>
// //     )}
// //   </div>
// // );

// // export default Dashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ClipboardDocumentListIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   ArchiveBoxIcon,
// } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [labTech, setLabTech] = useState(null);
//   const [upcomingLabs, setUpcomingLabs] = useState([]);
//   const [completedLabs, setCompletedLabs] = useState([]);
//   const [pastLabs, setPastLabs] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const userStr = localStorage.getItem("user");
//         if (!userStr) throw new Error("User not found. Please login again.");
//         const user = JSON.parse(userStr);
//         const labTechId = user.lbId || user.id;

//         if (!labTechId)
//           throw new Error("Lab technician ID missing in user data.");

//         const labtechRes = await axios.get(
//           `http://localhost:8080/api/labtechs/${labTechId}`
//         );
//         setLabTech(labtechRes.data);

//         const appointRes = await axios.get(
//           `http://localhost:8080/api/labappointments/labtech/${labTechId}`
//         );

//         const allAppointments = appointRes.data || [];

//         // ✅ Filter appointments
//         const upcoming = allAppointments.filter(
//           (a) =>
//             a.status?.toLowerCase() === "pending" ||
//             a.status?.toLowerCase() === "upcoming"
//         );
//         const completed = allAppointments.filter(
//           (a) => a.status?.toLowerCase() === "completed"
//         );
//         const past = allAppointments.filter(
//           (a) =>
//             a.status?.toLowerCase() === "cancelled" ||
//             a.status?.toLowerCase() === "expired"
//         );

//         setUpcomingLabs(upcoming);
//         setCompletedLabs(completed);
//         setPastLabs(past);
//       } catch (err) {
//         console.error("❌ Failed to load dashboard data:", err);
//         toast.error("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-teal-700 flex items-center">
//           <ClipboardDocumentListIcon className="h-8 w-8 mr-2 text-teal-600" />
//           Lab Dashboard
//         </h1>
//         {labTech && (
//           <div className="text-gray-500 text-sm">
//             {labTech.lbName} • {labTech.emailId}
//           </div>
//         )}
//       </div>

//       <div className="grid md:grid-cols-3 gap-6 mb-10">
//         <StatCard
//           title="Upcoming Labs"
//           count={upcomingLabs.length}
//           icon={<ClockIcon className="h-8 w-8 text-yellow-500" />}
//           color="bg-yellow-50 border-yellow-100"
//           textColor="text-yellow-800"
//         />
//         <StatCard
//           title="Completed Labs"
//           count={completedLabs.length}
//           icon={<CheckCircleIcon className="h-8 w-8 text-green-500" />}
//           color="bg-green-50 border-green-100"
//           textColor="text-green-800"
//         />
//         <StatCard
//           title="Past Labs"
//           count={pastLabs.length}
//           icon={<ArchiveBoxIcon className="h-8 w-8 text-blue-500" />}
//           color="bg-blue-50 border-blue-100"
//           textColor="text-blue-800"
//         />
//       </div>

//       <Section
//         title="Upcoming Labs"
//         icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
//         items={upcomingLabs}
//         empty="No upcoming labs found."
//       />

//       <Section
//         title="Completed Labs"
//         icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
//         items={completedLabs}
//         empty="No completed labs yet."
//       />

//       <Section
//         title="Past Labs"
//         icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
//         items={pastLabs}
//         empty="No past labs found."
//       />
//     </div>
//   );
// };

// // --- Components ---
// const StatCard = ({ title, count, icon, color, textColor }) => (
//   <div
//     className={`rounded-xl border p-6 transition-all duration-200 ${color} hover:shadow-md`}
//   >
//     <div className="flex justify-between items-center">
//       <div>
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
//       </div>
//       {icon}
//     </div>
//   </div>
// );

// const Section = ({ title, icon, items, empty }) => (
//   <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
//     <div className="flex items-center mb-4">
//       {icon}
//       <h2 className="text-xl font-semibold ml-2">{title}</h2>
//     </div>

//     {items.length === 0 ? (
//       <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
//         {empty}
//       </div>
//     ) : (
//       <div className="space-y-3">
//         {items.map((lab) => (
//           <div
//             key={lab.appointmentId}
//             className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
//           >
//             <div className="flex justify-between items-center">
//               <p className="font-medium text-gray-800">
//                 Appointment #{lab.appointmentId}
//               </p>
//               <span className="text-sm text-gray-500">
//                 {lab.appointmentDate
//                   ? new Date(lab.appointmentDate).toLocaleDateString()
//                   : "N/A"}
//               </span>
//             </div>
//             <p className="text-sm text-gray-700 mt-1">
//               Patient ID: {lab.pId || "Unknown"} | Test ID:{" "}
//               {lab.testId || "N/A"}
//             </p>
//             <p className="text-sm text-gray-600 mt-1">
//               Status: {lab.status || "Pending"}
//             </p>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// export default Dashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ClipboardDocumentListIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   ArchiveBoxIcon,
// } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [labTech, setLabTech] = useState(null);
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const userStr = localStorage.getItem("user");
//       if (!userStr) throw new Error("User not found. Please login again.");

//       const user = JSON.parse(userStr);
//       const labTechId = user.lbId || user.id;

//       if (!labTechId)
//         throw new Error("Lab technician ID missing in user data.");

//       // Fetch lab tech details
//       const labtechRes = await axios.get(
//         `http://localhost:8080/api/labtechs/${labTechId}`
//       );
//       setLabTech(labtechRes.data);

//       // Fetch appointments for this lab tech
//       const appointRes = await axios.get(
//         `http://localhost:8080/api/labappointments/labtech/${labTechId}`
//       );
//       setAppointments(appointRes.data || []);
//     } catch (err) {
//       console.error("❌ Failed to load dashboard data:", err);
//       toast.error("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Update status safely (send full appointment object)
//   const updateLabStatus = async (appointment, newStatus) => {
//     try {
//       const updatedAppointment = {
//         ...appointment,
//         status: newStatus,
//         remarks:
//           newStatus === "Completed"
//             ? "Lab test completed successfully."
//             : "Appointment cancelled by technician.",
//       };

//       await axios.put(
//         `http://localhost:8080/api/labappointments/${appointment.appointmentId}`,
//         updatedAppointment
//       );

//       toast.success(`Appointment marked as ${newStatus}`);
//       fetchData(); // Refresh
//     } catch (err) {
//       console.error("❌ Failed to update lab status:", err);
//       toast.error("Failed to update status.");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
//       </div>
//     );

//   // Separate into categories
//   const upcomingLabs = appointments.filter(
//     (a) =>
//       a.status?.toLowerCase() === "pending" ||
//       a.status?.toLowerCase() === "upcoming"
//   );
//   const completedLabs = appointments.filter(
//     (a) => a.status?.toLowerCase() === "completed"
//   );
//   const pastLabs = appointments.filter(
//     (a) =>
//       a.status?.toLowerCase() === "cancelled" ||
//       a.status?.toLowerCase() === "expired"
//   );

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-teal-700 flex items-center">
//           <ClipboardDocumentListIcon className="h-8 w-8 mr-2 text-teal-600" />
//           Lab Dashboard
//         </h1>
//         {labTech && (
//           <div className="text-gray-500 text-sm">
//             {labTech.lbName} • {labTech.emailId}
//           </div>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid md:grid-cols-3 gap-6 mb-10">
//         <StatCard
//           title="Upcoming Labs"
//           count={upcomingLabs.length}
//           icon={<ClockIcon className="h-8 w-8 text-yellow-500" />}
//           color="bg-yellow-50 border-yellow-100"
//           textColor="text-yellow-800"
//         />
//         <StatCard
//           title="Completed Labs"
//           count={completedLabs.length}
//           icon={<CheckCircleIcon className="h-8 w-8 text-green-500" />}
//           color="bg-green-50 border-green-100"
//           textColor="text-green-800"
//         />
//         <StatCard
//           title="Past Labs"
//           count={pastLabs.length}
//           icon={<ArchiveBoxIcon className="h-8 w-8 text-blue-500" />}
//           color="bg-blue-50 border-blue-100"
//           textColor="text-blue-800"
//         />
//       </div>

//       {/* Sections */}
//       <Section
//         title="Upcoming Labs"
//         icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
//         items={upcomingLabs}
//         empty="No upcoming labs found."
//         onAction={updateLabStatus}
//       />

//       <Section
//         title="Completed Labs"
//         icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
//         items={completedLabs}
//         empty="No completed labs yet."
//       />

//       <Section
//         title="Past Labs"
//         icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
//         items={pastLabs}
//         empty="No past labs found."
//       />
//     </div>
//   );
// };

// // --- Components ---
// const StatCard = ({ title, count, icon, color, textColor }) => (
//   <div
//     className={`rounded-xl border p-6 transition-all duration-200 ${color} hover:shadow-md`}
//   >
//     <div className="flex justify-between items-center">
//       <div>
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
//       </div>
//       {icon}
//     </div>
//   </div>
// );

// const Section = ({ title, icon, items, empty, onAction }) => (
//   <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
//     <div className="flex items-center mb-4">
//       {icon}
//       <h2 className="text-xl font-semibold ml-2">{title}</h2>
//     </div>

//     {items.length === 0 ? (
//       <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
//         {empty}
//       </div>
//     ) : (
//       <div className="space-y-3">
//         {items.map((lab) => (
//           <div
//             key={lab.appointmentId}
//             className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
//           >
//             <div className="flex justify-between items-center">
//               <p className="font-medium text-gray-800">
//                 Appointment #{lab.appointmentId}
//               </p>
//               <span className="text-sm text-gray-500">
//                 {lab.appointmentDate
//                   ? new Date(lab.appointmentDate).toLocaleDateString()
//                   : "N/A"}
//               </span>
//             </div>
//             <p className="text-sm text-gray-700 mt-1">
//               Patient ID: {lab.pId || "N/A"} | Test ID: {lab.testId || "N/A"}
//             </p>
//             <p className="text-sm text-gray-600 mt-1 mb-3">
//               Status: {lab.status || "Pending"}
//             </p>

//             {onAction && (
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => onAction(lab, "Completed")}
//                   className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
//                 >
//                   Mark Complete
//                 </button>
//                 <button
//                   onClick={() => onAction(lab, "Cancelled")}
//                   className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [labTech, setLabTech] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User not found. Please login again.");

      const user = JSON.parse(userStr);
      const labTechId = user.lbId || user.id;

      if (!labTechId)
        throw new Error("Lab technician ID missing in user data.");

      // Fetch lab tech details
      const labtechRes = await axios.get(
        `http://localhost:8080/api/labtechs/${labTechId}`
      );
      setLabTech(labtechRes.data);

      // Fetch appointments
      const appointRes = await axios.get(
        `http://localhost:8080/api/labappointments/labtech/${labTechId}`
      );
      setAppointments(appointRes.data || []);
    } catch (err) {
      console.error("❌ Failed to load dashboard data:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const updateLabStatus = async (appointment, newStatus) => {
    try {
      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        remarks:
          newStatus === "Completed"
            ? "Lab test completed successfully."
            : "Appointment cancelled by technician.",
      };

      await axios.put(
        `http://localhost:8080/api/labappointments/${appointment.appointmentId}`,
        updatedAppointment
      );

      toast.success(`Appointment marked as ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("❌ Failed to update lab status:", err);
      toast.error("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-14 w-14 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );

  const upcomingLabs = appointments.filter(
    (a) =>
      a.status?.toLowerCase() === "pending" ||
      a.status?.toLowerCase() === "upcoming"
  );
  const completedLabs = appointments.filter(
    (a) => a.status?.toLowerCase() === "completed"
  );
  const pastLabs = appointments.filter(
    (a) =>
      a.status?.toLowerCase() === "cancelled" ||
      a.status?.toLowerCase() === "expired"
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-teal-700 flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-9 w-9 text-teal-600" />
            Lab Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all your lab test appointments efficiently
          </p>
        </div>

        {labTech && (
          <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 text-gray-700">
            <p className="font-semibold text-teal-700">{labTech.lbName}</p>
            <p className="text-sm">{labTech.emailId}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Upcoming Labs"
          count={upcomingLabs.length}
          icon={<ClockIcon className="h-9 w-9 text-yellow-500" />}
          color="from-yellow-400/10 to-yellow-200/10"
          borderColor="border-yellow-300/40"
        />
        <StatCard
          title="Completed Labs"
          count={completedLabs.length}
          icon={<CheckCircleIcon className="h-9 w-9 text-green-500" />}
          color="from-green-400/10 to-green-200/10"
          borderColor="border-green-300/40"
        />
        <StatCard
          title="Past Labs"
          count={pastLabs.length}
          icon={<ArchiveBoxIcon className="h-9 w-9 text-blue-500" />}
          color="from-blue-400/10 to-blue-200/10"
          borderColor="border-blue-300/40"
        />
      </div>

      {/* Sections */}
      <Section
        title="Upcoming Labs"
        icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
        items={upcomingLabs}
        empty="No upcoming labs found."
        onAction={updateLabStatus}
      />

      <Section
        title="Completed Labs"
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
        items={completedLabs}
        empty="No completed labs yet."
      />

      <Section
        title="Past Labs"
        icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
        items={pastLabs}
        empty="No past labs found."
      />
    </div>
  );
};

// --- Components ---
const StatCard = ({ title, count, icon, color, borderColor }) => (
  <div
    className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${color} p-6 shadow-sm hover:shadow-md transition-all duration-200`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-5xl font-bold text-gray-800 mt-1">{count}</p>
      </div>
      <div className="bg-white/70 p-3 rounded-xl shadow-inner">{icon}</div>
    </div>
  </div>
);

const Section = ({ title, icon, items, empty, onAction }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-10">
    <div className="flex items-center mb-4 border-b border-gray-100 pb-2">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-gray-800">{title}</h2>
    </div>

    {items.length === 0 ? (
      <div className="p-5 text-center text-gray-500 bg-gray-50 rounded-xl italic">
        {empty}
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((lab) => (
          <div
            key={lab.appointmentId}
            className="p-5 border border-gray-100 rounded-xl hover:bg-teal-50/40 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-800">
                Appointment #{lab.appointmentId}
              </p>
              <span className="text-sm text-gray-500">
                {lab.appointmentDate
                  ? new Date(lab.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold text-gray-800">Patient ID:</span>{" "}
              {lab.pId || "N/A"}{" "}
              <span className="ml-3 font-semibold text-gray-800">Test ID:</span>{" "}
              {lab.testId || "N/A"}
            </p>

            <p className="text-sm text-gray-600 mt-2 mb-4">
              Status:{" "}
              <span
                className={`font-medium ${
                  lab.status?.toLowerCase() === "completed"
                    ? "text-green-600"
                    : lab.status?.toLowerCase() === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {lab.status || "Pending"}
              </span>
            </p>

            {onAction && (
              <div className="flex gap-3">
                <button
                  onClick={() => onAction(lab, "Completed")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm shadow-sm transition-all"
                >
                  ✅ Mark Complete
                </button>
                <button
                  onClick={() => onAction(lab, "Cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm shadow-sm transition-all"
                >
                  ✖ Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;

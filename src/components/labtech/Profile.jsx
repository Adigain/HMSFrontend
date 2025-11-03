
// import { useState, useEffect } from 'react';
// import { 
//   UserCircleIcon, 
//   PencilIcon,
//   CheckIcon,
//   XMarkIcon,
//   BuildingOfficeIcon,
//   BeakerIcon,
//   PhoneIcon,
//   EnvelopeIcon,
//   BriefcaseIcon
// } from '@heroicons/react/24/outline';
// import { labtechService } from '../../services/api';
// import { toast } from 'react-toastify';

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     id: 1,
//     name: "",
//     lab: "",
//     email: "",
//     phone: "",
//     employeeId: "",
//     age: "",
//     gender: "",
//     address: "",
//     certifications: [],
//     profileImage: "https://images.unsplash.com/photo-1594824476967-4a6f9c9b1f2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
//     status: "Active",
//     department: "",
//     password: ""
//   });
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedProfile, setEditedProfile] = useState({});
//   const [previewImage, setPreviewImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Fetch profile on mount
//   useEffect(() => {
//     const fetchLabtechProfile = async () => {
//       setIsLoading(true);
//       try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         const labtechId = user?.id;
        
//         if (!labtechId) {
//           throw new Error('Lab Technician ID not found. Please log in again.');
//         }
        
//         // Mock data fallback or direct API call (using placeholder)
//         const mockData = {
//           id: labtechId,
//           name: user.name || 'Jane Doe',
//           lab: 'Central Diagnostics Lab',
//           email: user.email || 'jane.doe@labtech.com',
//           phone: '9876543210',
//           employeeId: 'LT' + labtechId,
//           age: 32,
//           gender: 'Female',
//           address: 'Lab Block, MediLink Hospital, Varanasi',
//           certifications: ['Clinical Pathology', 'Molecular Diagnostics'],
//           profileImage: "https://images.unsplash.com/photo-1594824476967-4a6f9c9b1f2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
//           status: 'Active',
//           department: 'Pathology',
//           password: 'mockpassword'
//         };
        
//         // Simulating API call response
//         // const response = await labtechService.getLabtechById(labtechId);
//         // const labtechData = response.data;

//         const labtechData = mockData;
        
//         const formattedProfile = {
//           id: labtechData.id,
//           name: labtechData.name,
//           lab: labtechData.lab,
//           email: labtechData.email,
//           phone: labtechData.phone,
//           employeeId: labtechData.employeeId,
//           age: labtechData.age,
//           gender: labtechData.gender,
//           address: labtechData.address,
//           certifications: labtechData.certifications,
//           profileImage: labtechData.profileImage,
//           status: labtechData.status,
//           department: labtechData.department,
//           password: labtechData.password
//         };
        
//         setProfile(formattedProfile);
//         setEditedProfile({...formattedProfile});
        
//       } catch (err) {
//         console.error('Error fetching labtech profile:', err);
//         toast.error('Failed to load Lab Technician profile. Showing mock data.');
//       }
//       setIsLoading(false);
//     };
    
//     fetchLabtechProfile();
//   }, []);
  
//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProfile({
//       ...editedProfile,
//       [name]: value
//     });
//   };
  
//   // Save profile changes
//   const handleSave = async () => {
//     try {
//       const loadingToastId = toast.loading('Saving profile changes...');
      
//       const labtechId = profile.id;
      
//       const updatedProfileData = {
//         ...editedProfile,
//         id: labtechId,
//         password: profile.password // Preserve password
//       };
      
//       // Simulate API call: await labtechService.updateLabtech(labtechId, updatedProfileData);
      
//       // Simulate network delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Update local state
//       const updatedProfile = {...editedProfile};
//       if (previewImage) {
//         updatedProfile.profileImage = previewImage;
//       }
//       setProfile(updatedProfile);
//       setIsEditing(false);
//       setPreviewImage(null);
      
//       toast.update(loadingToastId, { 
//         render: 'Profile updated successfully! (Mock Save)', 
//         type: 'success', 
//         isLoading: false,
//         autoClose: 3000
//       });
//     } catch (err) {
//       console.error('Error updating labtech profile:', err);
//       toast.error('Failed to update profile. Please try again.');
//     }
//   };
  
//   // Cancel editing
//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedProfile({...profile});
//     setPreviewImage(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">Lab Technician Profile</h1>
//           {!isEditing ? (
//             <button 
//               onClick={() => setIsEditing(true)}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
//             >
//               <PencilIcon className="h-4 w-4 mr-2" />
//               Edit Profile
//             </button>
//           ) : (
//             <div className="flex space-x-3">
//               <button 
//                 onClick={handleCancel}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
//               >
//                 <XMarkIcon className="h-4 w-4 mr-2" />
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSave}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
//               >
//                 <CheckIcon className="h-4 w-4 mr-2" />
//                 Save Changes
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Profile Content */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        
//         {/* Profile Header */}
//         <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 h-32 md:h-48">
//           <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
//         </div>
        
//         <div className="relative px-6 pb-6">
          
//           {/* Profile Picture and Quick Info */}
//           <div className="flex flex-col md:flex-row">
//             {/* Profile Image */}
//             <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-0 flex justify-center md:block">
//               <div className="relative h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-white shadow-md">
//                 <img 
//                   src={previewImage || profile.profileImage} 
//                   alt="Profile" 
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             </div>
            
//             {/* Basic Info */}
//             <div className="md:ml-8 md:mt-4">
//               <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
//               <p className="text-lg text-teal-600 font-medium">
//                 {profile.department} Lab Technician
//               </p>
              
//               <div className="mt-4 flex flex-wrap gap-2">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//                   Employee ID: {profile.employeeId}
//                 </span>
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                   Status: {profile.status}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {isEditing ? (
//             // Edit mode Form
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//                <div className="group">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input type="text" id="name" name="name" value={editedProfile.name} onChange={handleChange} className="form-input" placeholder="Enter full name" />
//               </div>
//               <div className="group">
//                 <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                 <input type="text" id="department" name="department" value={editedProfile.department} onChange={handleChange} className="form-input" placeholder="e.g., Pathology" />
//               </div>
              
//               <div className="col-span-2">
//                 <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-teal-100 pb-2 mt-2">Contact Information</h3>
//               </div>
              
//               <div className="group">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                 <input type="email" id="email" name="email" value={editedProfile.email} onChange={handleChange} className="form-input" placeholder="your.email@example.com" />
//               </div>
//               <div className="group">
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                 <input type="tel" id="phone" name="phone" value={editedProfile.phone} onChange={handleChange} className="form-input" placeholder="+1 (123) 456-7890" />
//               </div>

//               <div className="col-span-2">
//                 <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-teal-100 pb-2 mt-2">Personal Details</h3>
//               </div>
              
//               <div className="group">
//                 <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
//                 <input type="number" id="age" name="age" value={editedProfile.age} onChange={handleChange} className="form-input" placeholder="Enter your age" />
//               </div>
//               <div className="group">
//                 <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                 <select id="gender" name="gender" value={editedProfile.gender} onChange={handleChange} className="form-input appearance-none">
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
              
//               <div className="col-span-2">
//                 <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <textarea id="address" name="address" rows={3} value={editedProfile.address} onChange={handleChange} className="form-input" placeholder="Enter your address"></textarea>
//               </div>
//             </div>
//           ) : (
//             // View mode
//             <div className="mt-8">
//               {/* Contact Info */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><PhoneIcon className="h-5 w-5 mr-2 text-gray-500" /> Contact & Location</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <p className="flex items-center text-gray-600"><EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" /> {profile.email}</p>
//                   <p className="flex items-center text-gray-600"><PhoneIcon className="h-5 w-5 text-gray-400 mr-3" /> {profile.phone}</p>
//                   <p className="flex items-start col-span-2 text-gray-600"><BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" /> {profile.address}</p>
//                   <p className="flex items-center col-span-2 text-gray-600"><BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" /> {profile.lab} - {profile.department}</p>
//                 </div>
//               </div>
              
//               {/* Personal Details */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" /> Personal Details</h3>
//                 <div className="grid grid-cols-2 gap-4 text-gray-600">
//                   <p><span className="font-medium">Employee ID:</span> {profile.employeeId}</p>
//                   <p><span className="font-medium">Age:</span> {profile.age}</p>
//                   <p><span className="font-medium">Gender:</span> {profile.gender}</p>
//                   <p><span className="font-medium">Department:</span> {profile.department}</p>
//                 </div>
//               </div>

//               {/* Certifications */}
//               {profile.certifications && profile.certifications.length > 0 && (
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><CheckIcon className="h-5 w-5 mr-2 text-gray-500" /> Certifications</h3>
//                   <ul className="space-y-2">
//                     {profile.certifications.map((certification, index) => (
//                       <li key={index} className="flex items-center text-gray-600">
//                         <CheckIcon className="h-4 w-4 text-teal-500 mr-2" />
//                         {certification}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Inline styles for utility classes (borrowed from doctor/Profile.jsx) */}
//       <style jsx global>{`
//         .form-input {
//           @apply block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from 'react';
import { labtechService } from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [labTech, setLabTech] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabTech = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          toast.error('No user data found. Please log in again.');
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser.lbId || parsedUser.id || parsedUser.labTechId;

        if (!id) {
          toast.error('Lab Technician ID not found in user data.');
          setLoading(false);
          return;
        }

        const response = await labtechService.getLabTechById(id);
        setLabTech(response.data);
      } catch (error) {
        console.error('Error fetching lab tech details:', error);
        toast.error('Failed to fetch profile details from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabTech();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!labTech) {
    return (
      <div className="text-center mt-8 text-red-600 font-medium">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Profile
      </h2>

      <div className="space-y-4">
        <ProfileRow label="Lab ID" value={labTech.lbId} />
        <ProfileRow label="Full Name" value={labTech.lbName} />
        <ProfileRow label="Mobile Number" value={labTech.mobileNo} />
        <ProfileRow label="Email ID" value={labTech.emailId} />
        <ProfileRow label="Gender" value={labTech.gender} />
        <ProfileRow label="Age" value={labTech.age} />
        <ProfileRow label="Experience" value={`${labTech.experience} years`} />
        <ProfileRow
          label="Password"
          value={labTech.password ? '********' : 'Not set'}
        />
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default Profile;

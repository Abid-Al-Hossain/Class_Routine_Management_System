// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../components/Navbar";
// import { Footer } from "../components/Footer";
// import { ChatBox } from "../components/ChatBox";
// import { LoginModal } from "../components/LoginModal";
// import { useAuthStore } from "../store/authStore";
// import { useRoutineStore } from "../store/routineStore";
// import { useNotificationStore } from "../store/notificationStore";
// import { RoutineViewer } from "../components/RoutineViewer";
// import { Trash } from "lucide-react";
// import axios from "axios";

// export const TeacherDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, login, logout } = useAuthStore();
//   const { addRequest, fetchRequests, deleteRequest, requests } = useRoutineStore();
//   const { notifications, fetchNotifications, deleteNotification } = useNotificationStore();
//   const [request, setRequest] = useState("");
//   const [routine, setRoutine] = useState({});

//   // Pagination state for notifications
//   const itemsPerPage = 6;
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(notifications.length / itemsPerPage);
//   const paginatedNotifications = notifications.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Fetch routine, schedule change requests, and notifications
//   useEffect(() => {
//     const fetchRoutine = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/routine");
//         setRoutine(response.data);
//       } catch (error) {
//         console.error("Failed to fetch routine:", error);
//       }
//     };
//     fetchRoutine();
//     fetchRequests();
//     fetchNotifications();
//   }, [fetchRequests, fetchNotifications]);

//   const handleLogout = () => {
//     logout("teacher");
//     navigate("/");
//   };

//   // Submit schedule change request and refresh list
//   const handleSubmitRequest = async () => {
//     if (request.trim()) {
//       await addRequest("Teacher Name", request); // Replace with dynamic teacher name if available
//       setRequest("");
//       fetchRequests();
//     }
//   };

//   // Delete a schedule change request
//   const handleDeleteRequest = async (id: string) => {
//     await deleteRequest(id);
//     fetchRequests();
//   };

//   // Delete a notification
//   const handleDeleteNotification = async (id: string) => {
//     await deleteNotification(id);
//     fetchNotifications();
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   if (!isAuthenticated.teacher) {
//     return (
//       <LoginModal
//         role="Teacher"
//         onLogin={(password) => {
//           const success = login("teacher", password);
//           if (!success) {
//             // Handle login failure if needed
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar title="Teacher Dashboard" showLogout onLogout={handleLogout} />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 gap-6">
//           {/* Class Routine Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Class Routine</h2>
//             <RoutineViewer routine={routine} />
//           </div>

//           {/* Request Schedule Change Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Request Schedule Change</h2>
//             <textarea
//               value={request}
//               onChange={(e) => setRequest(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//               rows={4}
//               placeholder="Enter your request..."
//             />
//             <button
//               onClick={handleSubmitRequest}
//               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//             >
//               Submit Request
//             </button>
//           </div>

//           {/* Teacher's Schedule Change Requests Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Your Schedule Change Requests</h2>
//             <div className="space-y-4">
//               {requests
//                 .filter((req) => req.teacherName === "Teacher Name")
//                 .map((req) => (
//                   <div
//                     key={req.id}
//                     className="border p-4 rounded flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="font-bold">{req.teacherName}</p>
//                       <p>{req.content}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(req.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                     <button onClick={() => handleDeleteRequest(req.id)}>
//                       <Trash size={18} className="text-red-500 hover:text-red-700" />
//                     </button>
//                   </div>
//                 ))}
//             </div>
//           </div>

//           {/* Notifications Section with Pagination */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Notifications</h2>
//             <div className="space-y-4">
//               {paginatedNotifications.map((notif) => (
//                 <div
//                   key={notif.id}
//                   className="border p-4 rounded flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-bold">{notif.sender}</p>
//                     <p>{notif.content}</p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(notif.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                   {notif.sender === "Teacher" && (
//                     <button onClick={() => handleDeleteNotification(notif.id)}>
//                       <Trash size={18} className="text-red-500 hover:text-red-700" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//             {totalPages > 1 && (
//               <div className="flex justify-center space-x-2 mt-4">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-3 py-1 border rounded ${
//                       page === currentPage
//                         ? "bg-indigo-600 text-white"
//                         : "bg-white text-indigo-600 hover:bg-indigo-100"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <ChatBox username="Teacher" />
//       <Footer />
//     </div>
//   );
// };








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { LoginModal } from "../components/LoginModal";
import { useAuthStore } from "../store/authStore";
import { useRoutineStore } from "../store/routineStore";
import { useNotificationStore } from "../store/notificationStore";
import { RoutineViewer } from "../components/RoutineViewer";
import { Trash } from "lucide-react";
import axios from "axios";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuthStore();
  const { addRequest, fetchRequests, deleteRequest, requests } = useRoutineStore();
  const { notifications, fetchNotifications, deleteNotification } = useNotificationStore();
  const [request, setRequest] = useState("");
  const [routine, setRoutine] = useState({});

  // Pagination for notifications
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination for schedule change requests
  const requestsPerPage = 6;
  const [requestPage, setRequestPage] = useState(1);
  const totalRequestPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  // Fetch routine, schedule change requests, and notifications
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routine");
        setRoutine(response.data);
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      }
    };
    fetchRoutine();
    fetchRequests();
    fetchNotifications();
  }, [fetchRequests, fetchNotifications]);

  const handleLogout = () => {
    logout("teacher");
    navigate("/");
  };

  // Submit schedule change request and refresh list
  const handleSubmitRequest = async () => {
    if (request.trim()) {
      await addRequest("Teacher Name", request); // Replace with the logged-in teacher's name
      setRequest("");
      fetchRequests();
    }
  };

  // Delete a schedule change request (always available)
  const handleDeleteRequest = async (id: string) => {
    await deleteRequest(id);
    fetchRequests();
  };

  // Delete a notification
  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRequestPageChange = (page: number) => {
    setRequestPage(page);
  };

  if (!isAuthenticated.teacher) {
    return (
      <LoginModal
        role="Teacher"
        onLogin={(password) => {
          const success = login("teacher", password);
          if (!success) {
            // Handle login failure if needed
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Teacher Dashboard" showLogout onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Class Routine Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Class Routine</h2>
            <RoutineViewer routine={routine} />
          </div>

          {/* Request Schedule Change Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Request Schedule Change</h2>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
              placeholder="Enter your request..."
            />
            <button
              onClick={handleSubmitRequest}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>

          {/* Teacher's Schedule Change Requests Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Your Schedule Change Requests</h2>
            <div className="space-y-4">
              {paginatedRequests
                .filter((req) => req.teacherName === "Teacher Name") // Replace with actual teacher name
                .map((req, index) => (
                  <div
                    key={req.id || index}
                    className={`border p-4 rounded flex justify-between items-center ${
                      req.acceptStatus === "accepted"
                        ? "bg-green-100"
                        : req.acceptStatus === "rejected"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="font-bold">{req.teacherName}</p>
                      <p>{req.content}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(req.timestamp).toLocaleString()}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          req.acceptStatus === "accepted"
                            ? "text-green-700"
                            : req.acceptStatus === "rejected"
                            ? "text-red-700"
                            : "text-gray-700"
                        }`}
                      >
                        Status: {req.acceptStatus}
                      </p>
                    </div>
                    {/* Delete button is always visible */}
                    <button onClick={() => handleDeleteRequest(req.id)}>
                      <Trash size={18} className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                ))}
            </div>
            {totalRequestPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalRequestPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handleRequestPageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      page === requestPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Section with Pagination */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
              {paginatedNotifications.map((notif, index) => (
                <div
                  key={notif.id || index}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{notif.sender}</p>
                    <p>{notif.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {notif.sender === "Teacher" && (
                    <button onClick={() => handleDeleteNotification(notif.id)}>
                      <Trash size={18} className="text-red-500 hover:text-red-700" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatBox username="Teacher" />
      <Footer />
    </div>
  );
};





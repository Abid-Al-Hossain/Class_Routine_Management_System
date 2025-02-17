// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../components/Navbar";
// import { Footer } from "../components/Footer";
// import { ChatBox } from "../components/ChatBox";
// import { LoginModal } from "../components/LoginModal";
// import { useAuthStore } from "../store/authStore";
// import { useNotificationStore } from "../store/notificationStore"; // ✅ Correct Import
// import { RoutineViewer } from "../components/RoutineViewer";
// import axios from "axios";

// export const RepresentativeDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, login, logout } = useAuthStore();
//   const { notifications, fetchNotifications, addNotification } = useNotificationStore(); // ✅ Add `addNotification`
//   const [announcement, setAnnouncement] = useState("");
//   const [routine, setRoutine] = useState({});

//   // ✅ Fetch routine & notifications from backend on page load
//   useEffect(() => {
//     fetchNotifications();
//   }, []);

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
//   }, []);

//   const handleLogout = () => {
//     logout("representative");
//     navigate("/");
//   };

//   // ✅ Fix: Ensure `addNotification` is being called from store
//   const handleCreateAnnouncement = async () => {
//     if (announcement.trim()) {
//       await addNotification(announcement, "Class Representative"); // ✅ Correct call
//       setAnnouncement("");
//       fetchNotifications(); // ✅ Refresh announcements immediately
//     }
//   };

//   // Redirect to login if not authenticated
//   if (!isAuthenticated.representative) {
//     return (
//       <LoginModal
//         role="Class Representative"
//         onLogin={(password) => {
//           const success = login("representative", password);
//           if (!success) {
//             // Handle login failure
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar title="Class Representative Dashboard" showLogout onLogout={handleLogout} />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="space-y-8">
//           {/* Class Routine Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Class Routine</h2>
//             <RoutineViewer routine={routine} />
//           </div>

//           {/* Create Announcement Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
//             <textarea
//               value={announcement}
//               onChange={(e) => setAnnouncement(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//               rows={4}
//               placeholder="Enter announcement message..."
//             />
//             <button onClick={handleCreateAnnouncement} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//               Create Announcement
//             </button>
//           </div>

//           {/* Announcements Section */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Announcements</h2>
//             <div className="space-y-4">
//               {/* {notifications.map((notification) => (
//                 <div key={notification.id} className="border p-4 rounded">
//                   <p className="font-bold">{notification.sender}</p>
//                   <p>{notification.content}</p>
//                   <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
//                 </div>
//               ))} */}
//               {notifications.map((notification, index) => (
//   <div key={notification.id || `notif-${index}`} className="border p-4 rounded">
//     <p className="font-bold">{notification.sender}</p>
//     <p>{notification.content}</p>
//     <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
//   </div>
// ))}

//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Chat Box and Footer */}
//       <ChatBox username="Class Representative" />
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
import { useNotificationStore } from "../store/notificationStore";
import { RoutineViewer } from "../components/RoutineViewer";
import axios from "axios";
import { Trash } from "lucide-react";

export const RepresentativeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuthStore();
  const { notifications, fetchNotifications, addNotification, deleteNotification } = useNotificationStore();
  const [announcement, setAnnouncement] = useState("");
  const [routine, setRoutine] = useState({});
  
  // Pagination state for notifications
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchNotifications();
    const fetchRoutine = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routine");
        setRoutine(response.data);
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      }
    };
    fetchRoutine();
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout("representative");
    navigate("/");
  };

  const handleCreateAnnouncement = async () => {
    if (announcement.trim()) {
      await addNotification(announcement, "Class Representative");
      setAnnouncement("");
      fetchNotifications();
    }
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated.representative) {
    return (
      <LoginModal
        role="Class Representative"
        onLogin={(password) => {
          const success = login("representative", password);
          if (!success) {
            // Handle login failure
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Class Representative Dashboard" showLogout onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Routine Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Class Routine</h2>
          <RoutineViewer routine={routine} />
        </div>
        {/* Create Announcement Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={4}
            placeholder="Enter announcement message..."
          />
          <button
            onClick={handleCreateAnnouncement}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Announcement
          </button>
        </div>
        {/* Announcements Section with Pagination */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Announcements</h2>
          <div className="space-y-4">
            {paginatedNotifications.map((notif) => (
              <div
                key={notif.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{notif.sender}</p>
                  <p>{notif.content}</p>
                  <p className="text-sm text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
                {notif.sender === "Class Representative" && (
                  <button onClick={() => handleDeleteNotification(notif.id)}>
                    <Trash size={18} className="text-red-500 hover:text-red-700" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
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
      </main>
      <ChatBox username="Class Representative" />
      <Footer />
    </div>
  );
};


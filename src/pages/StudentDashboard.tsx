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

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuthStore();
  const { notifications, fetchNotifications, deleteNotification } =
    useNotificationStore();
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
    const fetchRoutine = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routine");
        setRoutine(response.data);
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      }
    };
    fetchRoutine();
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout("student");
    navigate("/");
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated.student) {
    return (
      <LoginModal
        role="Student"
        onLogin={(password) => {
          const success = login("student", password);
          if (!success) {
            // Handle login failure if needed
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Student Dashboard" showLogout onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Class Routine Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Class Routine</h2>
          <RoutineViewer routine={routine} />
        </div>
        {/* Notifications Section with Pagination */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            {paginatedNotifications.map((notif) => (
              <div
                key={notif.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{notif.sender}</p>
                  <p>{notif.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
                {notif.sender === "Student" && (
                  <button onClick={() => handleDeleteNotification(notif.id)}>
                    <Trash
                      size={18}
                      className="text-red-500 hover:text-red-700"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
            </div>
          )}
        </div>
      </main>
      <ChatBox username="Student" />
      <Footer />
    </div>
  );
};

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { LoginModal } from "../components/LoginModal";
import { useAuthStore } from "../store/authStore";
import { useRoutineStore } from "../store/routineStore";
import { useNotificationStore } from "../store/notificationStore";
import { RoutineCreator } from "../components/RoutineCreator";
import { RoutineViewer } from "../components/RoutineViewer";
import axios from "axios";
import { Trash, Check, X } from "lucide-react";

export const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuthStore();
  const { requests, fetchRequests, acceptRequest, rejectRequest } = useRoutineStore();
  const { addNotification, fetchNotifications, notifications, deleteNotification } = useNotificationStore();

  // Pagination state for schedule change requests
  const requestsPerPage = 6;
  const [requestPage, setRequestPage] = useState(1);
  const totalRequestPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  // Pagination state for notifications
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Other state
  const [notification, setNotification] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showRoutineCreator, setShowRoutineCreator] = useState(false);
  const [routine, setRoutine] = useState<{ [key: string]: any }>({});
  const [selectedDay, setSelectedDay] = useState("Sunday");

  const handleRequestPageChange = (page: number) => {
    setRequestPage(page);
  };

  // Fetch routine & notifications on page load
  const fetchRoutine = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/routine");
      setRoutine(response.data);
    } catch (error) {
      console.error("Failed to fetch routine:", error);
    }
  }, []);

  useEffect(() => {
    fetchRoutine();
    fetchNotifications();
    fetchRequests();
  }, [fetchRoutine, fetchNotifications, fetchRequests]);

  const handleLogout = () => {
    logout("coordinator");
    navigate("/");
  };

  // Save routine and update state
  const handleCreateRoutine = async (day: string, routineData: any) => {
    try {
      const response = await axios.post("http://localhost:5000/api/routine", {
        day,
        routineData,
      });
      if (response.status === 200) {
        setRoutine((prev) => ({ ...prev, [day]: routineData }));
        alert("Routine saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save routine:", error);
      alert("Failed to save routine. Please try again.");
    }
  };

  // Clear the full routine and update UI immediately
  const clearRoutine = async () => {
    try {
      await axios.delete("http://localhost:5000/api/routine");
      setRoutine({});
      alert("Routine cleared successfully!");
    } catch (error) {
      console.error("Failed to clear routine:", error);
      alert("Failed to clear routine");
    }
  };

  const handleSendNotification = () => {
    if (notification.trim()) {
      addNotification(notification, "Coordinator");
      setNotification("");
    }
  };

  // Delete notification (for coordinator)
  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  // Handle page change for notifications
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated.coordinator) {
    return (
      <LoginModal
        role="Coordinator"
        onLogin={(password) => {
          const success = login("coordinator", password);
          if (!success) {
            // Handle login failure
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Coordinator Dashboard" showLogout onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Manage Schedule Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Schedule</h2>
              <div className="flex space-x-2">
                <button
                  onClick={clearRoutine}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Clear Routine
                </button>
                <button
                  onClick={() => setShowRoutineCreator(!showRoutineCreator)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {showRoutineCreator ? "View Routine" : "Create Routine"}
                </button>
              </div>
            </div>
            {showRoutineCreator ? (
              <RoutineCreator
                onSave={handleCreateRoutine}
                selectedDay={selectedDay}
                onDayChange={(day) => setSelectedDay(day)}
              />
            ) : (
              <RoutineViewer routine={routine} key={JSON.stringify(routine)} />
            )}
          </div>

          {/* Schedule Change Requests Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Change Requests</h2>
            <div className="space-y-4">
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border p-4 rounded flex justify-between items-center ${
                    request.acceptStatus === "accepted"
                      ? "bg-green-100"
                      : request.acceptStatus === "rejected"
                      ? "bg-red-100"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold">{request.teacherName}</p>
                    <p>{request.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {request.acceptStatus === "pending" && (
                      <>
                        <button
                          onClick={() => acceptRequest(request.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => rejectRequest(request.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
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

          {/* Send Notification Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Send Notification</h2>
            <textarea
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
              placeholder="Enter notification message..."
            />
            <button
              onClick={handleSendNotification}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Send Notification
            </button>
          </div>

          {/* Notifications Section */}
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
                    <p className="text-sm text-gray-500">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {notif.sender === "Coordinator" && (
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
      <ChatBox username="Coordinator" />
      <Footer />
    </div>
  );
};

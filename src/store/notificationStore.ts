import { create } from "zustand";
import axios from "axios";

interface Notification {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  addNotification: (content: string, sender: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  fetchNotifications: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notifications"
      );
      set({
        notifications: response.data.map((notif: any) => ({
          ...notif,
          id: notif.id || notif._id,
        })),
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
  addNotification: async (content, sender) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/notifications",
        { sender, content }
      );
      set((state) => ({
        notifications: [response.data, ...state.notifications],
      }));
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  },
  deleteNotification: async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },
}));

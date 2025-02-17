import { create } from "zustand";
import axios from "axios";

interface Message {
  _id: string;
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  addMessage: (sender: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string, sender: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  fetchMessages: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat");
      set({
        messages: response.data.map((msg: { id: any; _id: any }) => ({
          ...msg,
          id: msg.id || msg._id,
        })),
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ messages: [] });
    }
  },

  addMessage: async (sender, content) => {
    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        sender,
        content,
      });
      set((state) => ({
        messages: [
          ...state.messages,
          { ...response.data, id: response.data.id || response.data._id },
        ],
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  deleteMessage: async (messageId, sender) => {
    try {
      if (!messageId) {
        console.error("❌ Error: Message ID is undefined. Cannot delete.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/chat/${messageId}`
      );

      if (response.status === 200) {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        }));
      } else {
        console.error(
          "Failed to delete message: Unexpected response",
          response
        );
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  },
}));

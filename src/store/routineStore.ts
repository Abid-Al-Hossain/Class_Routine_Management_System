// import { create } from "zustand";
// import axios from "axios";

// interface ScheduleChangeRequest {
//   id: string;
//   teacherName: string;
//   content: string;
//   timestamp: Date;
// }

// interface RoutineState {
//   requests: ScheduleChangeRequest[];
//   fetchRequests: () => Promise<void>;
//   addRequest: (teacherName: string, content: string) => Promise<void>;
//   deleteRequest: (id: string) => Promise<void>;
// }

// export const useRoutineStore = create<RoutineState>((set) => ({
//   requests: [],
//   fetchRequests: async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/requests");
//       set({ requests: response.data });
//     } catch (error) {
//       console.error("Failed to fetch schedule change requests:", error);
//     }
//   },
//   addRequest: async (teacherName, content) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/requests", { teacherName, content });
//       set((state) => ({
//         requests: [response.data, ...state.requests],
//       }));
//     } catch (error) {
//       console.error("Failed to submit request:", error);
//     }
//   },
//   deleteRequest: async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/requests/${id}`);
//       set((state) => ({
//         requests: state.requests.filter((req) => req.id !== id),
//       }));
//     } catch (error) {
//       console.error("Failed to delete request:", error);
//     }
//   },
// }));









import { create } from "zustand";
import axios from "axios";

interface ScheduleChangeRequest {
  coordinatorName: string;
  id: string;
  teacherName: string;
  content: string;
  timestamp: Date;
  acceptStatus: "pending" | "accepted" | "rejected";
}

interface RoutineState {
  requests: ScheduleChangeRequest[];
  fetchRequests: () => Promise<void>;
  addRequest: (teacherName: string, content: string) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  acceptRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  requests: [],
  fetchRequests: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      const requests = response.data.map((req: { _id: any; id: any; }) => ({
        ...req,
        id: req._id || req.id,  // Ensure 'id' exists (MongoDB uses '_id')
      }));
      set({ requests });
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    };
  },
  addRequest: async (teacherName, content) => {
    try {
      const response = await axios.post("http://localhost:5000/api/requests", { teacherName, content });
      set((state) => ({ requests: [...state.requests, response.data] }));
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  },
  deleteRequest: async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`);
      set((state) => ({ requests: state.requests.filter((req) => req.id !== id) }));
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  },
  acceptRequest: async (id) => {
    if (!id) {
      console.error("Error: Trying to accept a request without a valid ID!");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/accept`);
      set((state) => ({
        requests: state.requests.map(req =>
          req.id === id ? { ...req, acceptStatus: "accepted" } : req
        ),
      }));
    } catch (error) {
      console.error("Failed to accept request:", error);
    };
  
  },
  rejectRequest: async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/reject`);
      set((state) => ({
        requests: state.requests.map((req) => (req.id === id ? { ...req, acceptStatus: "rejected" } : req)),
      }));
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  },
}));

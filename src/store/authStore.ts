import { create } from "zustand";

interface AuthState {
  isAuthenticated: {
    coordinator: boolean;
    teacher: boolean;
    student: boolean;
    representative: boolean;
  };
  login: (
    role: keyof AuthState["isAuthenticated"],
    password: string
  ) => boolean;
  logout: (role: keyof AuthState["isAuthenticated"]) => void;
}

const passwords = {
  coordinator: "1234",
  teacher: "2345",
  student: "4567",
  representative: "5678",
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: {
    coordinator: false,
    teacher: false,
    student: false,
    representative: false,
  },
  login: (role, password) => {
    if (password === passwords[role]) {
      set((state) => ({
        isAuthenticated: {
          ...state.isAuthenticated,
          [role]: true,
        },
      }));
      return true;
    }
    return false;
  },
  logout: (role) =>
    set((state) => ({
      isAuthenticated: {
        ...state.isAuthenticated,
        [role]: false,
      },
    })),
}));

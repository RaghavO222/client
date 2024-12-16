import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user-info")),
    setUser: (user) => set({ user })
}))

export default useAuthStore;
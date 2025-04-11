import { create } from "zustand";
import { IUser } from "./interfaces";

interface AppState {
    user: IUser | null
    setUser: (user: IUser | null) => void
}

const useAppStore = create<AppState>()((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user }))
}))

export default useAppStore;
import { create } from "zustand";
import { ICustomer, IEmployee } from "./interfaces";

interface AppState {
    employee: IEmployee | null
    customer: ICustomer | null
    setEmployee: (user: IEmployee | null) => void
    setCustomer: (customer: ICustomer | null) => void
}

const useAppStore = create<AppState>()((set) => ({
    employee: null,
    customer: null,

    setEmployee: (employee) => set(() => ({ employee })),
    setCustomer: (customer) => set(() => ({ customer }))
}))

export default useAppStore;
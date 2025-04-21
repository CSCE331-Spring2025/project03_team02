// src/components/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router";

import Navbar from "./Navbar";
import NavMenu from "./NavMenu";
import CustomerLoyaltyMenu from "./CustomerLoyaltyMenu";

import useAppStore from "../utils/useAppStore";

const Layout: React.FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const currentPage = path.includes("inventory") ? "inventory" :
        path.includes("reports") ? "reports" : path.includes('employees') ? 'employees' : path.includes('kitchen') ? 'kitchen' : path.includes('customer') ? 'customer' : "menu";

    const customer = useAppStore(state => state.customer);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Navbar />

            {/* Main content */}
            <main className="flex flex-1 gap-4">
                <div className="w-1/12 min-w-[100px]">
                    {currentPage === 'customer' ? customer ? <CustomerLoyaltyMenu customer={customer} /> : <></> : <NavMenu currentPage={currentPage as "menu" | "inventory" | "reports" | "employees"} />}
                </div>
                <div className="w-11/12 px-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
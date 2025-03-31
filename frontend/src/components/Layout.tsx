// src/components/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const Layout: React.FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const currentPage = path.includes("inventory") ? "inventory" : 
                        path.includes("trends") ? "trends" : "menu";

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Navbar />

            {/* Main content */}
            <main className="flex flex-1 gap-4">
                <div className="w-1/12 min-w-[100px]">
                    <SideMenu currentPage={currentPage as "menu" | "inventory" | "trends"} />
                </div>
                <div className="w-11/12 px-4">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            {/* <footer className="bg-gray-100 text-center p-4">
                <p className="text-sm text-gray-500">© 2025 Sharetea. All rights reserved.</p>
            </footer> */}
        </div>
    );
};

export default Layout;

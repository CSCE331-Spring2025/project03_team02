// src/components/Layout.tsx
import { Outlet } from "react-router";

import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Navbar />

            {/* Main content */}
            <main className="flex flex-1 gap-4">
                <div className="w-1/12 min-w-[100px]">
                    <SideMenu currentPage="menu" />
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

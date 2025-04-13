import React from "react";

import { Link, useLocation } from "react-router";
import { RiDrinksLine } from "react-icons/ri";
import { LuWarehouse } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { BsPeople } from "react-icons/bs";
import { TbToolsKitchen2 } from "react-icons/tb";

interface SideMenuProps {
    currentPage: "menu" | "inventory" | "reports" | "employees" | "kitchen"
}
const SideMenu: React.FC<SideMenuProps> = ({ currentPage }) => {
    const location = useLocation();
    const path = location.pathname;
    const activePage = currentPage || (
        path.includes("inventory") ? "inventory" :
            path.includes("reports") ? "reports" :
                path.includes("employees") ? "employees" :
                    path.includes("kitchen") ? "kitchen" : "menu"
    );

    return (
        <div className="p-4 space-y-20">
            <Link to="/" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'menu' ? "text-gray-400 " : ""}`}>
                <RiDrinksLine className="text-2xl" />
                <p>Menu</p>
            </Link>
            <Link to="/kitchen" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'kitchen' ? "text-gray-400 " : ""}`}>
                <TbToolsKitchen2 className="text-2xl" />
                <p>Kitchen</p>
            </Link>
            <Link to="/inventory" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'inventory' ? "text-gray-400" : ""}`}>
                <LuWarehouse className="text-2xl" />
                <p >Inventory</p>
            </Link>
            <Link to="/reports" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'reports' ? "text-gray-400" : ""}`}>
                <TbBrandGoogleAnalytics className="text-2xl" />
                <p>Reports</p>
            </Link>
            <Link to="/employees" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== "employees" ? " text-gray-400" : ""}`}>
                <BsPeople className="text-2xl" />
                <p>Employees</p>
            </Link>
        </div>
    )
}

export default SideMenu;
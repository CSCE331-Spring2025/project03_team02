import React from "react";

import { Link, useLocation } from "react-router";
import { RiDrinksLine } from "react-icons/ri";
import { LuWarehouse } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

interface SideMenuProps {
    currentPage: "menu" | "inventory" | "trends"
}
const SideMenu: React.FC<SideMenuProps> = ({ currentPage }) => {
    const location = useLocation();
    const path = location.pathname;
    const activePage = currentPage || 
        (path.includes("inventory") ? "inventory" : 
         path.includes("trends") ? "trends" : "menu");


    return (
        <div className="p-4 space-y-20">
            <Link to="/" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'menu' ? "text-gray-400 " : ""}`}>
                <RiDrinksLine className="text-2xl" />
                <p>Menu</p>
                </Link>
            <Link to="/inventory" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'inventory' ? "text-gray-400" : ""}`}>
                <LuWarehouse className="text-2xl" />
                <p >Inventory</p>
                </Link>
            <Link to="/trends" className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${activePage !== 'trends' ? " text-gray-400" : ""}`}>
                <TbBrandGoogleAnalytics className="text-2xl" />
                <p>Trends</p>
                </Link>
        </div>
    )
}

export default SideMenu;
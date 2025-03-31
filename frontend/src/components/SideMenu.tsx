import React from "react";

import { RiDrinksLine } from "react-icons/ri";
import { LuWarehouse } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

interface SideMenuProps {
    currentPage: "menu" | "inventory" | "trends" | "reports"
}

const SideMenu: React.FC<SideMenuProps> = ({ currentPage }) => {
    return (
        <div className="p-4 space-y-20">
            <button className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'menu' ? "text-gray-400 " : ""}`}>
                <RiDrinksLine className="text-2xl" />
                <p>Menu</p>
            </button>
            <button className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'inventory' ? "text-gray-400" : ""}`}>
                <LuWarehouse className="text-2xl" />
                <p >Inventory</p>
            </button>
            <button className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'trends' ? " text-gray-400" : ""}`}>
                <TbBrandGoogleAnalytics className="text-2xl" />
                <p>Trends</p>
            </button>
            <button 
                onClick={() => window.location.href = '/reports'}
                className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'reports' ? "text-gray-400" : ""}`}
            >
                <TbBrandGoogleAnalytics className="text-2xl" />
                <p>Reports</p>
            </button>
        </div>
    )
}

export default SideMenu;
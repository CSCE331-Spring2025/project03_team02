import React, { useEffect, useState } from "react";

import { RiDrinksLine } from "react-icons/ri";
import { LuWarehouse } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";

const SideMenu: React.FC = () => {
    const [currentPage] = useState("menu");

    return (
        <div className="p-4 space-y-16">
            <button
                className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'menu' ? "text-gray-400 " : ""}`}
            >
                <RiDrinksLine className="text-2xl" />
                <p>Menu</p>
            </button>
            <button
                className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'employees' ? "text-gray-400" : ""}`}
            >
                <FaUsers className="text-2xl" />
                <p>Employees</p>
            </button>
            <button className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'inventory' ? "text-gray-400" : ""}`}>
                <LuWarehouse className="text-2xl" />
                <p>Inventory</p>
            </button>
            <button className={`flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer ${currentPage !== 'trends' ? " text-gray-400" : ""}`}>
                <TbBrandGoogleAnalytics className="text-2xl" />
                <p>Trends</p>
            </button>
        </div>
    )
}

export default SideMenu;
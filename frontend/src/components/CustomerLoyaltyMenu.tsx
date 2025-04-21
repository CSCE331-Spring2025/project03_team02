import React from "react";

import { IoPersonCircleOutline } from "react-icons/io5";
import { IoGiftOutline } from "react-icons/io5";

import { ICustomer } from "../utils/interfaces";

interface CustomerLoyaltyMenuProps {
    customer: ICustomer
}
const CustomerLoyaltyMenu: React.FC<CustomerLoyaltyMenuProps> = ({ customer }) => {
    return (
        <div className="pt-4 pl-4 space-y-10">
            <div className="flex flex-col items-center w-full p-2">
                <div>
                    { customer.picture ? <img src={customer.picture} className="rounded-full w-12 h-12 object-cover" /> : <IoPersonCircleOutline className="text-6xl" /> }
                </div>
                <p className="text-center text-sm">{customer.name}</p>
            </div>

            {/* @ts-expect-error shows the popup when reward button is clicked */}
            <button onClick={()=>document.getElementById('reward-modal').showModal()} className="flex flex-col items-center w-full p-2 hover:bg-gray-100 cursor-pointer">
                <div>
                    <IoGiftOutline className="text-5xl" />
                </div>
                <p className="text-center text-sm">{customer.points} Points</p>
            </button>
        </div>
    );
};

export default CustomerLoyaltyMenu;
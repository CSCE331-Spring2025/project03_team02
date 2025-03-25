import React from "react";

import ShareteaLogo from "../assets/shartea_logo.png"
import USA_Flag from "../assets/usa_flag.png";

const Navbar: React.FC = () => {
    return (
        <div className="w-full flex justify-between items-center px-8 py-4">
            <img src={ShareteaLogo} alt="Sharetea logo" />

            <span className="flex gap-x-2 items-center">
                <img src={USA_Flag} className="h-4" alt="Flag of The United States of America" />
                <p>English</p>
            </span>
        </div>
    )
}

export default Navbar;
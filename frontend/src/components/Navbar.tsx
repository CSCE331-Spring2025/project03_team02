import React from "react";

import ShareteaLogo from "../assets/shartea_logo.png"
import LanguageTranslation from "./LanguageTranslation";

const Navbar: React.FC = () => {
    return (
        <div className="w-full flex justify-between items-center px-8 py-4">
            <img src={ShareteaLogo} alt="Sharetea logo" />

            <span className="flex gap-x-2 items-center">
                <LanguageTranslation />
            </span>
        </div>
    )
}

export default Navbar;
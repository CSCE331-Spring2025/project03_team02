import React, {useEffect} from "react";

import ShareteaLogo from "../assets/shartea_logo.png"
import USA_Flag from "../assets/usa_flag.png";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const Navbar: React.FC = () => {
    useEffect(() => {
        // Define the callback Google expects
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement( {pageLanguage: 'en', 
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,}, 
                'google_translate_element');
        };
        
        // Load the script only once
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="w-full flex justify-between items-center px-8 py-4">
            <img src={ShareteaLogo} alt="Sharetea logo" />

            <span className="flex gap-x-2 items-center">
                <img src={USA_Flag} className="h-4" alt="Flag of The United States of America" />
                <div id="google_translate_element" />
            </span>
        </div>
    )
}

export default Navbar;
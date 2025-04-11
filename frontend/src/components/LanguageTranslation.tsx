import React, { useEffect, useState } from "react";
import { translationFlags } from "../utils/transaltionFlags";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const LanguageTranslation: React.FC = () => {
    const [lang, setLang] = useState("en");

    useEffect(() => {
        if (document.getElementById("google_translate_element")?.children.length) {
            return; // avoid duplicate translation frames
        }

        // use of free google translate api
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
                },
                "google_translate_element"
            );
        };

        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const getLangFromCookie = () => {
            const value = document.cookie
                .split("; ")
                .find((row) => row.startsWith("googtrans"));
            return value?.split("/")[2] || "en";
        };

        const observer = new MutationObserver(() => {
            const selectedLang = getLangFromCookie();
            setLang(selectedLang);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const initialLang = getLangFromCookie();
        setLang(initialLang);

        return () => observer.disconnect();
    }, []);

    // using flagpedia.net API to display lanugage flag. See utils/translationFlags.ts for supported flags
    const countryCode = translationFlags[lang] || "us";
    const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;

    return (
        <div className="flex flex-row items-start gap-x-5">
            <img src={flagUrl} alt={`Flag for ${lang}`} className="h-5.5 w-auto mt-1.5"/>
            <div id="google_translate_element" />
        </div>
    );
};

export default LanguageTranslation;


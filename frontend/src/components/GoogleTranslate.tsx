import { useEffect } from 'react';

declare global {
    interface Window {
        google: any; 
        googleTranslateElementInit: () => void;
    }
}

const GoogleTranslate = () => {
    useEffect(() => {
    // Define the callback function globally

    if (document.getElementById('google_translate_element')) return;

    window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: 'en',
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            },
            'google_translate_element'
        );
    };

    // Load the Google Translate script
    const script = document.createElement('script');
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;

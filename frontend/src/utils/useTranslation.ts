import { useState } from "react";

export const useTranslation = () => {
	const [translations, setTranslations] = useState<Record<string, string>>({});

	const getStorageKey = (lang: string, text: string) => {
		return `translation_${lang}_${text}`;
	};

	const translateTexts = async (texts: string[], targetLang: string) => {
		// dont waste api call on english (translation not needed)
		if (targetLang === "EN") {
			const englishTranslations: Record<string, string> = {};
			texts.forEach((text) => {
				englishTranslations[text] = text; 
			});
			setTranslations(prev => ({
				...prev,
				...englishTranslations,
			}));

			return; 
		}

		const translationsToSet: Record<string, string> = {};
		const textsToTranslate: string[] = [];

		texts.forEach((text) => {
			// cache translation to limit api calls (intended for testing)
			const cached = localStorage.getItem(getStorageKey(targetLang, text));
			if (cached) {
				translationsToSet[text] = cached;
			} else {
				textsToTranslate.push(text);
			}
		});

		if (textsToTranslate.length === 0) {
			setTranslations(prev => ({
				...prev,
				...translationsToSet,
			}));
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/translate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ texts: textsToTranslate, target_lang: targetLang }),
			});

			const data = await res.json();
			if (data.translations) {
				textsToTranslate.forEach((text, idx) => {
					const translated = data.translations[idx];
					translationsToSet[text] = translated;
					localStorage.setItem(getStorageKey(targetLang, text), translated);
				});

				setTranslations(prev => ({
					...prev,
					...translationsToSet,
				}));
			}
		} catch (err) {
			console.error("Translation error", err);
		}
	};

	const t = (text: string) => {
	return translations[text] || text;
	};

	return { t, translateTexts };
};

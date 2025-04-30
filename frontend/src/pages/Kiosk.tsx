import React, { useState, useEffect } from "react";
import axios from "axios";

import { IIngredient, IProduct } from "../utils/interfaces";
import CustomizationModal from "../components/CustomizationModal";

import useAppStore from "../utils/useAppStore";
import { useTranslation } from "../utils/useTranslation";
import { translationFlags } from "../utils/transaltionFlags";



const MenuPage: React.FC = () => {

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => setVoices(synth.getVoices());
    synth.addEventListener("voiceschanged", updateVoices);
    updateVoices();
    return () => synth.removeEventListener("voiceschanged", updateVoices);
  }, []);

  const customer = useAppStore(state => state.customer);
  const setCustomer = useAppStore(state => state.setCustomer);

  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [totals, setTotals] = useState([0, 0, 0, 0]) // subtotal, tax, total, discount


const langMap: Record<string,string> = {
  EN: "en-US",
  ES: "es-ES",
  FR: "fr-FR",
  DE: "de-DE",
  JA: "ja-JP",
  ZH: "zh-CN",
  KO: "ko-KR",
  AR: "ar-SA",
  HI: "hi-IN",
  RU: "ru-RU",
  PT: "pt-PT",
  IT: "it-IT",
  NL: "nl-NL",
  DEFAULT: "en-US"
};

const getVoiceForLang = (langCode: string) => {
  const target = langMap[langCode] || langMap.DEFAULT;
  let v = voices.find(v => v.lang === target);
  if (v) return v;
  // fallback to English
  v = voices.find(v => v.lang === langMap.EN);
  return v || voices[0];
};

// Function to speak text using the Web Speech API
// Uses Browser's speech synthesis to read out the text
const speak = (text: string, langCode: string = "EN") => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langMap[langCode] || langMap.DEFAULT;
  u.voice = getVoiceForLang(langCode);
  u.rate = 1;
  window.speechSynthesis.speak(u);
};

  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);

  const [showFullMenu, setShowFullMenu] = useState(false);

  const [cart, setCart] = useState<IProduct[]>([]);

  const { t, translateTexts } = useTranslation();
  const [lang, setLang] = useState("EN");

  const staticTexts = [
    "Popular Drinks",
    "Full Menu",
    "Close",
    "Subtotal",
    "Tax 8.25%",
    "Discount",
    "Total",
    "Order #",
    "Cancel Order",
    "Submit Order",
    "Hello! You have",
    "points.",
    "Would you like to apply a",
    "discount?",
    "Apply Discount",
    "Cancel",
    "Order submitted successfully",
  ];

  useEffect(() => {
    getProducts();
    getIngredients();
  }, []);

  useEffect(() => {
    translateTexts(staticTexts, lang);
  }, [lang]);

  useEffect(() => {
    if (products.length > 0) {
      const names = products.map((p) => p.name);
      translateTexts(names, lang);
    }
  }, [lang, products]);

  const getProducts = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getproducts`)).data;

    setProducts(res.data);
  }

  function getImagePath(imageName: string | null): string {
    if (!imageName) return '';
    return `/images/${imageName}.png`;
  }

  const getIngredients = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getingredients`)).data;

    setIngredients(res.data);
  }

  const addProductToCart = (product: IProduct) => {
    const newCart = [...cart, product];

    setCart(newCart);
    updateTotals(newCart);
  }

  const updateTotals = (cart: IProduct[]) => {
    let newSubtotal = 0;

    for (const product of cart) {
      newSubtotal += product.price;
    }

    const taxTotal = newSubtotal * 0.0825
    const newTotal = newSubtotal + taxTotal;

    setTotals([newSubtotal, taxTotal, newTotal])
  }


  const submitOrder = async () => {
    if (!cart.length) return;

    setLoading(true);

    const products = cart.map(elm => elm.id);

    const ingredients = []
    for (const elm of cart) {
      ingredients.push(...elm.ingredients.map(ing => ing.id));
    }

    const employee_id = "e1b4b9a1-8c59-4d92-bd5f-3f7d8f05e123"

    const total = totals[2] - (totals[3] ?? 0)

    await axios.post(`${import.meta.env.VITE_API_URL}/submitorder`, { 'products': products, 'ingredients': ingredients, 'employee_id': employee_id, 'total': total, 'discount': totals[3] ?? 0, 'customer': customer?.id });

    setLoading(false)
    resetOrder()
    alert(t("Order submitted successfully"))

    if (ttsEnabled) {
      speak("Order submitted successfully", lang);
    }

    if (customer && totals[3]) {
      if(totals[3] * 0.1 <= total) {
        setCustomer({ ...customer, points: 0 });  
      } else {
        setCustomer({ ...customer, points: customer.points - Math.floor(totals[3]) * 10 });
      }
    } else {
      if (customer) {
        setCustomer({ ...customer, points: customer.points + Math.ceil(total) });
      }
    }
  }

  const resetOrder = () => {
    const newCart: IProduct[] = [];

    setCart(newCart);
    updateTotals(newCart)
  }

  const applyDiscount = () => {
    if (!customer || !cart.length) return;

    let discount = customer.points / 10;
    if (discount > totals[2]) {
      discount = totals[2];
    }

    const newTotals = [totals[0], totals[1], totals[2], discount];
    setTotals(newTotals);
  }

  useEffect(() => {
    if (products.length > 0) {
      // @ts-expect-error Expect error from accessing DOM directly
      document.getElementById('customization-modal').showModal()
    }
  }, [selectedProduct])

  return (
    <div className="w-full h-full">
    {/* Language Selector with Flag */}
    <div className="flex justify-end items-center gap-x-4 p-4">
      <img
        src={`https://flagcdn.com/w320/${translationFlags[lang.toLowerCase()] || "us"}.png`}
        alt={`Flag for ${lang}`}
        className="h-6 w-auto"
      />
      <label htmlFor="language-select" className="mr-2 font-semibold">Language:</label>
      <select
        id="language-select"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        onMouseEnter={() => ttsEnabled && speak("Select Language", lang)}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="AM" onMouseEnter={() => ttsEnabled && speak("Amharic", lang)}>
          Amharic
        </option>
        <option value="AR" onMouseEnter={() => ttsEnabled && speak("Arabic", lang)}>
          Arabic
        </option>
        <option value="BN" onMouseEnter={() => ttsEnabled && speak("Bengali", lang)}>
          Bengali
        </option>
        <option value="CA" onMouseEnter={() => ttsEnabled && speak("Cantonese", lang)}>
          Cantonese (Hong Kong)
        </option>
        <option value="DE" onMouseEnter={() => ttsEnabled && speak("German", lang)}>
          German
        </option>
        <option value="DU" onMouseEnter={() => ttsEnabled && speak("Dutch", lang)}>
          Dutch
        </option>
        <option value="EN" onMouseEnter={() => ttsEnabled && speak("English", lang)}>
          English
        </option>
        <option value="FA" onMouseEnter={() => ttsEnabled && speak("Farsi", lang)}>
          Farsi (Persian)
        </option>
        <option value="FR" onMouseEnter={() => ttsEnabled && speak("French", lang)}>
          French
        </option>
        <option value="GR" onMouseEnter={() => ttsEnabled && speak("Greek", lang)}>
          Greek
        </option>
        <option value="GU" onMouseEnter={() => ttsEnabled && speak("Gujarati", lang)}>
          Gujarati
        </option>
        <option value="HA" onMouseEnter={() => ttsEnabled && speak("Hausa", lang)}>
          Hausa
        </option>
        <option value="HE" onMouseEnter={() => ttsEnabled && speak("Hebrew", lang)}>
          Hebrew
        </option>
        <option value="HI" onMouseEnter={() => ttsEnabled && speak("Hindi", lang)}>
          Hindi
        </option>
        <option value="IT" onMouseEnter={() => ttsEnabled && speak("Italian", lang)}>
          Italian
        </option>
        <option value="JA" onMouseEnter={() => ttsEnabled && speak("Japanese", lang)}>
          Japanese
        </option>
        <option value="KO" onMouseEnter={() => ttsEnabled && speak("Korean", lang)}>
          Korean
        </option>
        <option value="NL" onMouseEnter={() => ttsEnabled && speak("Dutch", lang)}>
          Dutch
        </option>
        <option value="PA" onMouseEnter={() => ttsEnabled && speak("Punjabi", lang)}>
          Punjabi
        </option>
        <option value="PL" onMouseEnter={() => ttsEnabled && speak("Polish", lang)}>
          Polish
        </option>
        <option value="PT" onMouseEnter={() => ttsEnabled && speak("Portuguese", lang)}>
          Portuguese
        </option>
        <option value="RO" onMouseEnter={() => ttsEnabled && speak("Romanian", lang)}>
          Romanian
        </option>
        <option value="RU" onMouseEnter={() => ttsEnabled && speak("Russian", lang)}>
          Russian
        </option>
        <option value="ES" onMouseEnter={() => ttsEnabled && speak("Spanish", lang)}>
          Spanish
        </option>
        <option value="SV" onMouseEnter={() => ttsEnabled && speak("Swedish", lang)}>
          Swedish
        </option>
        <option value="TA" onMouseEnter={() => ttsEnabled && speak("Tamil", lang)}>
          Tamil
        </option>
        <option value="TH" onMouseEnter={() => ttsEnabled && speak("Thai", lang)}>
          Thai
        </option>
        <option value="TL" onMouseEnter={() => ttsEnabled && speak("Tagalog", lang)}>
          Tagalog
        </option>
        <option value="TR" onMouseEnter={() => ttsEnabled && speak("Turkish", lang)}>
          Turkish
        </option>
        <option value="UK" onMouseEnter={() => ttsEnabled && speak("Ukrainian", lang)}>
          Ukrainian
        </option>
        <option value="UR" onMouseEnter={() => ttsEnabled && speak("Urdu", lang)}>
          Urdu
        </option>
        <option value="VI" onMouseEnter={() => ttsEnabled && speak("Vietnamese", lang)}>
          Vietnamese
        </option>
      </select>

    </div>

      {products.length > 0 && selectedProduct && (
        <CustomizationModal
          product={selectedProduct} // Pass the first product or use a selected one
          ingredients={ingredients}
          onSubmit={addProductToCart}
          ttsEnabled={ttsEnabled}
          customer={customer}
          lang={lang}
        />
      )}

      <dialog id="reward-modal" className="modal">
        <form method="dialog" className="modal-box max-w-sm">
          <h3 className="text-2xl font-bold mb-4">Sharetea Rewards</h3>

          <p className="text-gray-700 mb-2">
            {t("Hello! You have")}{" "}
            <span className="font-semibold">{customer?.points ?? 0}</span>{" "}
            {t("points.")}
          </p>

          <p className="text-gray-700 mb-6">
            {t("Would you like to apply a")}{" "}
            <span className="font-semibold">${((customer?.points ?? 0) / 10).toFixed(2)}</span>{" "}
            {t("discount?")}
          </p>

          <div className="modal-action justify-end">
            <button className="btn btn-outline">{t("Cancel")}</button>
            <button className="btn btn-primary" onClick={() => applyDiscount()}>
              {t("Apply Discount")}
            </button>
          </div>
        </form>

        {/* clicking outside or pressing ESC will also close */}
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close"></button>
        </form>
      </dialog>

      <div className="flex gap-8 h-full">
        <div className="w-2/3 flex flex-wrap gap-6 border-r-2 border-gray-100">
          <div className="flex justify-between items-center mb-4 px-2">
            {products.length !== 0 && (
              <>
                <h2
  className="text-2xl font-bold"
  onMouseEnter={() => ttsEnabled && speak(t("Popular Drinks"), lang)}
>
  {t("Popular Drinks")}
</h2>
<button
  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 ml-8"
  onClick={() => setShowFullMenu(true)}
  onMouseEnter={() => ttsEnabled && speak(t("Full Menu"), lang)}
>
  {t("Full Menu")}
</button>
              </>
            )}
          </div>
          <button
  className={`px-4 py-2 rounded-md font-semibold ${
    ttsEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
  }`}
  onClick={() => setTtsEnabled(prev => !prev)}
  onMouseEnter={() =>
    ttsEnabled
      ? speak("Disable Text to Speech Mode", lang)
      : speak("Enable Text to Speech Mode", lang)
  }
>
  {ttsEnabled ? 'Disable TTS Mode' : 'Enable TTS Mode'}
</button>

          <div className="flex flex-wrap gap-6">
            {!products.length && (
              <span className="loading loading-spinner loading-xl mx-auto"></span>
            )}
            {products.map((product, index) => (
              <button
                key={index}
                className='bg-gray-100 p-4 rounded-xl w-[180px] h-[180px] flex flex-col justify-between shadow-sm hover:bg-gray-200 cursor-pointer'
                onClick={() => setSelectedProduct(product)}
                onMouseEnter={() => ttsEnabled && speak(`${t(product.name)}, $${product.price.toFixed(2)}`, lang)}
              >
                {product.image_url && (
                  <img 
                    src={getImagePath(product.image_url)} 
                    alt={product.name}
                    className="w-full h-[100px] object-cover rounded-lg mb-2"
                  />
                )}
                <p className='text-base font-bold truncate'>{t(product.name)}</p>
                <p className='text-sm text-gray-700'>${Number(product.price).toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Full Menu Modal */}
        {showFullMenu && (
          <dialog open className="modal">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">{t("Full Menu")}</h3>

              <div className="grid grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-xl"
                  onMouseEnter={() => ttsEnabled && speak(`${t(product.name)}, $${product.price.toFixed(2)}`, lang)}
                >
                  {product.image_url && (
                    <img 
                      src={getImagePath(product.image_url)} 
                      alt={product.name}
                      className="w-full h-[120px] object-cover rounded-lg mb-2"
                    />
                  )}
                  
                  <p className="font-bold text-lg">{t(product.name)}</p>
                  <p className="text-gray-700">${Number(product.price).toFixed(2)}</p>
                </div>
              ))}
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setShowFullMenu(false)}>
                  {t("Close")}
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={() => setShowFullMenu(false)}>
              <button>close</button>
            </form>
          </dialog>
        )}

        {/* Right: Order Total (1/3) */}
        <div className="w-1/3 p-4 space-y-12">
          <div className="text-3xl font-semibold flex justify-between">
            <p>{t("Order #")}</p>
            <p>123456</p>
          </div>

          <div className="space-y-4">
            {cart.map((elm, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-xl flex justify-between"
              onMouseEnter={() => ttsEnabled && speak(elm.name, lang)}
              >
                <div>
                  <p className="text-xl font-bold">{t(elm.name)}</p>
                  <p className="px-2">${elm.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-4 border border-gray-100">
            <div className="flex justify-between">
              <p
                onMouseEnter={() => ttsEnabled && speak(`Subtotal: $${totals[0].toFixed(2)}`, lang)}
              >{t("Subtotal")}</p>

              <p>${totals[0].toFixed(2)}</p>
            </div>

            <div className="flex justify-between">
              <p
              onMouseEnter={() => ttsEnabled && speak(`Tax: $${totals[1].toFixed(2)}`, lang)}
              >{t("Tax 8.25%")}</p>

              <p>${totals[1].toFixed(2)}</p>
            </div>

            {totals[3] !== undefined && (
              <div className="flex justify-between">
                <p>{t("Discount")}</p>

                <p>${totals[3].toFixed(2)}</p>
              </div>
            )}
  
            <div className="flex justify-between text-2xl font-bold"
              onMouseEnter={() => ttsEnabled && speak(`Total: $${totals[2].toFixed(2)}`, lang)}
            >
              <p>{t("Total")}</p>

              <p>${(totals[2] - (totals[3] ?? 0)).toFixed(2)}</p>
            </div>

            <div className="flex gap-x-8 my-8">
              <button
                className="bg-red-500 text-white p-3 rounded-2xl w-full hover:bg-red-600 cursor-pointer"
                onClick={resetOrder}
                onMouseEnter={() => ttsEnabled && speak("Cancel Order", lang)}
              >
                {t("Cancel Order")}
              </button>

              <button
                className="bg-green-500 text-white p-3 rounded-2xl w-full hover:bg-green-600 cursor-pointer"
                onClick={submitOrder}
                onMouseEnter={() => ttsEnabled && speak("Submit Order", lang)}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <span>{t("Submit Order")}</span>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenuPage;

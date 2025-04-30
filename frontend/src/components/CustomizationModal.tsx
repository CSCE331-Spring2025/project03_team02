import React, { useEffect, useState } from "react";
import { ICustomer, IIngredient, IProduct } from "../utils/interfaces";
import { FaRegTrashAlt } from "react-icons/fa";

import axios from "axios";
import { useTranslation } from "../utils/useTranslation";

const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }
};

interface Props {
    product: IProduct
    onSubmit: (product: IProduct) => void
    ingredients: IIngredient[]
    ttsEnabled?: boolean
    customer?: ICustomer | null
    lang?: string
}

const CustomizationModal: React.FC<Props> = ({ product, onSubmit, ingredients, ttsEnabled, customer, lang = "EN" }) => {
    const { t, translateTexts } = useTranslation();

    const sizes = [
        { label: "small", price: 0 },
        { label: "medium", price: 1.5 },
        { label: "large", price: 2.0 }
    ];

    const [productReviews, setProductReviews] = useState(product.reviews);
    const [selectedSize, setSelectedSize] = useState("small");
    const [selectedToppings, setSelectedToppings] = useState<IIngredient[]>([]);
    const [reviewText, setReviewText] = useState('');

    const toggleTopping = (topping: IIngredient) => {
        setSelectedToppings(prev =>
            prev.includes(topping)
                ? prev.filter(t => t !== topping)
                : [...prev, topping]
        );
    };

    useEffect(() => {
        setProductReviews(product.reviews);
    }, [product]);

    useEffect(() => {
        // Translate dynamic content when modal opens
        const modalTexts = [
            product.name,
            product.description,
            product.alerts,
            "Warning", "Reviews", "Submit", "Cancel",
            "Customization text input", "Add a review", "Post",
            "Review Submitted Successfully", "Review Deleted Successfully!", "Something went wrong.", "plus",
            ...sizes.map(s => s.label),
            ...ingredients.map(i => i.name)
        ];

        const filtered = [...new Set(modalTexts.filter(Boolean))];
        translateTexts(filtered, lang);
    }, [product, ingredients, lang]);

    const submitCustomizations = () => {
        const customizedProduct = { ...product };
        customizedProduct.ingredients = selectedToppings

        if (selectedSize == 'medium') {
            customizedProduct.price = customizedProduct.price + 1.5
        } else if (selectedSize == 'large') {
            customizedProduct.price = customizedProduct.price + 2
        }

        //@ts-expect-error Error due to accesing DOM directly
        document.getElementById('customization-modal').close()

        onSubmit(customizedProduct);
    }

    const submitReview = async () => {
        if(!customer || reviewText === '') return

        const data = {
            'product_id': product.id,
            'customer_id': customer.id,
            'review_text': reviewText
        }

        const res = (await axios.post(`${import.meta.env.VITE_API_URL}/addreview`, data))

        if(res.status === 200) {
            const submittedReview = res.data.data;

            setProductReviews([...productReviews, submittedReview])

            alert(t("Review Submitted Successfully"));
        } else {
            alert(t("Something went wrong."))
        }

        setReviewText('');
    }

    const deleteReview = async (reviewId: string) => {
        if(!customer || !reviewId) return

        const data = {
            'review_id': reviewId,
            'customer_id': customer.id
        }

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/deletereview`, data);

        if(res.status === 200) {
            setProductReviews([...productReviews.filter(elm => elm.id !== reviewId)]);

            alert(t("Review Deleted Successfully!"))
        } else {
            alert(t("Something went wrong."));
        }
    }

    useEffect(() => {
        setSelectedSize("small");
        setSelectedToppings(ingredients.filter(ing =>
            product?.ingredients?.some(pi => pi.id === ing.id)
        ));

        if (ttsEnabled) {
            speak(`${t(product.name)}. ${t(product.description)}`);
        }
    }, [ingredients, product, ttsEnabled]);

    return (
        <dialog id="customization-modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-white rounded-xl p-6 max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">{t(product.name)}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {t(product.description)}
                        </p>

                        <div role="alert" className="alert alert-warning my-2 py-2 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{t("Warning")}: {t(product.alerts)}</span>
                        </div>

                        <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input type="radio" name="my-accordion-2" />
                            <div className="collapse-title font-semibold">{t("Reviews")}</div>
                            <div className="collapse-content text-sm space-y-2">
                                {productReviews.map((review, index) => (
                                    <div key={index} className="flex items-center hover:bg-gray-50 p-5 rounded-xl">
                                        <div className="w-5/6">
                                            {review.review_text}
                                        </div>

                                        {(review.customer_id === customer?.id) && (
                                            <button className="w-1/6 flex justify-end cursor-pointer" onClick={() => deleteReview(review.id)}>
                                                <FaRegTrashAlt className="text-lg text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {customer && (
                                    <div className="join w-full">
                                        <input type="text" value={reviewText} onChange={(evt) => setReviewText(evt.target.value)} className="input w-full join-item" placeholder={t("Add a review")} />
                                        <button onClick={() => submitReview()} className="btn join-item">{t("Post")}</button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-800">${product.price}</p>
                </div>

                {/* Sizes */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {sizes.map((size, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedSize(size.label)}
                            onMouseEnter={() => ttsEnabled && speak(`${t(size.label)}, ${t("plus")}$${size.price.toFixed(2)}`)}
                            className={`p-3 rounded-md text-center ${selectedSize === size.label
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            <p className="font-semibold text-sm">{t(size.label).toUpperCase()}</p>
                            <p className="text-xs">+ ${size.price.toFixed(2)}</p>
                        </button>
                    ))}
                </div>

                {/* Toppings */}
                <div className="flex flex-wrap space-x-2 space-y-2">
                    {ingredients.map((ingredient, index) => (
                        <button
                            key={index}
                            onClick={() => toggleTopping(ingredient)}
                            onMouseEnter={() => ttsEnabled && speak(t(ingredient.name))}
                            className={`p-2 rounded-md text-sm text-center ${selectedToppings.includes(ingredient)
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {t(ingredient.name).toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Custom Text Input */}
                <textarea
                    placeholder={t("Customization text input")}
                    className="w-full p-3 mb-6 rounded-md bg-gray-100 text-sm"
                    rows={3}
                    onMouseEnter={() => ttsEnabled && speak(t("Customization text input"))}
                    onFocus={() => ttsEnabled && speak(t("Customization text input"))}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <form method="dialog">
                        <button
                            className="btn bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                            onMouseEnter={() => ttsEnabled && speak(t("Cancel"))}
                        >
                            {t("Cancel")}
                        </button>
                    </form>

                    <button
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={submitCustomizations}
                        onMouseEnter={() => ttsEnabled && speak(t("Submit"))}
                    >
                        {t("Submit")}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CustomizationModal;
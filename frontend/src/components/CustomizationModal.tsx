import React, { useEffect, useState } from "react";
import { IIngredient, IProduct } from "../utils/interfaces";

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
}

const CustomizationModal: React.FC<Props> = ({ product, onSubmit, ingredients, ttsEnabled }) => {
    const sizes = [
        { label: "small", price: 0 },
        { label: "medium", price: 1.5 },
        { label: "large", price: 2.0 }
    ];


    const [selectedSize, setSelectedSize] = useState("small");
    const [selectedToppings, setSelectedToppings] = useState<IIngredient[]>([]);

    const toggleTopping = (topping: IIngredient) => {
        setSelectedToppings(prev =>
            prev.includes(topping)
                ? prev.filter(t => t !== topping)
                : [...prev, topping]
        );
    };

    const submitCustomizations = () => {
        const customizedProduct = { ...product };
        customizedProduct.ingredients = selectedToppings

        if (selectedSize == 'medium') {
            customizedProduct.price = customizedProduct.price + 1.5
        } else if (selectedSize == 'large') {
            customizedProduct.price = customizedProduct.price + 2
        }

        onSubmit(customizedProduct);
    }

    useEffect(() => {
        setSelectedSize("small");
        setSelectedToppings(ingredients.filter(ing =>
            product?.ingredients?.some(pi => pi.id === ing.id)
        ));

        if (ttsEnabled) {
            speak(`${product.name}. ${product.description}`);
        }
    }, [ingredients, product, ttsEnabled]);

    return (
        <dialog id="customization-modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-white rounded-xl p-6 max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {product.description}
                        </p>

                        <div role="alert" className="alert alert-warning my-2 py-2 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Warning: {product.alerts}</span>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-800">${product.price}</p>

                </div>


                {/* Sizes */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {sizes.map((size) => (
                        <button
                            key={size.label}
                            onClick={() => setSelectedSize(size.label)}
                            onMouseEnter={() => ttsEnabled && speak(`${size.label}, plus $${size.price.toFixed(2)}`)}
                            className={`p-3 rounded-md text-center ${selectedSize === size.label
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            <p className="font-semibold text-sm">{size.label.toUpperCase()}</p>
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
                            onMouseEnter={() => ttsEnabled && speak(ingredient.name)}
                            className={`p-2 rounded-md text-sm text-center ${selectedToppings.includes(ingredient)
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {ingredient.name.toUpperCase()}
                        </button>
                    ))}
                </div>


                {/* Custom Text Input */}
                <textarea
                    placeholder="Customizations text input"
                    className="w-full p-3 mb-6 rounded-md bg-gray-100 text-sm"
                    rows={3}
                    onMouseEnter={() => ttsEnabled && speak("Customization text input")}
                    onFocus={() => ttsEnabled && speak("Customization text input")}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <form method="dialog">
                        <button
                            className="btn bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                            onMouseEnter={() => ttsEnabled && speak("Cancel")}
                        >
                            Cancel
                        </button>
                    </form>

                    <button
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={submitCustomizations}
                        onMouseEnter={() => ttsEnabled && speak("Submit")}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CustomizationModal;
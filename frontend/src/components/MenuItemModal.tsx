import React, { useState } from "react";
import axios from "axios";
import { IIngredient } from "../utils/interfaces";

interface MenuItemModalProps {
  ingredients: IIngredient[];
  onSuccess: () => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ ingredients, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hasBoba, setHasBoba] = useState(false);
  const [customizations, setCustomizations] = useState("");
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIngredientChange = (ingredientId: string, checked: boolean) => {
    if (checked) {
      setSelectedIngredients([...selectedIngredients, { id: ingredientId, quantity: 1 }]);
    } else {
      setSelectedIngredients(selectedIngredients.filter(ing => ing.id !== ingredientId));
    }
  };

  const handleIngredientQuantityChange = (ingredientId: string, quantity: number) => {
    setSelectedIngredients(
      selectedIngredients.map(ing => ing.id === ingredientId ? { ...ing, quantity } : ing)
    );
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || selectedIngredients.length === 0) {
      setError("Please fill in all required fields and select at least one ingredient");
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid price (greater than 0)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/addmenuitem`, {
        name,
        description,
        price: priceValue,
        customizations: customizations || null,
        has_boba: hasBoba,
        is_seasonal: isSeasonal,
        ingredient_ids: selectedIngredients
      });

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setHasBoba(false);
      setIsSeasonal(false);
      setCustomizations("");
      setSelectedIngredients([]);
      
      // Call success callback
      onSuccess();
      
      // Hide modal
      // @ts-expect-error Expect error from accessing DOM directly
      document.getElementById('menu-item-modal').close();
    } catch (err) {
      console.error(err);
      setError("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="menu-item-modal" className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add Menu Item</h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name*</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item Name"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price*</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5.99"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description*</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A delicious beverage..."
            rows={2}
          />
        </div>
        
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Customization Options</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            value={customizations}
            onChange={(e) => setCustomizations(e.target.value)}
            placeholder="Hot/Cold, Size options, etc."
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">Has Boba</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={hasBoba}
                onChange={(e) => setHasBoba(e.target.checked)}
              />
            </label>
          </div>
          
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">Seasonal Item</span>
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={isSeasonal}
                onChange={(e) => setIsSeasonal(e.target.checked)}
              />
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-bold mb-2">Ingredients*</h4>
          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="border p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="cursor-pointer label justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedIngredients.some(ing => ing.id === ingredient.id)}
                      onChange={(e) => handleIngredientChange(ingredient.id, e.target.checked)}
                    />
                    <span>{ingredient.name}</span>
                  </label>
                </div>
                
                {selectedIngredients.some(ing => ing.id === ingredient.id) && (
                  <div className="flex items-center">
                    <span className="mr-2">Quantity:</span>
                    <input
                      type="number"
                      className="input input-bordered input-sm w-20"
                      value={selectedIngredients.find(ing => ing.id === ingredient.id)?.quantity || 1}
                      onChange={(e) => handleIngredientQuantityChange(ingredient.id, parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Add Menu Item"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default MenuItemModal; 
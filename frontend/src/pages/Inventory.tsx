import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { IIngredient, IProduct } from "../utils/interfaces";
import useAppStore from "../utils/useAppStore";

import NewItemModal from "../components/NewItemModal";

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [tableType, setTableType] = useState<"Ingredients" | "Products">("Ingredients");
  const [selectedRow, setSelectedRow] = useState<IIngredient | IProduct | null>(null);
  const [quantityField, setQuantityField] = useState<string>("0");
  const [orderQuantityField, setOrderQuantityField] = useState<string>("10");

  const [showModal, setShowModal] = useState(false); 

  const employee = useAppStore(state => state.employee);

  const getProducts = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getproducts`)).data;

    setProducts(res.data);
  }

  const getIngredients = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getingredients`)).data;

    setIngredients(res.data);
  }

  const updateProductPrice = async (productId: string, newPrice: number) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/updateproductprice`, { 'id': productId, 'price': newPrice });

      if (res.data.success) {
        setProducts(products.map(product =>
          product.id === productId ? { ...product, price: newPrice } : product
        ));
        alert("Price updated successfully");
        return true;
      } else {
        alert("Price update failed");
        return false;
      }
    } catch (error) {
      console.error("Error updating product price:", error);
      alert("Price update failed");
      return false;
    }
  }

  const updateIngredientStock = async (ingredientId: string, newQuantity: number) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/updateingredientstock`, { 'id': ingredientId, 'quantity': newQuantity });

      if (res.data.success) {
        setIngredients(ingredients.map(ingredient =>
          ingredient.id === ingredientId ? { ...ingredient, quantity: newQuantity } : ingredient
        ));
        alert("Stock updated successfully");
        return true;
      } else {
        alert("Update failed");
        return false;
      }
    } catch (error) {
      console.error("Error updating ingredient stock:", error);
      alert("Update failed");
      return false;
    }
  }

  const handleUpdateExistingItem = () => {
    if (!selectedRow) return;

    if (tableType === "Products") {
      const product = selectedRow as IProduct;
      const newPrice = parseFloat(orderQuantityField);
      if (isNaN(newPrice)) {
        alert("Please enter a valid price");
        return;
      }
      updateProductPrice(product.id, newPrice);
    } else {
      const ingredient = selectedRow as IIngredient;
      const currentQty = parseInt(quantityField);
      const orderQty = parseInt(orderQuantityField);
      if (isNaN(orderQty)) {
        alert("Please enter a valid quantity");
        return;
      }
      const newQty = currentQty + orderQty;
      updateIngredientStock(ingredient.id, newQty);
    }
  };

  const addNewItem = async (newItem: IProduct) => {
    try {
      const res = tableType === 'Products'
        ? await axios.post(`${import.meta.env.VITE_API_URL}/addproduct`, newItem)
        : await axios.post(`${import.meta.env.VITE_API_URL}/addingredient`, newItem);
      
      if (res.data.success) {
        if(tableType === 'Products') {
          getProducts()
        } else {
          getIngredients();
        }
        alert(`${tableType === 'Products' ? 'Product' : 'Ingredient'} added successfully`);
      } else {
        alert("Failed to add item");
      }
    } catch (error) {
      console.error("Error while adding item:", error);
      alert("Error while adding item");
    }
  }

  const handleAddNewItem = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalSubmit = (newItem: IProduct) => {
    addNewItem(newItem);
  };

  const handleRowSelect = (item: IIngredient | IProduct) => {
    setSelectedRow(item);
    if (tableType === "Products") {
      const product = item as IProduct;
      setQuantityField(product.price.toString());
      setOrderQuantityField("4.00");
    } else {
      const ingredient = item as IIngredient;
      setQuantityField(ingredient.quantity.toString());
      setOrderQuantityField("10");
    }
  };

  const handleTableTypeChange = (newType: "Ingredients" | "Products") => {
    setTableType(newType);
    setSelectedRow(null);
    if (newType === "Products") {
      setQuantityField("0.00");
      setOrderQuantityField("4.00");
    } else {
      setQuantityField("0");
      setOrderQuantityField("10");
    }
  };

  useEffect(() => {
    getProducts();
    getIngredients();
  }, [])

  if (!employee || !employee['is_manager']) {
    navigate("/signin")
  }

  return (
    <div className="flex flex-col h-screen">
      <NewItemModal
        showModal={showModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        tableType={tableType}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-8">
            {/* Inventory Content Section */}
            <div className="p-5 rounded shadow">
              <div className="flex items-center mb-4">
                <label className="mr-2">Select Table:</label>
                <select
                  className="border p-1 dark:bg-gray-700 rounded"
                  value={tableType}
                  onChange={(e) => handleTableTypeChange(e.target.value as "Ingredients" | "Products")}
                >
                  <option value="Ingredients">Ingredients</option>
                  <option value="Products">Products</option>
                </select>
              </div>

              <div className="flex">
                {/* Entry Form */}
                <div className="w-64 mr-4 p-4 border rounded">
                  <p className="mb-2">ID: {selectedRow?.id || ''}</p>
                  <div className="mb-4">
                    <label className="block mb-1">{tableType === "Products" ? "Current Price:" : "Current Stock:"}</label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded"
                      value={quantityField}
                      readOnly
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">{tableType === "Products" ? "New Price:" : "Order Quantity:"}</label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded"
                      value={orderQuantityField}
                      onChange={(e) => setOrderQuantityField(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-blue-500 text-white p-2 rounded w-full mb-2"
                    onClick={handleUpdateExistingItem}
                  >
                    {tableType === "Products" ? "Update Price" : "Order More"}
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded w-full"
                    onClick={handleAddNewItem}
                  >
                    Add New Item
                  </button>
                </div>

                {/* Inventory Table */}
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="py-2 px-4 border">ID</th>
                          <th className="py-2 px-4 border">{tableType === "Products" ? "Name" : "Ingredient"}</th>
                          {tableType === "Products" ? (
                            <>
                              <th className="py-2 px-4 border">Description</th>
                              <th className="py-2 px-4 border">Price</th>
                              <th className="py-2 px-4 border">Customizations</th>
                              <th className="py-2 px-4 border">Boba</th>
                            </>
                          ) : (
                            <>
                              <th className="py-2 px-4 border">Stock</th>
                              <th className="py-2 px-4 border">Source</th>
                              <th className="py-2 px-4 border">Expiration</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {tableType === "Products" ? (
                          products.map((product) => (
                            <tr
                              key={product.id}
                              className={`hover:bg-gray-50 dark:hover:text-black cursor-pointer ${selectedRow?.id === product.id ? 'bg-blue-100 dark:bg-blue-500' : ''}`}
                              onClick={() => handleRowSelect(product)}
                            >
                              <td className="py-3 px-4 border">{product.id}</td>
                              <td className="py-3 px-4 border">{product.name}</td>
                              <td className="py-3 px-4 border">{product.description}</td>
                              <td className="py-3 px-4 border">${product.price.toFixed(2)}</td>
                              <td className="py-3 px-4 border">{product.customizations}</td>
                              <td className="py-3 px-4 border">{product.has_boba ? "Yes" : "No"}</td>
                            </tr>
                          ))
                        ) : (
                          ingredients.map((ingredient) => (
                            <tr
                              key={ingredient.id}
                              className={`hover:bg-gray-50 dark:hover:text-black cursor-pointer ${selectedRow?.id === ingredient.id ? 'bg-blue-100 dark:bg-blue-500' : ''}`}
                              onClick={() => handleRowSelect(ingredient)}
                            >
                              <td className="py-3 px-4 border">{ingredient.id}</td>
                              <td className="py-3 px-4 border">{ingredient.name}</td>
                              <td className="py-3 px-4 border">{ingredient.quantity}</td>
                              <td className="py-3 px-4 border">{ingredient.supplier}</td>
                              <td className="py-3 px-4 border">{new Date(ingredient.expiration).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Restock Report Section */}
            <div className="p-5 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Restock Report:</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="py-2 px-4 border">ID</th>
                      <th className="py-2 px-4 border">Ingredient</th>
                      <th className="py-2 px-4 border">Stock</th>
                      <th className="py-2 px-4 border">Source</th>
                      <th className="py-2 px-4 border">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients
                      .filter(ingredient => ingredient.quantity <= 100)
                      .map((ingredient) => (
                        <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:text-black">
                          <td className="py-3 px-4 border">{ingredient.id}</td>
                          <td className="py-3 px-4 border">{ingredient.name}</td>
                          <td className="py-3 px-4 border">{ingredient.quantity}</td>
                          <td className="py-3 px-4 border">{ingredient.supplier}</td>
                          <td className="py-3 px-4 border">{new Date(ingredient.expiration).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryPage
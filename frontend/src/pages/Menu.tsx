import React, { useState, useEffect } from "react";
import axios from "axios";
import { IIngredient, IProduct } from "../utils/interfaces";

import CustomizationModal from "../components/CustomizationModal";

const MenuPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [totals, setTotals] = useState([0, 0, 0]) // subtotal, tax, total

  const [cart, setCart] = useState<IProduct[]>([]);

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    getProducts();
    getIngredients();
  }, []);

  const getProducts = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getproducts`)).data;

    setProducts(res.data);
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
    if(!cart.length) return;

    setLoading(true);
    
    const products = cart.map(elm => elm.id);

    const ingredients = []
    for (const elm of cart) {
      ingredients.push(...elm.ingredients.map(ing => ing.id));
    }

    const employee_id = "550e8400-e29b-41d4-a716-446655440000"

    const total = totals[2]

    await axios.post(`${import.meta.env.VITE_API_URL}/submitorder`, { 'products': products, 'ingredients': ingredients, 'employee_id': employee_id, 'total': total });
    
    setLoading(false)
    resetOrder()
    alert("Order submitted successfully");
  }
  const resetOrder = () => {
    const newCart: IProduct[] = [];

    setCart(newCart);
    updateTotals(newCart)
  }

  useEffect(() => {
    getProducts();
    getIngredients();
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      // @ts-expect-error Expect error from accessing DOM directly
      document.getElementById('customization-modal').showModal()
    }
  }, [selectedProduct])

  return (
    <div className='w-full h-full p-4'>
      {products.length > 0 && selectedProduct && (
        <CustomizationModal
          product={selectedProduct} // Pass the first product or use a selected one
          ingredients={ingredients}
          onSubmit={addProductToCart}
        />
      )}

      <div className='flex gap-8 h-full'>
        <div className='w-2/3 flex flex-wrap gap-6 border-r-2 border-gray-100'>
          {!products.length && <span className="loading loading-spinner loading-xl mx-auto"></span>}
          {products.map((product, index) => (
            <button
              key={index}
              className='bg-gray-100 p-4 rounded-xl w-[180px] h-[100px] flex flex-col justify-between shadow-sm hover:bg-gray-200 cursor-pointer'
              onClick={() => setSelectedProduct(product)}
            >
              <p className='text-base font-bold truncate'>{product.name}</p>
              <p className='text-sm text-gray-700'>${Number(product.price).toFixed(2)}</p>
            </button>
          ))}
        </div>

        {/* Right: Order Total (1/3) */}
        <div className='w-1/3 p-4 space-y-12'>
          <div className="text-3xl font-semibold flex justify-between">
            <p>Order #</p>
            <p>123456</p>
          </div>

          <div className="space-y-4">
            {cart.map((elm, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-xl flex justify-between">
                <div>
                  <p className="text-xl font-bold">{elm.name}</p>
                  <p className="px-2">${elm.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-4 border border-gray-100">
            <div className="flex justify-between">
              <p>Subtotal</p>

              <p>${totals[0].toFixed(2)}</p>
            </div>

            <div className="flex justify-between">
              <p>Tax 8.25%</p>

              <p>${totals[1].toFixed(2)}</p>
            </div>

            <div className="flex justify-between text-2xl font-bold">
              <p>Total</p>

              <p>${totals[2].toFixed(2)}</p>
            </div>

            <div className="flex gap-x-8 my-8">
              <button className="bg-red-500 text-white p-3 rounded-2xl w-full hover:bg-red-600 cursor-pointer" onClick={resetOrder}>Cancel Order</button>

              <button className="bg-green-500 text-white p-3 rounded-2xl w-full hover:bg-green-600 cursor-pointer" onClick={submitOrder}>
                { loading ? <span className="loading loading-spinner loading-md"></span> : <span>Submit Order</span> }
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MenuPage
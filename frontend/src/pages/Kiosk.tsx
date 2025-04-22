import React, { useState, useEffect } from "react";
import axios from "axios";

import { IIngredient, IProduct } from "../utils/interfaces";
import CustomizationModal from "../components/CustomizationModal";

import useAppStore from "../utils/useAppStore";

const MenuPage: React.FC = () => {
  const customer = useAppStore(state => state.customer);
  const setCustomer = useAppStore(state => state.setCustomer);

  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [totals, setTotals] = useState([0, 0, 0, 0]) // subtotal, tax, total, discount

  const [showFullMenu, setShowFullMenu] = useState(false);

  const [cart, setCart] = useState<IProduct[]>([]);

  useEffect(() => {
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
    alert("Order submitted successfully");

    if (customer && totals[3]) {
      setCustomer({ ...customer, points: customer.points - Math.floor(totals[3]) * 10 });
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
    <div className='w-full h-full'>
      {products.length > 0 && selectedProduct && (
        <CustomizationModal
          product={selectedProduct} // Pass the first product or use a selected one
          ingredients={ingredients}
          onSubmit={addProductToCart}
        />
      )}

      <dialog id="reward-modal" className="modal">
        <form method="dialog" className="modal-box max-w-sm">
          <h3 className="text-2xl font-bold mb-4">Sharetea Rewards</h3>

          <p className="text-gray-700 mb-2">
            Hello! You have{" "}
            <span className="font-semibold">
              {customer?.points ?? 0}
            </span>{" "}
            points.
          </p>

          <p className="text-gray-700 mb-6">
            Would you like to apply a{" "}
            <span className="font-semibold">
              ${((customer?.points ?? 0) / 10).toFixed(2)}
            </span>{" "}
            discount?
          </p>

          <div className="modal-action justify-end">
            <button className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" onClick={() => applyDiscount()}>Apply Discount</button>
          </div>
        </form>

        {/* clicking outside or pressing ESC will also close */}
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close"></button>
        </form>
      </dialog>

      <div className='flex gap-8 h-full'>
        <div className='w-2/3 flex flex-wrap gap-6 border-r-2 border-gray-100'>
          <div className="flex justify-between items-center mb-4 px-2">
            {products.length !== 0 && <>
              <h2 className='text-2xl font-bold'>Popular Drinks</h2>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 ml-8"
                onClick={() => setShowFullMenu(true)}
              >
                Full Menu
              </button>
            </>}
          </div>
          <div className='flex flex-wrap gap-6'>
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
        </div>

        {/* Full Menu Modal */}
        {showFullMenu && (
          <dialog open className="modal">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">Full Menu</h3>

              <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-xl">
                    <p className="font-bold text-lg">{product.name}</p>
                    <p className="text-gray-700">${Number(product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setShowFullMenu(false)}>Close</button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={() => setShowFullMenu(false)}>
              <button>close</button>
            </form>
          </dialog>
        )}

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

            {totals[3] !== undefined && (
              <div className="flex justify-between">
                <p>Discount</p>

                <p>${totals[3].toFixed(2)}</p>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold">
              <p>Total</p>

              <p>${(totals[2] - (totals[3] ?? 0)).toFixed(2)}</p>
            </div>

            <div className="flex gap-x-8 my-8">
              <button className="bg-red-500 text-white p-3 rounded-2xl w-full hover:bg-red-600 cursor-pointer" onClick={resetOrder}>Cancel Order</button>

              <button className="bg-green-500 text-white p-3 rounded-2xl w-full hover:bg-green-600 cursor-pointer" onClick={submitOrder}>
                {loading ? <span className="loading loading-spinner loading-md"></span> : <span>Submit Order</span>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MenuPage
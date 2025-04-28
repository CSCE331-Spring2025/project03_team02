import React, { useEffect, useState } from "react";
import axios from "axios";
import { IIngredient } from "../utils/interfaces";

// interface for order ticket data structure
interface OrderTicket {
  id: string;
  products: {
    id: string;
    name: string;
    size?: string;
    price: number;
    ingredients: IIngredient[];
  }[];
  total: number;
}

// main component for kitchen order management
const KitchenView: React.FC = () => {
  const [orders, setOrders] = useState<OrderTicket[]>([]);

  // fetch incomplete orders from the api
  const fetchOrders = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getorders`);
    setOrders(res.data.orders);
  };

  // mark an order as complete
  const markOrderComplete = async (orderId: string) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/completeorder`, { orderId });
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // fetch orders on component mount and set up refresh interval
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.length === 0 ? (
        <p className="text-xl text-center col-span-full">No active orders</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Order #{order.id.slice(0, 6)}</h2>
              <button
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => markOrderComplete(order.id)}
              >
                Mark Complete
              </button>
            </div>

            {order.products.map((product, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold text-md">{product.name}</p>
                {product.size && <p className="text-sm text-gray-500">Size: {product.size}</p>}
                {product.ingredients.length > 0 && (
                  <ul className="text-sm list-disc ml-4 text-gray-600">
                    {product.ingredients.map((ing, i) => (
                      <li key={i}>{ing.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default KitchenView;

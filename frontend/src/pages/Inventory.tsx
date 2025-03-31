import React, { useState, useEffect } from "react";
import axios from "axios";
import { IIngredient, IProduct } from "../utils/interfaces";

const InventoryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);

  const getProducts = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getproducts`)).data;

    setProducts(res.data);
  }

  const getIngredients = async () => {
    const res = (await axios.get(`${import.meta.env.VITE_API_URL}/getingredients`)).data;

    setIngredients(res.data);
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
   
    </div>
  )
}

export default InventoryPage
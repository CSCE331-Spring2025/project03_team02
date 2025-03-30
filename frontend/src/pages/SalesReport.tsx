import React, { useState, useEffect } from "react";
import axios from "axios";

import { IItem } from "../utils/interfaces";

const SalesReportPage: React.FC = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);

    const getSalesReport = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/getsalesreport`);
            setItems(res.data.data);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSalesReport();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sales Report</h2>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : items.length === 0 ? (
                <p className="text-center text-gray-500">No sales data available.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Quantity Sold</th>
                            <th className="border p-2">Total Sales ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2">{item.product_name}</td>
                                <td className="border p-2">{item.total_quantity_sold}</td>
                                <td className="border p-2">${item.total_sales.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SalesReportPage;

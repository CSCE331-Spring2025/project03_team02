import React, { useState, useEffect } from "react";
import axios from "axios";
import { IItem } from "../utils/interfaces";

const SalesReportPage: React.FC = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInterval, setSelectedInterval] = useState<string>("today");
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState<string>("00:00:00");
    const [endTime, setEndTime] = useState<string>("23:59:59");  // Fixed end time to 59 for better coverage

    const getSalesReport = async (interval?: string, customStart?: string, customEnd?: string) => {
        try {
            setLoading(true);
            let params: any = { interval };
            
            // Format date and time as "yyyy-MM-dd HH:mm:ss"
            if (interval === "custom" && customStart && customEnd) {
                const formattedStartDate = `${customStart} ${startTime}`;
                const formattedEndDate = `${customEnd} ${endTime}`;
                params.startDate = formattedStartDate;
                params.endDate = formattedEndDate;
                console.log("Sending params:", params);
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/getsalesreport`, { params });
            setItems(res.data.data);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const interval = event.target.value;
        setSelectedInterval(interval);

        // Reset the results when custom interval is selected
        if (interval === "custom") {
            setItems([]); // Clear previous results
        }

        const now = new Date();
        switch (interval) {
            case "pastHour":
                getSalesReport("pastHour");
                break;
            case "today":
                setStartDate(now.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
                getSalesReport("today");
                break;
            case "thisWeek":
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                setStartDate(startOfWeek.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
                getSalesReport("thisWeek");
                break;
            case "thisMonth":
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                setStartDate(startOfMonth.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
                getSalesReport("thisMonth");
                break;
            case "thisYear":
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                setStartDate(startOfYear.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
                getSalesReport("thisYear");
                break;
            default:
                break;
        }
    };

    const handleCustomDateApply = () => {
        getSalesReport("custom", startDate, endDate);
    };

    useEffect(() => {
        getSalesReport("today");
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
            
            {/* Interval Selection & Custom Date Inputs */}
            <div className="mb-6 flex flex-wrap items-center gap-6">
                {/* Interval Selection */}
                <div className="flex items-center gap-2">
                    <label htmlFor="interval-select" className="font-semibold">Select Time Interval:</label>
                    <select
                        id="interval-select"
                        value={selectedInterval}
                        onChange={handleIntervalChange}
                        className="border p-2 rounded"
                    >
                        <option value="pastHour">Past Hour</option>
                        <option value="today">Today</option>
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="thisYear">This Year</option>
                        <option value="custom">Custom Interval</option>
                    </select>
                </div>

                {/* Custom Interval Inputs - Appears to the Right */}
                {selectedInterval === "custom" && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Start Date:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Start Time:</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">End Date:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">End Time:</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                        <button 
                            onClick={handleCustomDateApply}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Sales Report Table */}
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

// XReport.tsx
import React from "react";

export interface IHourlySales {
    hour: string;
    total: number;
}

export interface IProductSales {
    name: string;
    quantity: number;
    total: number;
}

export interface IEmployeePerformance {
    name: string;
    orders: number;
    sales: number;
}

export interface ReportData {
    totalOrders: number;
    subtotal: number;
    totalTax: number;
    totalSales: number;
    timeRange: string; // e.g. "daily", "weekly", ...
    periodName: string;
    timeUnitName: string;
    startDate: string;
    endDate: string;
    hourlySales: IHourlySales[];
    productSales: IProductSales[];
    employeePerformance: IEmployeePerformance[];
    ingredientsUsed?: { name: string; count: number }[];
    salesPerEmployee?: { name: string; orders: number; sales: number }[];
    periodText?: string;
    reportDate?: string;
    generatedAt?: string;
}

interface XReportProps {
    data: ReportData | null;
    loading: boolean;
    selectedInterval: string;
    formatCurrency: (value: number) => string;
    formatDateRange: () => string;
}

const XReport: React.FC<XReportProps> = ({
    data,
    loading,
    selectedInterval,
    formatCurrency,
    formatDateRange,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">
                    X-Report {data ? `(${data.periodName || ""})` : ""}
                </h2>
                {data && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateRange()}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <p>Loading...</p>
                </div>
            ) : !data ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 h-64 flex items-center justify-center shadow-sm text-center">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                        No X-Report data available.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Daily Sales Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                            {data.periodName} Sales Summary
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-y-3">
                                <div className="font-medium">Total Orders:</div>
                                <div className="text-right">{data.totalOrders}</div>
                                <div className="font-medium">Subtotal:</div>
                                <div className="text-right">{formatCurrency(data.subtotal)}</div>
                                <div className="font-medium">Total Tax:</div>
                                <div className="text-right">{formatCurrency(data.totalTax)}</div>
                                <div className="font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                                    Total Sales:
                                </div>
                                <div className="text-right text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                    {formatCurrency(data.totalSales)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time-based Sales */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                            {data.timeUnitName} Sales
                        </div>
                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700">
                                        <th className="p-4 text-left font-semibold">
                                            {selectedInterval === "today" ||
                                                selectedInterval === "pastHour"
                                                ? "Hour"
                                                : selectedInterval === "thisWeek"
                                                    ? "Day"
                                                    : selectedInterval === "thisMonth"
                                                        ? "Day"
                                                        : "Time"}
                                        </th>
                                        <th className="p-4 text-right font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.hourlySales && data.hourlySales.length > 0 ? (
                                        data.hourlySales.map((hourData, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                                        ? "bg-gray-50 dark:bg-gray-800"
                                                        : "bg-white dark:bg-gray-900"
                                                    }`}
                                            >
                                                <td className="p-4">{hourData.hour}</td>
                                                <td className="p-4 text-right">
                                                    {formatCurrency(hourData.total)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-t border-gray-200 dark:border-gray-700">
                                            <td
                                                colSpan={2}
                                                className="p-6 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No {data.timeUnitName.toLowerCase()} sales data available
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                                        <td className="p-4">TOTAL</td>
                                        <td className="p-4 text-right">{formatCurrency(data.totalSales)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Product Sales */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                            Product Sales
                        </div>
                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700">
                                        <th className="p-4 text-left font-semibold">Product</th>
                                        <th className="p-4 text-right font-semibold">Quantity</th>
                                        <th className="p-4 text-right font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.productSales && data.productSales.length > 0 ? (
                                        data.productSales.map((product, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                                        ? "bg-gray-50 dark:bg-gray-800"
                                                        : "bg-white dark:bg-gray-900"
                                                    }`}
                                            >
                                                <td className="p-4">{product.name}</td>
                                                <td className="p-4 text-right">{product.quantity}</td>
                                                <td className="p-4 text-right">
                                                    {formatCurrency(product.total)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-t border-gray-200 dark:border-gray-700">
                                            <td
                                                colSpan={3}
                                                className="p-6 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No product sales data available
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                                        <td className="p-4">TOTAL</td>
                                        <td className="p-4 text-right">
                                            {data.productSales
                                                ? data.productSales.reduce(
                                                    (sum, product) => sum + product.quantity,
                                                    0
                                                )
                                                : 0}
                                        </td>
                                        <td className="p-4 text-right">{formatCurrency(data.subtotal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Employee Performance */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                            Employee Performance
                        </div>
                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700">
                                        <th className="p-4 text-left font-semibold">Employee</th>
                                        <th className="p-4 text-right font-semibold">Orders</th>
                                        <th className="p-4 text-right font-semibold">Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.employeePerformance && data.employeePerformance.length > 0 ? (
                                        data.employeePerformance.map((employee, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                                        ? "bg-gray-50 dark:bg-gray-800"
                                                        : "bg-white dark:bg-gray-900"
                                                    }`}
                                            >
                                                <td className="p-4">{employee.name}</td>
                                                <td className="p-4 text-right">{employee.orders}</td>
                                                <td className="p-4 text-right">
                                                    {formatCurrency(employee.sales)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-t border-gray-200 dark:border-gray-700">
                                            <td
                                                colSpan={3}
                                                className="p-6 text-center italic text-gray-500 dark:text-gray-400"
                                            >
                                                No employee performance data available
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                                        <td className="p-4">TOTAL</td>
                                        <td className="p-4 text-right">{data.totalOrders}</td>
                                        <td className="p-4 text-right">{formatCurrency(data.totalSales)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XReport;

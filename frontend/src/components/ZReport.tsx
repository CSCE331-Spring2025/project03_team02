// ZReport.tsx
import React from "react";
import { ReportData } from "./XReport";

interface ZReportProps {
    xData: ReportData | null; // Used for fallback display in the header
    zData: ReportData | null;
    loading: boolean;
    zReportGenerated: boolean;
    selectedInterval: string;
    formatCurrency: (value: number) => string;
    onShowZReportConfirmation: () => void;
}

const ZReport: React.FC<ZReportProps> = ({
    xData,
    zData,
    loading,
    zReportGenerated,
    formatCurrency,
    onShowZReportConfirmation,
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    Z-Report{" "}
                    {zData
                        ? `(${zData.periodName})`
                        : xData
                            ? `(${xData.periodName})`
                            : ""}
                </h2>
                <button
                    onClick={onShowZReportConfirmation}
                    className="bg-blue-500 hover:bg-blue-600  text-white px-5 py-2.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 "
                    disabled={loading}
                >
                    Generate Z-Report
                </button>
            </div>
            {!zReportGenerated ? (
                <div className="bg-white rounded-xl p-8 h-64 flex items-center justify-center shadow-sm text-center">
                    <div>
                        <p className="text-gray-500  italic mb-2">
                            Z-Report will appear here after generation.
                        </p>
                        <p className="text-sm text-gray-500">
                            Note: Generating a Z-Report will clear the X-Report data.
                        </p>
                    </div>
                </div>
            ) : loading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
                    <p>Loading...</p>
                </div>
            ) : (
                zData && (
                    <div className="space-y-6">
                        {/* Z-Report Sales Summary */}
                        <div className="bg-white  rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-green-100  p-4 font-bold text-lg">
                                Z-Report: {zData.periodName} Sales Summary
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div className="font-medium">Total Orders:</div>
                                    <div className="text-right">{zData.totalOrders}</div>
                                    <div className="font-medium">Subtotal:</div>
                                    <div className="text-right">{formatCurrency(zData.subtotal)}</div>
                                    <div className="font-medium">Total Tax:</div>
                                    <div className="text-right">{formatCurrency(zData.totalTax)}</div>
                                    <div className="font-medium text-lg pt-2 border-t border-gray-200 ">
                                        Total Sales:
                                    </div>
                                    <div className="text-right text-lg font-bold pt-2 border-t border-gray-200 ">
                                        {formatCurrency(zData.totalSales)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients Used */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-green-100 p-4 font-bold text-lg">
                                Ingredients Used {zData.periodText || ""}
                            </div>
                            <div className="overflow-hidden">
                                {zData.ingredientsUsed && zData.ingredientsUsed.length > 0 ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 ">
                                                <th className="p-4 text-left font-semibold">Ingredient</th>
                                                <th className="p-4 text-right font-semibold">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {zData.ingredientsUsed.map((ingredient, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-t border-gray-200 ${index % 2 === 0
                                                            ? "bg-gray-50 "
                                                            : "bg-white "
                                                        }`}
                                                >
                                                    <td className="p-4">{ingredient.name}</td>
                                                    <td className="p-4 text-right">{ingredient.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="p-6 text-center italic text-gray-500 ">
                                        No ingredient usage data available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sales Per Employee */}
                        <div className="bg-white  rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-green-100  p-4 font-bold text-lg">
                                Sales Per Employee
                            </div>
                            <div className="overflow-hidden">
                                {zData.salesPerEmployee && zData.salesPerEmployee.length > 0 ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 ">
                                                <th className="p-4 text-left font-semibold">Employee</th>
                                                <th className="p-4 text-right font-semibold">Orders</th>
                                                <th className="p-4 text-right font-semibold">Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {zData.salesPerEmployee.map((employee, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-t border-gray-200  ${index % 2 === 0
                                                            ? "bg-gray-50 "
                                                            : "bg-white "
                                                        }`}
                                                >
                                                    <td className="p-4">{employee.name}</td>
                                                    <td className="p-4 text-right">{employee.orders}</td>
                                                    <td className="p-4 text-right">
                                                        {formatCurrency(employee.sales)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="p-6 text-center italic text-gray-500 ">
                                        No employee sales data available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Z-Report Timestamp */}
                        {zData.generatedAt && (
                            <div className="text-right text-sm text-gray-500 p-2">
                                Generated: {new Date(zData.generatedAt).toLocaleString()}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default ZReport;
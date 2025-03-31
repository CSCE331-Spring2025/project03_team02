import React, { useState, useEffect } from "react";
import axios from "axios";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [showZConfirmModal, setShowZConfirmModal] = useState(false);
  const [timeRange, setTimeRange] = useState("daily");
  
  interface ReportData {
    totalOrders: number;
    subtotal: number;
    totalTax: number;
    totalSales: number;
    timeRange: string;
    periodName: string;
    timeUnitName: string;
    startDate: string;
    endDate: string;
    hourlySales: Array<{ hour: string; total: number }>;
    productSales: Array<{ name: string; quantity: number; total: number }>;
    employeePerformance: Array<{ name: string; orders: number; sales: number }>;
    ingredientsUsed?: Array<{ name: string; count: number }>;
    salesPerEmployee?: Array<{ name: string; orders: number; sales: number }>;
    periodText?: string;
    reportDate?: string;
    generatedAt?: string;
  }
  
  const [xReportData, setXReportData] = useState<ReportData>({
    totalOrders: 0,
    subtotal: 0,
    totalTax: 0,
    totalSales: 0,
    timeRange: "daily",
    periodName: "Daily",
    timeUnitName: "Hourly",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    hourlySales: [],
    productSales: [],
    employeePerformance: []
  });

  const [zReportData, setZReportData] = useState<ReportData | null>(null);
  
  const [zReportGenerated, setZReportGenerated] = useState(false);

  useEffect(() => {
    fetchXReport();
  }, [timeRange]);

  const fetchXReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getxreport?timeRange=${timeRange}`);
      
      if (response.data && response.data.data) {
        setXReportData(response.data.data);
      } else {
        console.error("Invalid response format from X-Report API");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching X-Report:", error);
      setLoading(false);
      
      // Reset to default values on error
      setXReportData({
        totalOrders: 0,
        subtotal: 0,
        totalTax: 0,
        totalSales: 0,
        timeRange: "daily",
        periodName: "Daily",
        timeUnitName: "Hourly",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        hourlySales: [],
        productSales: [],
        employeePerformance: []
      });
    }
  };

  const showZReportConfirmation = () => {
    setShowZConfirmModal(true);
  };

  const generateZReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generatezreport`, { 
        timeRange: timeRange 
      });
      
      if (response.data && response.data.data) {
        setZReportData(response.data.data);
        
        setXReportData({
          totalOrders: 0,
          subtotal: 0,
          totalTax: 0,
          totalSales: 0,
          timeRange: timeRange,
          periodName: xReportData.periodName,
          timeUnitName: xReportData.timeUnitName,
          startDate: xReportData.startDate,
          endDate: xReportData.endDate,
          hourlySales: [],
          productSales: [],
          employeePerformance: []
        });
        
        setZReportGenerated(true);
      } else {
        console.error("Invalid response format from Z-Report API");
      }
      
      setShowZConfirmModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error generating Z-Report:", error);
      setLoading(false);
      setShowZConfirmModal(false);
    }
  };

  const cancelZReport = () => {
    setShowZConfirmModal(false);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value.toLowerCase());
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Function to format date ranges for display
  const formatDateRange = () => {
    try {
      const startDate = new Date(xReportData.startDate);
      const endDate = new Date(xReportData.endDate);
      
      if (timeRange === "daily") {
        return startDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      }
    } catch (error) {
      return new Date().toLocaleDateString();
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center">
          <span className="mr-2 font-medium">Time Range:</span>
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 outline-none"
            onChange={handleTimeRangeChange}
            value={timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* X-Report Column */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">X-Report ({xReportData.periodName})</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateRange()}
            </span>
          </div>
          
          {loading && !zReportGenerated ? (
            <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Daily Sales Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                  {xReportData.periodName} Sales Summary
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="font-medium">Total Orders:</div>
                    <div className="text-right">{xReportData.totalOrders}</div>
                    <div className="font-medium">Subtotal:</div>
                    <div className="text-right">{formatCurrency(xReportData.subtotal)}</div>
                    <div className="font-medium">Total Tax:</div>
                    <div className="text-right">{formatCurrency(xReportData.totalTax)}</div>
                    <div className="font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-700">Total Sales:</div>
                    <div className="text-right text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">{formatCurrency(xReportData.totalSales)}</div>
                  </div>
                </div>
              </div>

              {/* Time-based Sales */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 font-bold text-lg">
                  {xReportData.timeUnitName} Sales
                </div>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="p-4 text-left font-semibold">
                          {timeRange === "daily" ? "Hour" : timeRange === "weekly" ? "Day" : "Week"}
                        </th>
                        <th className="p-4 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xReportData.hourlySales.length > 0 ? (
                        xReportData.hourlySales.map((hourData, index) => (
                          <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                            <td className="p-4">{hourData.hour}</td>
                            <td className="p-4 text-right">{formatCurrency(hourData.total)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-gray-200 dark:border-gray-700">
                          <td colSpan={2} className="p-6 text-center italic text-gray-500 dark:text-gray-400">
                            No {xReportData.timeUnitName.toLowerCase()} sales data available
                          </td>
                        </tr>
                      )}
                      <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td className="p-4">TOTAL</td>
                        <td className="p-4 text-right">{formatCurrency(xReportData.totalSales)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Sales */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
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
                      {xReportData.productSales.length > 0 ? (
                        xReportData.productSales.map((product, index) => (
                          <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                            <td className="p-4">{product.name}</td>
                            <td className="p-4 text-right">{product.quantity}</td>
                            <td className="p-4 text-right">{formatCurrency(product.total)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-gray-200 dark:border-gray-700">
                          <td colSpan={3} className="p-6 text-center italic text-gray-500 dark:text-gray-400">No product sales data available</td>
                        </tr>
                      )}
                      <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td className="p-4">TOTAL</td>
                        <td className="p-4 text-right">{xReportData.productSales.reduce((sum, product) => sum + product.quantity, 0)}</td>
                        <td className="p-4 text-right">{formatCurrency(xReportData.subtotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employee Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
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
                      {xReportData.employeePerformance.length > 0 ? (
                        xReportData.employeePerformance.map((employee, index) => (
                          <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                            <td className="p-4">{employee.name}</td>
                            <td className="p-4 text-right">{employee.orders}</td>
                            <td className="p-4 text-right">{formatCurrency(employee.sales)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-gray-200 dark:border-gray-700">
                          <td colSpan={3} className="p-6 text-center italic text-gray-500 dark:text-gray-400">No employee performance data available</td>
                        </tr>
                      )}
                      <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td className="p-4">TOTAL</td>
                        <td className="p-4 text-right">{xReportData.totalOrders}</td>
                        <td className="p-4 text-right">{formatCurrency(xReportData.totalSales)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Z-Report Column */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Z-Report {zReportData ? `(${zReportData.periodName})` : `(${xReportData.periodName})`}
            </h2>
            <button 
              onClick={showZReportConfirmation}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
              disabled={loading}
            >
              Generate Z-Report
            </button>
          </div>

          {!zReportGenerated ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 h-64 flex items-center justify-center shadow-sm text-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 italic mb-2">
                  Z-Report will appear here after generation.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Note: Generating a Z-Report will clear the X-Report data.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Z-Report Sales Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="bg-green-100 dark:bg-green-900 p-4 font-bold text-lg">
                  Z-Report: {zReportData?.periodName || ""} Sales Summary
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="font-medium">Total Orders:</div>
                    <div className="text-right">{zReportData?.totalOrders || 0}</div>
                    <div className="font-medium">Subtotal:</div>
                    <div className="text-right">{formatCurrency(zReportData?.subtotal || 0)}</div>
                    <div className="font-medium">Total Tax:</div>
                    <div className="text-right">{formatCurrency(zReportData?.totalTax || 0)}</div>
                    <div className="font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-700">Total Sales:</div>
                    <div className="text-right text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">{formatCurrency(zReportData?.totalSales || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Ingredients Used */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="bg-green-100 dark:bg-green-900 p-4 font-bold text-lg">
                  Ingredients Used {zReportData?.periodText || ""}
                </div>
                <div className="overflow-hidden">
                  {zReportData?.ingredientsUsed && zReportData.ingredientsUsed.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="p-4 text-left font-semibold">Ingredient</th>
                          <th className="p-4 text-right font-semibold">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zReportData.ingredientsUsed.map((ingredient, index) => (
                          <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                            <td className="p-4">{ingredient.name}</td>
                            <td className="p-4 text-right">{ingredient.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-6 text-center italic text-gray-500 dark:text-gray-400">
                      No ingredient usage data available
                    </p>
                  )}
                </div>
              </div>

              {/* Sales Per Employee */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="bg-green-100 dark:bg-green-900 p-4 font-bold text-lg">
                  Sales Per Employee
                </div>
                <div className="overflow-hidden">
                  {zReportData?.salesPerEmployee && zReportData.salesPerEmployee.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="p-4 text-left font-semibold">Employee</th>
                          <th className="p-4 text-right font-semibold">Orders</th>
                          <th className="p-4 text-right font-semibold">Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zReportData.salesPerEmployee.map((employee, index) => (
                          <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                            <td className="p-4">{employee.name}</td>
                            <td className="p-4 text-right">{employee.orders}</td>
                            <td className="p-4 text-right">{formatCurrency(employee.sales)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-6 text-center italic text-gray-500 dark:text-gray-400">
                      No employee sales data available
                    </p>
                  )}
                </div>
              </div>
              
              {/* Z-Report Timestamp */}
              {zReportData?.generatedAt && (
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 p-2">
                  Generated: {new Date(zReportData.generatedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Z-Report Confirmation Modal */}
      {showZConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Generate Z-Report</h3>
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Warning</p>
              <p className="text-sm">
                The Z-Report should only be run once per {timeRange === "daily" ? "day" : timeRange === "weekly" ? "week" : "month"}, 
                typically at the end of business. 
                Generating a Z-Report will clear all current X-Report data.
              </p>
            </div>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={cancelZReport}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={generateZReport}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
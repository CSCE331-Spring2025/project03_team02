// Reports.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import XReport, { ReportData } from "../components/XReport";
import ZReport from "../components/ZReport";
import ChartPage from "./ChartPage";
import useAppStore from "../utils/useAppStore";

const Reports: React.FC = () => {
  const navigate = useNavigate();

  // Combined States
  const [loading, setLoading] = useState(false);
  const [xReportData, setXReportData] = useState<ReportData | null>(null);
  const [zReportData, setZReportData] = useState<ReportData | null>(null);
  const [zReportGenerated, setZReportGenerated] = useState(false);
  const [showZConfirmModal, setShowZConfirmModal] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<string>("today");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("23:59:59");

  const employee = useAppStore(state => state.employee);

  // Utility functions
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const formatDateRange = () => {
    try {
      if (!xReportData) return "";
      const sDate = new Date(xReportData.startDate);
      const eDate = new Date(xReportData.endDate);
      if (selectedInterval === "today" || selectedInterval === "pastHour") {
        return sDate.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return `${sDate.toLocaleDateString()} - ${eDate.toLocaleDateString()}`;
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const mapIntervalToTimeRange = (interval: string) => {
    switch (interval) {
      case "pastHour":
      case "today":
        return "daily";
      case "thisWeek":
        return "weekly";
      case "thisMonth":
        return "monthly";
      case "thisYear":
        return "yearly";
      default:
        return "daily";
    }
  };

  // Fetch X-Report data
  const fetchXReport = async (interval: string) => {
    setLoading(true);
    try {
      const params: { startDate?: string; endDate?: string; timeRange?: string } = {};
      if (interval === "custom") {
        params.startDate = `${startDate} ${startTime}`;
        params.endDate = `${endDate} ${endTime}`;
      } else {
        params.timeRange = mapIntervalToTimeRange(interval);
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getxreport`,
        { params }
      );
      if (response.data && response.data.data) {
        setXReportData(response.data.data);
      } else {
        console.error("Invalid response format from X-Report API");
        setXReportData(null);
      }
    } catch (error) {
      console.error("Error fetching X-Report:", error);
      setXReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Z-Report generation
  const showZReportConfirmation = () => {
    setShowZConfirmModal(true);
  };

  const generateZReport = async () => {
    setLoading(true);
    try {
      const timeRangeParam = mapIntervalToTimeRange(selectedInterval);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generatezreport`,
        { timeRange: timeRangeParam }
      );
      if (response.data && response.data.data) {
        setZReportData(response.data.data);
        setZReportGenerated(true);
        // Clear the X-Report data after generating Z-Report
        setXReportData({
          totalOrders: 0,
          subtotal: 0,
          totalTax: 0,
          totalSales: 0,
          timeRange: timeRangeParam,
          periodName: "",
          timeUnitName: "",
          startDate: "",
          endDate: "",
          hourlySales: [],
          productSales: [],
          employeePerformance: [],
        });
      } else {
        console.error("Invalid response format from Z-Report API");
      }
      setShowZConfirmModal(false);
    } catch (error) {
      console.error("Error generating Z-Report:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelZReport = () => setShowZConfirmModal(false);

  // Handle interval selection changes
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const interval = e.target.value;
    setSelectedInterval(interval);
    if (interval === "custom") {
      setXReportData(null);
      return;
    }
    const now = new Date();
    switch (interval) {
      case "pastHour":
        fetchXReport("pastHour");
        break;
      case "today":
        setStartDate(now.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        fetchXReport("today");
        break;
      case "thisWeek": {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        setStartDate(startOfWeek.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        fetchXReport("thisWeek");
        break;
      }
      case "thisMonth": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setStartDate(startOfMonth.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        fetchXReport("thisMonth");
        break;
      }
      case "thisYear": {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        setStartDate(startOfYear.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        fetchXReport("thisYear");
        break;
      }
      default:
        break;
    }
  };

  const handleCustomDateApply = () => {
    if (selectedInterval === "custom") {
      fetchXReport("custom");
    }
  };

  useEffect(() => {
    // On initial render, fetch the "today" X-Report
    fetchXReport("today");
  }, []);

  if(!employee || !employee.is_manager) {
    navigate("/signin");
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      {/* Interval Selection & Custom Date Inputs */}
      <div className="mb-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="interval-select" className="font-semibold">
            Select Time Interval:
          </label>
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

        {selectedInterval === "custom" && (
          <div className="flex flex-wrap items-center gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <XReport
          data={xReportData}
          loading={loading && !zReportGenerated}
          selectedInterval={selectedInterval}
          formatCurrency={formatCurrency}
          formatDateRange={formatDateRange}
        />
        <ZReport
          xData={xReportData}
          zData={zReportData}
          loading={loading}
          zReportGenerated={zReportGenerated}
          selectedInterval={selectedInterval}
          formatCurrency={formatCurrency}
          onShowZReportConfirmation={showZReportConfirmation}
        />
      </div>

      <div className="mt-8">
        <ChartPage />
      </div>

      {/* Z-Report Confirmation Modal */}
      {showZConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generate Z-Report
            </h3>
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Warning</p>
              <p className="text-sm">
                The Z-Report should only be run once per{" "}
                {selectedInterval === "today"
                  ? "day"
                  : selectedInterval === "thisWeek"
                  ? "week"
                  : selectedInterval === "thisMonth"
                  ? "month"
                  : "period"}
                , typically at the end of business. Generating a Z-Report will clear all current X-Report data.
              </p>
            </div>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelZReport}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={generateZReport}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium"
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

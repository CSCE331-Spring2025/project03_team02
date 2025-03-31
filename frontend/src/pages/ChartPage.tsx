import React, { useState } from "react";
import BarChartProducts from "../components/BarChartProducts";
import BarChartIngredients from "../components/BarChartIngredients";

const ChartPage: React.FC = () => {
  const [viewInterval, setViewInterval] = useState("day");

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewInterval(e.target.value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Charts</h2>
      <div className="mb-6">
        <label htmlFor="view-interval" className="mr-2 font-semibold">
          View Interval:
        </label>
        <select
          id="view-interval"
          value={viewInterval}
          onChange={handleViewChange}
          className="border p-2 rounded"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Products Used</h3>
        <BarChartProducts viewInterval={viewInterval} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Ingredients Used</h3>
        <BarChartIngredients viewInterval={viewInterval} />
      </div>
    </div>
  );
};

export default ChartPage;

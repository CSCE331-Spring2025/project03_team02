import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProductsProps {
  viewInterval: string;
}

interface IChartDataItem {
  label: string;
  value: number;
}

const BarChartProducts: React.FC<BarChartProductsProps> = ({ viewInterval }) => {
  const [chartData, setChartData] = useState<IChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getproductsusedchart`,
          {
            params: { interval: viewInterval },
          }
        );
        setChartData(res.data.data);
      } catch (error) {
        console.error("Error fetching products used chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [viewInterval]);

  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Products Used",
        data: chartData.map((item) => item.value),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Products Used" },
    },
  };

  return (
    <div>
      {loading ? (
        <p>Loading chart data...</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default BarChartProducts;

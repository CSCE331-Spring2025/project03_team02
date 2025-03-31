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

interface BarChartIngredientsProps {
  viewInterval: string;
}

interface IChartDataItem {
  label: string;
  value: number;
}

const BarChartIngredients: React.FC<BarChartIngredientsProps> = ({ viewInterval }) => {
  const [chartData, setChartData] = useState<IChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getingredientsusedchart`,
          {
            params: { interval: viewInterval },
          }
        );
        setChartData(res.data.data);
      } catch (error) {
        console.error("Error fetching ingredients used chart data:", error);
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
        label: "Ingredients Used",
        data: chartData.map((item) => item.value),
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Ingredients Used" },
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

export default BarChartIngredients;

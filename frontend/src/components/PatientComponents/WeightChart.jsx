import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
import { Line } from "react-chartjs-2";

// Register components (this prevents canvas reuse issues)
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const WeightChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: "Weight (kg)",
                data: data.map(item => item.weight),
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.3
            }
        ]
    };

    return <Line data={chartData} />;
};

export default WeightChart;

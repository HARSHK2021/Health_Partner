import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
import { Line } from "react-chartjs-2";

// Register components (this prevents canvas reuse issues)
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const BMIChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.date.split('T')[0]),
        datasets: [
            {
                label: "BMI",
                data: data.map(item => item.bmi),
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                tension: 0.3
            }
        ]
    };

    return <Line data={chartData} />;
};

export default BMIChart;

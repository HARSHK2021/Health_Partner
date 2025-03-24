import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);


const ConditionChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: "Diagnosed Conditions",
                data: Object.values(data),
                backgroundColor: "orange",
                borderColor: "darkorange",
                borderWidth: 1
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default ConditionChart;

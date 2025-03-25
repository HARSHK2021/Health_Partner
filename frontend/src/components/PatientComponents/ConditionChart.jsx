import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);
const conditionData = [
    { condition: "Diabetes", date: "2024-01-10" },
    { condition: "Hypertension", date: "2024-02-05" },
    { condition: "Asthma", date: "2024-03-15" },
    { condition: "Flu", date: "2024-03-20" },
    { condition: "COVID-19", date: "2024-04-01" },
    { condition: "Heart Disease", date: "2024-05-10" },
    { condition: "Flu", date: "2024-05-15" },
    { condition: "Hypertension", date: "2024-06-01" }
];
const processConditionData = (data) => {
    const groupedData = {};
    data.forEach(({ condition }) => {
        groupedData[condition] = (groupedData[condition] || 0) + 1;
    });
    return groupedData;
};

const ConditionChart = () => {
    const groupedData = processConditionData(conditionData);

    const chartData = {
        labels: Object.keys(groupedData), // Condition names
        datasets: [
            {
                label: "Diagnosed Conditions",
                data: Object.values(groupedData), // Frequency of each condition
                backgroundColor: "orange",
                borderColor: "darkorange",
                borderWidth: 1
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default ConditionChart;
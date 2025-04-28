import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const ConditionChart = () => {
    
    const [conditionData, setConditionData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchConditionData = async () => {
            try {
                setLoading(true);
                // Get token from localStorage
                const token = localStorage.getItem("token");
                const id = localStorage.getItem("id");
               
                
                if (!id) {
                  throw new Error("Ran Into an error while fetching your records");
                }
        
                if (!token) {
                  throw new Error("Authentication required");
                }
                const response = await axios.get(`${CMH_ROUTES.GET_MEDICAL_RECORD_BY_ID}/${id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      // id: id,
                    },
                    // params: {
                    //   id: id,
                    // },
                  });
                 
                  const transformed = response.data.map(record => ({
                    condition: record.condition,
                    date: record.dateDiagnosed
                }));
                setConditionData(transformed);
                setLoading(false);
        
            
            } catch (error) {
                console.error("Error fetching condition data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConditionData();
    }, []);

    const processConditionData = (data) => {
        const groupedData = {};
        data.forEach(({ condition }) => {
            groupedData[condition] = (groupedData[condition] || 0) + 1;
        });
        return groupedData;
    };

    if (loading) {
        return <div className="text-center font-bold text-lg">Loading...</div>;
    }

    if (conditionData.length === 0) {
        return <div className="text-center  justify-center font-bold text-2xl mt-10">No Data Exist</div>;
    }

    const groupedData = processConditionData(conditionData);
    const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: "Diagnosed Conditions",
                data: Object.values(groupedData),
                backgroundColor: "orange",
                borderColor: "darkorange",
                borderWidth: 1
            }
        ]
    };

    return (
        <Bar data={chartData} />
    );
};

export default ConditionChart;

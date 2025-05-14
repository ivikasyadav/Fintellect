import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SavingsRatio = ({ userId, profileId }) => {
    const [savingsRatio, setSavingsRatio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchSavingsRatio = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/networth/${userId}/${profileId}/savings-ratio`);
                setSavingsRatio(response.data); // assuming the response contains an array of savings ratio data
            } catch (error) {
                setError(error.response ? error.response.data.detail : "Error fetching savings ratio data");
            } finally {
                setLoading(false);
            }
        };

        fetchSavingsRatio();
    }, [userId, profileId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!savingsRatio) {
        return <div>No savings ratio data available</div>;
    }

    // Prepare data for the chart
    const years = savingsRatio.map(data => data.Year);
    const savingsRatios = savingsRatio.map(data => data["YoY Savings Ratio"]);

    // Chart.js data
    const data = {
        labels: years,
        datasets: [
            {
                label: 'YoY Savings Ratio',
                data: savingsRatios,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)', // Border color
                borderWidth: 1,
            },
        ],
    };

    // Chart.js options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Savings Ratio Over Time',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'YoY Savings Ratio (%)',
                },
                ticks: {
                    callback: function (value) {
                        return value.toFixed(2); // Format the Y-axis values
                    },
                },
            },
        },
    };

    return (
        <div className=''>
            <h2 >Savings Ratio</h2>
            <Bar data={data} options={options}  /> 
        </div>
    );
};

export default SavingsRatio;

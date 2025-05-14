import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ProjectedIncomeGraph = ({ userId, profileId }) => {
    const [projectedIncome, setProjectedIncome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    useEffect(() => {
        const fetchProjectedIncome = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/networth/${userId}/${profileId}/projected-income`);
                setProjectedIncome(response.data); // Assuming the response contains the projected income data
            } catch (error) {
                setError(error.response ? error.response.data.detail : "Error fetching projected income data");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectedIncome();
    }, [userId, profileId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!projectedIncome || projectedIncome.length === 0) {
        return <div>No projected income data available</div>;
    }

    return (
        <div>
            <h2>Projected Income</h2>
            <ResponsiveContainer width="100%" height={400}> {/* Set height to 400 */}
                <LineChart data={projectedIncome}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Income from Savings, Investments & Assets" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProjectedIncomeGraph;

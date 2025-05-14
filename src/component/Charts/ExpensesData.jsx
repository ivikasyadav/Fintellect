import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpensesData = ({ userId ,profileId}) => {
    const [expensesData, setExpensesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchExpensesData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/networth/${userId}/${profileId}/expenses`);
                setExpensesData(response.data); // assuming the response is the 'expenses' data
            } catch (error) {
                setError(error.response ? error.response.data.detail : "Error fetching expenses data");
            } finally {
                setLoading(false);
            }
        };

        fetchExpensesData();
    }, [userId, profileId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!expensesData) {
        return <div>No expenses data available</div>;
    }

    return (
        <div>
            <h2>Expenses Data</h2>
            <ResponsiveContainer width="100%" height={400}> {/* Set height to 400 */}
                <BarChart data={expensesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Expenses" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpensesData;

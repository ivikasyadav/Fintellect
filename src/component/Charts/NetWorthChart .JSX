import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const ProjectedIncomeChart = () => {
  const [projections, setProjections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = '245yadavjii@gmail.com';
  const profileId = 2;

  useEffect(() => {
    const fetchProjectedIncome = async () => {
      try {
        const encodedUserId = encodeURIComponent(userId);
        const response = await axios.get(
          `http://localhost:8000/networth/${encodedUserId}/${profileId}/projected-income`
        );
        setProjections(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch projected income.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectedIncome();
  }, [userId, profileId]);

  if (loading) return <div className="text-blue-600 p-4">Loading projected income...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Projected Income Chart</h2>
      <ResponsiveContainer width="100%" height={400}> {/* Set height to 400px */}
        <ComposedChart data={projections}>
          <CartesianGrid stroke="#f0f0f0" />
          <XAxis dataKey="Year" />
          <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
          <Legend />

          <Line
            type="monotone"
            dataKey="Income"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="Income from Savings, Investments & Assets"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="From Savings & Assets"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectedIncomeChart;

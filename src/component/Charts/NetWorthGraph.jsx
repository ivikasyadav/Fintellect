import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const NetWorthGraph = ({ userId, profileId }) => {
    const [netWorthData, setNetWorthData] = useState([]);
    const [netWorth, setNetWorth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNetWorthProjection = async () => {
            if (!userId || !profileId) return;

            try {
                const encodedUserId = encodeURIComponent(userId);

                const response = await fetch(`http://localhost:8000/networth/${encodedUserId}/${profileId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to calculate net worth.");
                }

                if (Array.isArray(data) && data.length > 0) {
                    const lastNetWorth = data[data.length - 1].NetWorth;
                    setNetWorth(lastNetWorth);
                    setNetWorthData(data);
                } else {
                    setNetWorth(0);
                    setNetWorthData([]);
                }
            } catch (err) {
                console.error("Net worth fetch error:", err);
                setError("Unable to fetch net worth projections.");
                setNetWorth(0);
                setNetWorthData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNetWorthProjection();
    }, [userId, profileId]);

    if (loading) return <p>Loading net worth projections...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h3>Net Worth Projection</h3>
            {netWorthData.length === 0 ? (
                <p>No projection data available.</p>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={netWorthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="NetWorth" stroke="#004aad" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}
            <p><strong>Final Projected Net Worth:</strong> ₹{netWorth.toLocaleString()}</p>
        </div>
    );
};

export default NetWorthGraph;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavingsRatio = () => {
    const [savingsRatio, setSavingsRatio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId ='245yadavjii@gmail.com'
    const profileId=1

    // Define the base URL as a constant
    const API_URL = `http://localhost:8000/networth/${userId}/${profileId}/savings-ratio`;

    useEffect(() => {
        const fetchSavingsRatio = async () => {
            try {
                const response = await axios.get(API_URL);
                setSavingsRatio(response.data);  // Assuming the backend sends the savings ratio as JSON data
                console.log(response.data)
            } catch (err) {
                console.log("1")
                setError(err.response ? err.response.data.detail : 'Error fetching savings ratio');
            } finally {
                setLoading(false);
            }
        };

        fetchSavingsRatio();
    }, [API_URL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (savingsRatio === null) {
        return <div>No savings ratio available</div>;
    }

    return (
        <div>
            <h2>Savings Ratio</h2>
            <p>{`Savings Ratio: ${savingsRatio}`}</p>
        </div>
    );
};

export default SavingsRatio;

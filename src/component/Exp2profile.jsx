import React, { useState } from 'react';

const ExportNetWorth = ({ userId, profileId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Make the request to the FastAPI endpoint
            const response = await fetch(`/networth/${userId}/${profileId}/export`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to export net worth');
            }

            // Extract the file blob
            const blob = await response.blob();

            // Create a temporary URL for the blob to trigger a download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'net_worth_projection.xlsx'; // Filename for the downloaded file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleExport} disabled={isLoading}>
                {isLoading ? 'Exporting...' : 'Export Net Worth'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ExportNetWorth;

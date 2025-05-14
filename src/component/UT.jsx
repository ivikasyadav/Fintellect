import React, { useState } from 'react';
import axios from 'axios';

const UpdateTransaction = () => {
    const [transactionId, setTransactionId] = useState('');
    const [column, setColumn] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!transactionId || !column || !value) {
            setError('All fields are required.');
            return;
        }

        try {
            // Note: backend reads these as query parameters
            const response = await axios.put(
                'http://localhost:8000/update-transaction/',
                null,
                {
                    params: {
                        transaction_id: transactionId,
                        set_column: column,
                        set_value: value,
                    },
                }
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update transaction.');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Update Transaction</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <input
                    type="number"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Column to update (e.g. amount, category)"
                    value={column}
                    onChange={e => setColumn(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="New value"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                    Update
                </button>
            </form>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default UpdateTransaction;

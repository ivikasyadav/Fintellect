import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';

const DeleteTransactions = ({ onDelete }) => {
    const { user } = useAuth();
    const userEmail = user?.email || '';

    const [bank, setBank] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const banks = ['HDFC Bank', 'Axis Bank', 'Bank3', 'All']; // Modify according to your actual bank list

    const handleDelete = async () => {
        setMessage('');
        setError('');

        if (!userEmail || !bank || !startDate || !endDate) {
            setError('All fields are required.');
            return;
        }

        // Check if start date is before end date
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date.');
            return;
        }

        try {
            const response = await axios.delete('http://localhost:8000/delete-transactions/', {
                params: {
                    user_email: userEmail,
                    bank,
                    start_date: startDate,
                    end_date: endDate,
                },
            });
            setMessage(response.data.message || 'Transactions deleted successfully.');
            onDelete?.(); // refresh
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete transactions.');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete Transactions</h2>
            <p className="text-sm text-gray-600 mb-4">Please select the bank and date range to delete transactions.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Bank Dropdown */}
                <div>
                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <select
                        id="bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    >
                        <option value="">Select Bank</option>
                        {banks.map((bankOption, index) => (
                            <option key={index} value={bankOption}>{bankOption}</option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>
            </div>

            <button
                onClick={handleDelete}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                Delete Transactions
            </button>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default DeleteTransactions;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useTransactionContext } from '../context/TransactionContext ';
import { useAuth } from '../context/Authcontext';

const CategoryWiseChart = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [creditView, setCreditView] = useState(null);
    const [debitView, setDebitView] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bank, setBank] = useState('All');
    const [banks, setBanks] = useState(['All', 'HDFC Bank', 'Axis Bank', 'Bank3']);
    const [creditTransactions, setCreditTransactions] = useState([]);
    const [debitTransactions, setDebitTransactions] = useState([]);

    const { user } = useAuth();
    const userEmail = user?.email;
    const { transactionsChanged } = useTransactionContext();

    const fetchData = useCallback(async () => {
        if (!userEmail) return;
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/get-category-wise-credit-debit/', {
                params: { user_email: userEmail, bank },
            });
            setCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching category-wise data:', error);
        } finally {
            setLoading(false);
        }
    }, [userEmail, bank]);

    useEffect(() => {
        fetchData();
    }, [fetchData, transactionsChanged]);

    const fetchTransactions = async (category, type) => {
        try {
            const response = await axios.get('http://localhost:8000/get-transaction-for-category/', {
                params: { user_email: userEmail, bank, category },
            });
            const sorted = response.data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            type === 'credit' ? setCreditTransactions(sorted) : setDebitTransactions(sorted);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleBarClick = (data, type) => {
        const category = data?.activeLabel;
        if (category) {
            fetchTransactions(category, type);
            type === 'credit' ? setCreditView(category) : setDebitView(category);
        }
    };

    const handleBack = (type) => {
        type === 'credit' ? setCreditView(null) : setDebitView(null);
        type === 'credit' ? setCreditTransactions([]) : setDebitTransactions([]);
    };

    const handleBankChange = (e) => {
        setBank(e.target.value);
        setCreditView(null);
        setDebitView(null);
        setCreditTransactions([]);
        setDebitTransactions([]);
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Category-wise Credit and Debit</h2>

            <div className="mb-6">
                <label htmlFor="bank" className="block text-lg text-gray-700 mb-2">Select Bank:</label>
                <select
                    id="bank"
                    value={bank}
                    onChange={handleBankChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {banks.map((bankOption, index) => (
                        <option key={index} value={bankOption}>{bankOption}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Credit Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-medium text-green-600">
                            {creditView ? `Credit Transactions for ${creditView}` : 'Total Credit by Category'}
                        </h3>
                        {creditView && <button onClick={() => handleBack('credit')} className="text-sm text-indigo-600 hover:underline">⬅ Back</button>}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {creditView ? (
                            <BarChart data={creditTransactions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Bar dataKey="Credit" fill="#4ade80" />
                            </BarChart>
                        ) : (
                            <BarChart data={categoryData} onClick={(d) => handleBarClick(d, 'credit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Bar dataKey="total_credit" fill="#4ade80" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Debit Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-medium text-red-600">
                            {debitView ? `Debit Transactions for ${debitView}` : 'Total Debit by Category'}
                        </h3>
                        {debitView && <button onClick={() => handleBack('debit')} className="text-sm text-indigo-600 hover:underline">⬅ Back</button>}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {debitView ? (
                            <BarChart data={debitTransactions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Bar dataKey="Debit" fill="#f87171" />
                            </BarChart>
                        ) : (
                            <BarChart data={categoryData} onClick={(d) => handleBarClick(d, 'debit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Bar dataKey="total_debit" fill="#f87171" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CategoryWiseChart;

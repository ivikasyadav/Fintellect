import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useTransactionContext } from '../context/TransactionContext ';
import { useAuth } from '../context/Authcontext';

const YearWiseCreditDebit = () => {
    const [data, setData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [creditView, setCreditView] = useState(null);
    const [debitView, setDebitView] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bank, setBank] = useState('All');
    const [banks, setBanks] = useState(['All', 'HDFC Bank', 'Axis Bank', 'Bank3']);

    const { user } = useAuth();
    const userEmail = user?.email || '';
    const { transactionsChanged } = useTransactionContext();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/get-year-wise-credit-debit/', {
                params: { user_email: userEmail, bank },
            });
            setData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching year-wise data:", error);
        } finally {
            setLoading(false);
        }
    }, [userEmail, bank]);

    useEffect(() => {
        fetchData();
    }, [transactionsChanged, fetchData]);

    const fetchCategoryData = async (year, type) => {
        try {
            const response = await axios.get('http://localhost:8000/get-category-wise-credit-debit-for-year/', {
                params: { user_email: userEmail, bank }
            });
            const filtered = response.data.filter(item => item.year === year);
            setCategoryData(filtered);
            type === 'credit' ? setCreditView(year) : setDebitView(year);
            setSelectedType(type);
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    const handleBack = (type) => {
        type === 'credit' ? setCreditView(null) : setDebitView(null);
        setCategoryData([]);
    };

    const handleBankChange = (e) => {
        setBank(e.target.value);
        setCreditView(null);
        setDebitView(null);
        setCategoryData([]);
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Year-wise Credit and Debit Summary</h2>

            <div className="mb-6">
                <label htmlFor="bank" className="block text-lg text-gray-700 mb-2">Select Bank:</label>
                <select
                    id="bank"
                    value={bank}
                    onChange={handleBankChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {banks.map((b, index) => (
                        <option key={index} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Credit */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-medium text-green-600">
                            {creditView ? `Credit by Category in ${creditView}` : 'Total Credit by Year'}
                        </h3>
                        {creditView && <button onClick={() => handleBack('credit')} className="text-sm text-indigo-600 hover:underline">⬅ Back</button>}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {creditView ? (
                            <BarChart data={categoryData.filter(item => item.year === creditView)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_credit" fill="#4ade80" />
                            </BarChart>
                        ) : (
                            <BarChart data={data} onClick={(d) => fetchCategoryData(d.activeLabel, 'credit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_credit" fill="#4ade80" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Debit */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-medium text-red-600">
                            {debitView ? `Debit by Category in ${debitView}` : 'Total Debit by Year'}
                        </h3>
                        {debitView && <button onClick={() => handleBack('debit')} className="text-sm text-indigo-600 hover:underline">⬅ Back</button>}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        {debitView ? (
                            <BarChart data={categoryData.filter(item => item.year === debitView)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_debit" fill="#f87171" />
                            </BarChart>
                        ) : (
                            <BarChart data={data} onClick={(d) => fetchCategoryData(d.activeLabel, 'debit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_debit" fill="#f87171" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default YearWiseCreditDebit;

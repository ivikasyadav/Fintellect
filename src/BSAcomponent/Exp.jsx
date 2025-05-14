import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CategoryWiseTransactions = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCreditCategory, setSelectedCreditCategory] = useState(null);
    const [selectedDebitCategory, setSelectedDebitCategory] = useState(null);
    const [creditTransactions, setCreditTransactions] = useState([]);
    const [debitTransactions, setDebitTransactions] = useState([]);
    const [creditLoading, setCreditLoading] = useState(false);
    const [debitLoading, setDebitLoading] = useState(false);
    const [bank, setBank] = useState('All');
    const [loading, setLoading] = useState(true);
    const [banks] = useState(['All', 'HDFC Bank', 'Axis Bank', 'Bank3']);

    const userEmail = '245yadavjii@gmail.com';

    useEffect(() => {
        const fetchCategoryData = async () => {
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
        };

        fetchCategoryData();
    }, [bank, userEmail]);

    const fetchTransactions = async (category, type) => {
        if (type === 'credit') setCreditLoading(true);
        else setDebitLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/get-transaction-for-category/', {
                params: { user_email: userEmail, bank, category },
            });

            const sorted = response.data.sort((a, b) => new Date(a.Date) - new Date(b.Date));

            if (type === 'credit') {
                setCreditTransactions(sorted);
                setSelectedCreditCategory(category);
            } else {
                setDebitTransactions(sorted);
                setSelectedDebitCategory(category);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Failed to fetch transactions.');
        } finally {
            if (type === 'credit') setCreditLoading(false);
            else setDebitLoading(false);
        }
    };

    const handleCategoryClick = (data, type) => {
        if (data?.activeLabel) {
            fetchTransactions(data.activeLabel, type);
        }
    };

    const handleBankChange = (e) => {
        setBank(e.target.value);
        setSelectedCreditCategory(null);
        setSelectedDebitCategory(null);
        setCreditTransactions([]);
        setDebitTransactions([]);
    };

    const maxYValue = Math.max(
        ...categoryData.map((item) => item.total_credit || 0),
        ...categoryData.map((item) => item.total_debit || 0)
    );

    if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#004aad]">Category-wise Credit and Debit</h2>

            <div className="mb-6">
                <label className="mr-2 font-medium">Select Bank:</label>
                <select
                    value={bank}
                    onChange={handleBankChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                    {banks.map((b, i) => (
                        <option key={i} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* CREDIT */}
                <div className="flex-1 bg-white rounded-xl shadow p-4">
                    <h3 className="text-lg font-medium text-green-700 mb-3">
                        {selectedCreditCategory
                            ? `Credit Transactions for ${selectedCreditCategory}`
                            : 'Total Credit by Category'}
                    </h3>
                    {selectedCreditCategory ? (
                        <>
                            <button onClick={() => {
                                setSelectedCreditCategory(null);
                                setCreditTransactions([]);
                            }} className="text-sm text-indigo-600 hover:underline mb-2">⬅ Back</button>
                            {creditLoading ? (
                                <div className="text-lg text-gray-600">Loading transactions...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={creditTransactions}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="Date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                        <Bar dataKey="Credit" fill="#4ade80" name="Credit" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData} onClick={(data) => handleCategoryClick(data, 'credit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis domain={[0, maxYValue]} />
                                <Tooltip />
                                <Bar dataKey="total_credit" fill="#4ade80" name="Credit" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* DEBIT */}
                <div className="flex-1 bg-white rounded-xl shadow p-4">
                    <h3 className="text-lg font-medium text-red-700 mb-3">
                        {selectedDebitCategory
                            ? `Debit Transactions for ${selectedDebitCategory}`
                            : 'Total Debit by Category'}
                    </h3>
                    {selectedDebitCategory ? (
                        <>
                            <button onClick={() => {
                                setSelectedDebitCategory(null);
                                setDebitTransactions([]);
                            }} className="text-sm text-indigo-600 hover:underline mb-2">⬅ Back</button>
                            {debitLoading ? (
                                <div className="text-lg text-gray-600">Loading transactions...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={debitTransactions}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="Date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                        <Bar dataKey="Debit" fill="#f87171" name="Debit" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData} onClick={(data) => handleCategoryClick(data, 'debit')}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Category" />
                                <YAxis domain={[0, maxYValue]} />
                                <Tooltip />
                                <Bar dataKey="total_debit" fill="#f87171" name="Debit" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryWiseTransactions;

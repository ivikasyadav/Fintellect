import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useProfile } from '../context/ProfileContext';
import { Edit, Trash2 } from "lucide-react";

const InvestmentsAssets = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [investments, setInvestments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const [newInvestment, setNewInvestment] = useState({
        investment_type: '',
        amount: "",
        start_date: '',
        end_date: '',
        rate_of_return: "",
    });

    useEffect(() => {
        if (user && selectedProfile?.id) {
            fetchInvestments(user.email, selectedProfile.id);
        }
    }, [user, selectedProfile]);

    const fetchInvestments = async (email, profileId) => {
        try {
            const res = await axios.get(`http://localhost:8000/investments/${email}/${profileId}`);
            setInvestments(res.data);
        } catch (err) {
            console.error('Error fetching investments:', err);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!newInvestment.investment_type) newErrors.investment_type = 'Investment type is required';
        if (newInvestment.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
        if (!newInvestment.start_date) newErrors.start_date = 'Start date is required';
        if (!newInvestment.end_date) newErrors.end_date = 'End date is required';
        if (new Date(newInvestment.start_date) > new Date(newInvestment.end_date)) {
            newErrors.end_date = 'End date must be after start date';
        }
        if (newInvestment.rate_of_return < 0) {
            newErrors.rate_of_return = 'Return rate cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddInvestment = async () => {
        if (!user || !selectedProfile?.id) return;
        if (!validateForm()) return;

        try {
            const res = await axios.post('http://localhost:8000/investments', {
                ...newInvestment,
                user_id: user.email,
                profile_id: selectedProfile.id,
            });
            setInvestments([...investments, res.data]);
            resetForm();
        } catch (err) {
            console.error('Error adding investment:', err);
        }
    };

    const handleUpdateInvestment = async () => {
        if (!validateForm()) return;
        if (!user || !selectedProfile?.id || !editingId) return;

        try {
            const res = await axios.put(`http://localhost:8000/investments/${editingId}`, {
                ...newInvestment,
                user_id: user.email,
                profile_id: selectedProfile.id,
            });
            setInvestments(investments.map((inv) => (inv.id === editingId ? res.data : inv)));
            resetForm();
        } catch (err) {
            console.error('Error updating investment:', err);
        }
    };

    const handleDeleteInvestment = async (investmentId) => {
        if (!user || !selectedProfile?.id) return;
        try {
            await axios.delete(`http://localhost:8000/investments/${user.email}/${investmentId}`);
            setInvestments(investments.filter((inv) => inv.id !== investmentId));
        } catch (err) {
            console.error('Error deleting investment:', err);
        }
    };

    const startEditing = (investment) => {
        setNewInvestment({ ...investment });
        setEditingId(investment.id);
        setErrors({});
    };

    const resetForm = () => {
        setNewInvestment({
            investment_type: '',
            amount: 0,
            start_date: '',
            end_date: '',
            rate_of_return: 0,
        });
        setEditingId(null);
        setErrors({});
    };

    return (
        <div className=" mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-[#004aad]">Investments</h2>

            <div className="bg-gradient-to-r from-blue-50 to-white p-6 shadow rounded-2xl mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold text-[#004aad] mb-4">
                    {editingId ? 'Edit Investment' : 'Add New Investment'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="investment_type">
                            Investment Type
                        </label>
                        <select
                            id="investment_type"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.investment_type ? 'border-red-500' : 'border-gray-300'}`}
                            value={newInvestment.investment_type}
                            onChange={(e) => setNewInvestment({ ...newInvestment, investment_type: e.target.value })}
                        >
                            <option value="">Select investment type</option>
                            <option value="Stocks">Stocks</option>
                            <option value="Bonds">Bonds</option>
                            <option value="Mutual Funds">Mutual Funds</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Gold">Gold</option>
                            <option value="FD">FD</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Others">Others</option>
                        </select>
                        {errors.investment_type && <p className="text-red-500 text-sm">{errors.investment_type}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="amount">
                            Amount
                        </label>
                        <input
                            id="amount"
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                            value={newInvestment.amount}
                            onChange={(e) =>
                                setNewInvestment({ ...newInvestment, amount: parseFloat(e.target.value) || 0 })
                            }
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="start_date">
                            Start Date
                        </label>
                        <input
                            id="start_date"
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newInvestment.start_date}
                            onChange={(e) => setNewInvestment({ ...newInvestment, start_date: e.target.value })}
                        />
                        {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="end_date">
                            End Date
                        </label>
                        <input
                            id="end_date"
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newInvestment.end_date}
                            onChange={(e) => setNewInvestment({ ...newInvestment, end_date: e.target.value })}
                        />
                        {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="rate_of_return">
                            Rate of Return (%)
                        </label>
                        <input
                            id="rate_of_return"
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.rate_of_return ? 'border-red-500' : 'border-gray-300'}`}
                            value={newInvestment.rate_of_return}
                            onChange={(e) =>
                                setNewInvestment({
                                    ...newInvestment,
                                    rate_of_return: parseFloat(e.target.value) || 0,
                                })
                            }
                        />
                        {errors.rate_of_return && <p className="text-red-500 text-sm">{errors.rate_of_return}</p>}
                    </div>
                    <div className="col-span-full flex items-center pt-2 gap-4">
                        <button
                            onClick={editingId ? handleUpdateInvestment : handleAddInvestment}
                            className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                        >
                            {editingId ? 'Update Investment' : 'Add Investment'}
                        </button>
                        {editingId && (
                            <button onClick={resetForm} className="text-gray-500 hover:underline ml-4">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <h3 className="text-xl font-semibold mb-3 text-[#004aad]">Investments List</h3>
                {investments.length === 0 ? (
                    <p className="text-gray-500">No investments found</p>
                ) : (
                    <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Start Date</th>
                                <th className="px-4 py-2 text-left">End Date</th>
                                <th className="px-4 py-2 text-left">Return Rate</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investments.map((inv, idx) => (
                                <tr key={inv.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                    <td className="px-4 py-2">{inv.investment_type}</td>
                                    <td className="px-4 py-2">{inv.amount}</td>
                                    <td className="px-4 py-2">{inv.start_date}</td>
                                    <td className="px-4 py-2">{inv.end_date}</td>
                                    <td className="px-4 py-2">{inv.rate_of_return}%</td>
                                    <td className="px-4 py-2 space-x-2">
                                        {/* <button
                                            onClick={() => startEditing(inv)}
                                            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteInvestment(inv.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button> */}



                                        <button onClick={() => startEditing(inv)} className="text-blue-500 focus:outline-none">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteInvestment(inv.id)} className="text-red-500 ml-2 focus:outline-none">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.6s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: none;}
                }
            `}</style>
        </div>
    );
};

export default InvestmentsAssets;
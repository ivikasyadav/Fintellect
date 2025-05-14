import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useProfile } from '../context/ProfileContext';
import { Edit, Trash2 } from "lucide-react";

const ExpIncome = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();
    const [incomes, setIncomes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [newIncome, setNewIncome] = useState({
        source: '',
        value: 0,
        frequency: 'Monthly',
        start_date: '',
        end_date: '',
        growth_rate: 0
    });

    useEffect(() => {
        if (user && selectedProfile?.id) {
            fetchIncomes(user.email, selectedProfile.id);
        }
    }, [user, selectedProfile]);

    const fetchIncomes = async (email, profileId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/incomes/${email}/${profileId}`);
            setIncomes(response.data);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
        setLoading(false);
    };

    const validateIncome = () => {
        const newErrors = {};

        if (!newIncome.source) newErrors.source = "Source is required.";
        if (!newIncome.value || newIncome.value <= 0) newErrors.value = "Value must be greater than zero.";
        if (!newIncome.frequency) newErrors.frequency = "Frequency is required.";
        if (!newIncome.start_date) newErrors.start_date = "Start date is required.";
        if (!newIncome.end_date) newErrors.end_date = "End date is required.";

        if (
            newIncome.start_date &&
            newIncome.end_date &&
            new Date(newIncome.start_date) > new Date(newIncome.end_date)
        ) {
            newErrors.date = "Start date should be before end date.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddIncome = async () => {
        if (!user || !selectedProfile) return;
        if (!validateIncome()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/incomes', {
                ...newIncome,
                user_id: user.email,
                profile_id: selectedProfile.id
            });
            setIncomes([...incomes, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding income:', error);
        }
        setLoading(false);
    };

    const handleUpdateIncome = async () => {
        if (!validateIncome()) return;

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8000/incomes/${editingId}`, newIncome);
            setIncomes(incomes.map(income => income.id === editingId ? response.data : income));
            resetForm();
        } catch (error) {
            console.error('Error updating income:', error);
        }
        setLoading(false);
    };

    const handleDeleteIncome = async (incomeId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/incomes/${user.email}/${incomeId}`);
            setIncomes(incomes.filter(income => income.id !== incomeId));
        } catch (error) {
            console.error('Error deleting income:', error);
        }
        setLoading(false);
    };

    const startEditing = (income) => {
        setNewIncome({ ...income });
        setEditingId(income.id);
        setErrors({});
    };

    const resetForm = () => {
        setNewIncome({
            source: '',
            value: 0,
            frequency: 'Monthly',
            start_date: '',
            end_date: '',
            growth_rate: 0
        });
        setEditingId(null);
        setErrors({});
    };

    const formatFrequency = (frequency) => {
        switch (frequency) {
            case 'BiWeekly':
                return 'Bi-Weekly';
            case 'HalfYearly':
                return 'Half-Yearly';
            default:
                return frequency;
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-[#004aad]">Incomes</h2>

            <div className="bg-gradient-to-r from-blue-50 to-white p-6 shadow rounded-2xl mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold text-[#004aad] mb-4">
                    {editingId ? 'Edit Income' : 'Add New Income'}
                </h3>
                <form
                    className='grid grid-cols-1 md:grid-cols-2 gap-5'
                    onSubmit={e => {
                        e.preventDefault();
                        editingId ? handleUpdateIncome() : handleAddIncome();
                    }}
                    autoComplete="off"
                >
                    <div>
                        <label htmlFor="source" className="block text-gray-700 font-medium mb-1">Source</label>
                        <select
                            id="source"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.source ? 'border-red-500' : 'border-gray-300'}`}
                            value={newIncome.source}
                            onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                        >
                            <option value="">Select Source</option>
                            <option value="Salary">Salary</option>
                            <option value="Business Income">Business Income</option>
                            <option value="Bonuses & Commission">Bonuses & Commission</option>
                            <option value="Freelancing">Freelancing</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Dividends">Dividends</option>
                            <option value="Royalties">Royalties</option>
                            <option value="Others">Others</option>
                        </select>
                        {errors.source && <p className="text-red-500 text-sm">{errors.source}</p>}
                    </div>

                    <div>
                        <label htmlFor="value" className="block text-gray-700 font-medium mb-1">Value</label>
                        <input
                            id="value"
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
                            value={newIncome.value}
                            onChange={(e) => setNewIncome({ ...newIncome, value: parseFloat(e.target.value) })}
                        />
                        {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
                    </div>

                    <div>
                        <label htmlFor="start_date" className="block text-gray-700 font-medium mb-1">Start Date</label>
                        <input
                            id="start_date"
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newIncome.start_date}
                            onChange={(e) => setNewIncome({ ...newIncome, start_date: e.target.value })}
                        />
                        {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                    </div>

                    <div>
                        <label htmlFor="end_date" className="block text-gray-700 font-medium mb-1">End Date</label>
                        <input
                            id="end_date"
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newIncome.end_date}
                            onChange={(e) => setNewIncome({ ...newIncome, end_date: e.target.value })}
                        />
                        {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    <div>
                        <label htmlFor="frequency" className="block text-gray-700 font-medium mb-1">Frequency</label>
                        <select
                            id="frequency"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${errors.frequency ? 'border-red-500' : 'border-gray-300'}`}
                            value={newIncome.frequency}
                            onChange={(e) => setNewIncome({ ...newIncome, frequency: e.target.value })}
                        >
                            <option value="">Select Frequency</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="BiWeekly">Bi-Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="HalfYearly">Half-Yearly</option>
                            <option value="Annual">Annual</option>
                        </select>
                        {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
                    </div>

                    <div>
                        <label htmlFor="growth_rate" className="block text-gray-700 font-medium mb-1">Growth Rate (%)</label>
                        <input
                            id="growth_rate"
                            type="number"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] border-gray-300"
                            value={newIncome.growth_rate}
                            onChange={(e) => setNewIncome({ ...newIncome, growth_rate: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="flex items-center pt-2 col-span-full gap-4">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                            disabled={loading}
                        >
                            {editingId ? 'Update Income' : 'Add Income'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>
                        )}
                        {loading && (
                            <span className="ml-4 text-blue-500 animate-pulse">Saving...</span>
                        )}
                    </div>
                </form>
            </div>

            {/* Incomes Table */}
            <div className="overflow-x-auto">
                <h3 className="text-xl font-semibold mb-3 text-[#004aad]">Incomes List</h3>
                {loading ? (
                    <div className="py-8 text-center text-blue-500 font-semibold">Loading...</div>
                ) : incomes.length === 0 ? (
                    <p className="text-gray-500">No incomes found</p>
                ) : (
                    <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Source</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Frequency</th>
                                <th className="px-4 py-2 text-left">Start Date</th>
                                <th className="px-4 py-2 text-left">End Date</th>
                                <th className="px-4 py-2 text-left">Growth Rate</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((income, idx) => (
                                <tr key={income.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-4 py-2">{income.source}</td>
                                    <td className="px-4 py-2">${income.value.toFixed(2)}</td>
                                    <td className="px-4 py-2">{formatFrequency(income.frequency)}</td>
                                    <td className="px-4 py-2">{income.start_date}</td>
                                    <td className="px-4 py-2">{income.end_date}</td>
                                    <td className="px-4 py-2">{income.growth_rate}%</td>
                                    <td className="px-4 py-2">
                                        {/* <button
                                            onClick={() => startEditing(income)}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteIncome(income.id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button> */}
                                        <button onClick={() => startEditing(income)} className="text-blue-500 focus:outline-none">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteIncome(income.id)} className="text-red-500 ml-2 focus:outline-none">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ExpIncome;

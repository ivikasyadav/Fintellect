import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useProfile } from '../context/ProfileContext';
import { Edit, Trash2 } from "lucide-react";

const ExpensesSection = () => {
    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [newExpense, setNewExpense] = useState({
        expense_type: '',
        value: "",
        frequency: 'BiWeekly',
        start_date: '',
        end_date: '',
        inflation_rate: ""
    });

    const [savingRate, setSavingRate] = useState('');
    const [savings, setSavings] = useState([]);

    const [expenseErrors, setExpenseErrors] = useState({});
    const [savingError, setSavingError] = useState('');

    useEffect(() => {
        if (user && selectedProfile?.id) {
            fetchExpenses(user.email, selectedProfile.id);
            fetchSavings(user.email, selectedProfile.id);
        }
    }, [user, selectedProfile]);

    const fetchExpenses = async (email, profileId) => {
        try {
            const response = await axios.get(`http://localhost:8000/expenses/${email}/${profileId}`);
            console.log('Fetched expenses:', response.data);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error.response?.data || error.message);
        }
    };

    const fetchSavings = async (email, profileId) => {
        try {
            const response = await axios.get(`http://localhost:8000/savings/${email}/${profileId}`);
            setSavings(response.data);
        } catch (error) {
            console.error('Error fetching savings:', error);
        }
    };

    const validateExpense = () => {
        const errors = {};
        const { expense_type, value, frequency, start_date, end_date, inflation_rate } = newExpense;
        const validFrequencies = ['Daily', 'Weekly', 'BiWeekly', 'Monthly', 'Quarterly', 'HalfYearly', 'Annual'];

        if (!expense_type.trim()) errors.expense_type = 'Expense type is required.';
        if (!value || value <= 0) errors.value = 'Value must be a positive number.';
        if (!frequency) errors.frequency = 'Frequency is required.';
        else if (!validFrequencies.includes(frequency)) errors.frequency = 'Invalid frequency value.';
        if (!start_date) errors.start_date = 'Start date is required.';
        if (!end_date) errors.end_date = 'End date is required.';
        if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
            errors.end_date = 'End date must be after start date.';
        }
        if (inflation_rate < 0) errors.inflation_rate = 'Inflation rate must be 0 or more.';

        setExpenseErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateSaving = () => {
        const rate = parseFloat(savingRate);
        if (isNaN(rate) || rate < 0 || rate > 100) {
            setSavingError('Saving rate must be between 0 and 100.');
            return false;
        }
        setSavingError('');
        return true;
    };

    const handleAddExpense = async () => {
        if (!user || !selectedProfile?.id || !validateExpense()) return;

        const payload = {
            ...newExpense,
            user_id: user.email,
            profile_id: selectedProfile.id
        };

        console.log('Sending expense data:', payload);

        try {
            const response = await axios.post('http://localhost:8000/expenses', payload);
            console.log('Add expense response:', response.data);
            setExpenses([...expenses, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding expense:', error.response?.data || error.message);
        }
    };

    const handleUpdateExpense = async () => {
        if (!user || !selectedProfile?.id || !validateExpense() || !editingId) return;

        try {
            const response = await axios.put(`http://localhost:8000/expenses/${editingId}`, {
                ...newExpense,
                user_id: user.email,
                profile_id: selectedProfile.id
            });
            setExpenses(expenses.map(exp => exp.id === editingId ? response.data : exp));
            resetForm();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!user || !selectedProfile?.id) return;
        try {
            await axios.delete(`http://localhost:8000/expenses/${user.email}/${id}`);
            setExpenses(expenses.filter(exp => exp.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleSaveSaving = async () => {
        if (!user || !selectedProfile?.id || !validateSaving()) return;

        const payload = {
            user_id: user.email,
            profile_id: selectedProfile.id,
            saving_rate: parseFloat(savingRate)
        };

        try {
            const response = await axios.post('http://localhost:8000/savings', payload);
            setSavings([...savings, response.data]);
            setSavingRate('');
        } catch (error) {
            console.error('Error saving rate:', error);
        }
    };

    const handleDeleteSaving = async (id) => {
        if (!user || !selectedProfile?.id) return;
        try {
            await axios.delete(`http://localhost:8000/savings/${user.email}/${id}`);
            setSavings(savings.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting saving:', error);
        }
    };

    const startEditing = (expense) => {
        setNewExpense({ ...expense });
        setEditingId(expense.id);
    };

    const resetForm = () => {
        setNewExpense({
            expense_type: '',
            value: 0,
            frequency: 'BiWeekly',
            start_date: '',
            end_date: '',
            inflation_rate: 0
        });
        setExpenseErrors({});
        setEditingId(null);
    };

    const formatFrequency = (frequency) => {
        if (frequency === 'BiWeekly') return 'Bi-Weekly';
        if (frequency === 'HalfYearly') return 'Half-Yearly';
        return frequency;
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-[#004aad]">Expense & Saving Manager</h2>

            {/* Expense Form */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 shadow rounded-2xl mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold text-[#004aad] mb-4">
                    {editingId ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Expense Type</label>
                        <input
                            type="text"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.expense_type ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.expense_type}
                            onChange={(e) => setNewExpense({ ...newExpense, expense_type: e.target.value })}
                        />
                        {expenseErrors.expense_type && <p className="text-red-500 text-sm">{expenseErrors.expense_type}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Value</label>
                        <input
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.value ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.value}
                            onChange={(e) => setNewExpense({ ...newExpense, value: parseFloat(e.target.value) || 0 })}
                        />
                        {expenseErrors.value && <p className="text-red-500 text-sm">{expenseErrors.value}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                        <input
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.start_date}
                            onChange={(e) => setNewExpense({ ...newExpense, start_date: e.target.value })}
                        />
                        {expenseErrors.start_date && <p className="text-red-500 text-sm">{expenseErrors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">End Date</label>
                        <input
                            type="date"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.end_date}
                            onChange={(e) => setNewExpense({ ...newExpense, end_date: e.target.value })}
                        />
                        {expenseErrors.end_date && <p className="text-red-500 text-sm">{expenseErrors.end_date}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Frequency</label>
                        <select
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.frequency ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.frequency}
                            onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value })}
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
                        {expenseErrors.frequency && <p className="text-red-500 text-sm">{expenseErrors.frequency}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Inflation Rate (%)</label>
                        <input
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${expenseErrors.inflation_rate ? 'border-red-500' : 'border-gray-300'}`}
                            value={newExpense.inflation_rate}
                            onChange={(e) => setNewExpense({ ...newExpense, inflation_rate: parseFloat(e.target.value) || 0 })}
                        />
                        {expenseErrors.inflation_rate && <p className="text-red-500 text-sm">{expenseErrors.inflation_rate}</p>}
                    </div>
                    
                    <div className="col-span-full flex items-center pt-2 gap-4">
                        <button
                            onClick={editingId ? handleUpdateExpense : handleAddExpense}
                            className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                        >
                            {editingId ? 'Update Expense' : 'Add Expense'}
                        </button>
                        {editingId && (
                            <button onClick={resetForm} className="text-gray-500 hover:underline">Cancel</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expense List */}
            <div className="overflow-x-auto mb-10">
                <h3 className="text-xl font-semibold mb-3 text-[#004aad]">Expenses List</h3>
                {expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses found</p>
                ) : (
                    <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Frequency</th>
                                <th className="px-4 py-2 text-left">Start Date</th>
                                <th className="px-4 py-2 text-left">End Date</th>
                                <th className="px-4 py-2 text-left">Inflation Rate</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, idx) => (
                                <tr key={expense.id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                    <td className="px-4 py-2">{expense.expense_type}</td>
                                    <td className="px-4 py-2">{expense.value}</td>
                                    <td className="px-4 py-2">{formatFrequency(expense.frequency)}</td>
                                    <td className="px-4 py-2">{expense.start_date}</td>
                                    <td className="px-4 py-2">{expense.end_date}</td>
                                    <td className="px-4 py-2">{expense.inflation_rate}%</td>
                                    <td className="px-4 py-2 space-x-2">
                                        {/* <button
                                            onClick={() => startEditing(expense)}
                                            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button> */}


                                        <button onClick={() => startEditing(expense)} className="text-blue-500 focus:outline-none">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 ml-2 focus:outline-none">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Saving Form */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 shadow rounded-2xl mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold text-[#004aad] mb-4">Add New Saving</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Saving Rate (%)</label>
                        <input
                            type="number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004aad] ${savingError ? 'border-red-500' : 'border-gray-300'}`}
                            value={savingRate}
                            onChange={(e) => setSavingRate(e.target.value)}
                            min="0"
                            max="100"
                        />
                        {savingError && <p className="text-red-500 text-sm">{savingError}</p>}
                    </div>
                    <div /> {/* Empty div for grid alignment */}
                    <div className="col-span-full flex items-center pt-2">
                        <button
                            onClick={handleSaveSaving}
                            className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                        >
                            Add Saving
                        </button>
                    </div>
                </div>
            </div>

            {/* Savings List */}
            <div className="overflow-x-auto mb-10">
                <h3 className="text-xl font-semibold mb-3 text-[#004aad]">Savings List</h3>
                {savings.length === 0 ? (
                    <p className="text-gray-500">No savings found</p>
                ) : (
                    <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Saving Rate (%)</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savings.map((saving, idx) => (
                                <tr key={saving.id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                    <td className="px-4 py-2">{saving.saving_rate}</td>
                                    <td className="px-4 py-2">
                                        {/* <button
                                            onClick={() => handleDeleteSaving(saving.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button> */}

                                        <button onClick={() => handleDeleteSaving(saving.id)} className="text-red-500 ml-2 focus:outline-none">
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

export default ExpensesSection;

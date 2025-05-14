import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [catType, setCatType] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Basic validation
        if (!keyword || !category || !catType) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/add-category/',
                { keyword, category, cat_type: catType },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add category.');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Category</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Category Name"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Category Type"
                    value={catType}
                    onChange={(e) => setCatType(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Category
                </button>
            </form>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default AddCategory;

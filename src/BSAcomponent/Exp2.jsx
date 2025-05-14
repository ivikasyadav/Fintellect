import React, { useState } from 'react';
import axios from 'axios';

const CreateUserPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                `http://localhost:8000/create-user/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
            );
            setMessage(`User created! ID: ${response.data.user_id}`);
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map(e => e.msg).join(', '));
            } else if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError('Error creating user');
            }
        }
    };


    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 rounded w-full"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create User
                </button>
            </form>
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default CreateUserPage;



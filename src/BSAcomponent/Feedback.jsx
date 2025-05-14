import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext'; // adjust path if needed

const SendFeedback = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email); // populate email from AuthContext
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email || !feedback) {
            setError('Email and feedback are required.');
            return;
        }

        const formData = new FormData();
        formData.append('user_email', email);
        formData.append('feedback_text', feedback);

        if (file) {
            formData.append('attached_file', file);
        }

        try {
            const response = await axios.post('http://localhost:8000/send-feedback/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            setFeedback('');
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send feedback.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-[#004aad] mb-4">Send Feedback</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="border border-gray-300 p-3 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                    <textarea
                        placeholder="Enter your feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="border border-gray-300 p-3 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border border-gray-300 p-2 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#004aad] file:text-white hover:file:bg-blue-700"
                        accept="*"
                    />
                    <button
                        type="submit"
                        className="bg-[#004aad] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>

                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default SendFeedback;

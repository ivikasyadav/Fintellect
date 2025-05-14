// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/Authcontext'; // adjust the path if needed

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            {user ? (
                <p className="mt-2 text-gray-700">Welcome, your email is: <strong>{user.email}</strong></p>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default Dashboard;

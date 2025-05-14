import React from 'react';
import { Link } from 'react-router-dom';

const SmallNavbar2 = () => {
    return (
        <div className="border-b border-gray-200 px-4 py-2 flex space-x-6 text-sm font-medium text-gray-700">
            <Link to="/bsa">Dashboard</Link>
            <Link to="/bsa/summary1">Summary</Link>
            <Link to="/bsa/bank_entries">Bank Entries</Link>
            <Link to="/bsa/feedback">Feedback</Link>

           
        </div>
    );
};

export default SmallNavbar2;

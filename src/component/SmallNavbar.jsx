import React from 'react';
import { Link } from 'react-router-dom';

const SmallNavbar = () => {
    return (
        <div className="border-b border-gray-200 px-4 py-2 flex space-x-6 text-sm font-medium text-gray-700">
            <Link to="/networth-tracker/">Personal Profile</Link>
            <Link to="/networth-tracker/income">Income Section</Link>
            <Link to="/networth-tracker/expenses">Expenses Section</Link>
            <Link to="/networth-tracker/investments">Investments & Assets</Link>
            <Link to="/networth-tracker/summary">Summary & Networth</Link>
        </div>
    );
};

export default SmallNavbar;

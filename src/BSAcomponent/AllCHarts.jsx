import React from 'react';
import YearWiseCreditDebit from './YearWiseCreditDebit';
import CategoryWiseChart from './CategoryWiseChart';

const AllCharts = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8">Credit and Debit Summary</h1>
            <div className="space-y-8">
                <YearWiseCreditDebit />
                <CategoryWiseChart />
            </div>
        </div>
    );
};

export default AllCharts;

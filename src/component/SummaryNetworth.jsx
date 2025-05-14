import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useAuth } from '../context/Authcontext';
import { useProfile } from '../context/ProfileContext';
import ExpensesData from './Charts/ExpensesData';
import ProjectedIncomeGraph from './Charts/ProjectedIncomeGraph';
import SavingsRatio from './Charts/SavingsRatio';
import NetWorthGraph from './Charts/NetWorthGraph';


const SummaryNetworth = () => {
    const [dependents, setDependents] = useState([]);
    const [summaryItems, setSummaryItems] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    const { user } = useAuth();
    const { selectedProfile } = useProfile();

    const fetchSummary = async () => {
        if (!user || !selectedProfile) return;
        try {
            const userId = encodeURIComponent(user.email);
            const profileId = selectedProfile.id;

            const response = await fetch(`http://localhost:8000/networth/${userId}/${profileId}/summary`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || "Failed to fetch summary");

            setSummaryItems(data);
            console.log(data)
            console.log(data)
        } catch (error) {
            console.error("Error fetching summary:", error);
            setSummaryItems([]);
        }
    };

    
    const fetchDependents = async () => {
        if (!user) return;
        try {
            const userId = encodeURIComponent(user.email);
            const response = await fetch(`http://localhost:8000/dependents/${userId}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || "Failed to fetch dependents");

            setDependents(data);
        } catch (error) {
            console.error("Error fetching dependents:", error);
            setDependents([]);
        }
    };

    useEffect(() => {
        if (user && selectedProfile) {
            fetchSummary();
            fetchDependents();
        }
    }, [user, selectedProfile]);

    const handleExport = async () => {
        setIsExporting(true);
        setExportError(null);

        try {
            const userId = encodeURIComponent(user.email);
            const profileId = selectedProfile.id;

            const response = await fetch(`http://localhost:8000/networth/${userId}/${profileId}/export`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to export net worth');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'net_worth_projection.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setExportError(err.message);
        } finally {
            setIsExporting(false);
        }
    };

    

    

    const canRenderCharts = user?.email && selectedProfile?.id;

    return (
        <>
            <div className=" mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
                <h2 className="text-3xl font-bold mb-2 text-[#004aad]">Net Worth Projection</h2>
                <div className="mx-auto p-6 bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-2xl mt-8">
            {/* Header */}
            <div className="mb-8">
                        <p className="text-gray-700 mb-1">Current Scenario: <span className="font-semibold">{selectedProfile?.profile_name}</span></p>
                <p className="text-gray-600 mb-4">
                    Check all your inputs below. If you need to change anything or add/remove data,
                    go to the respective tabs and add the details.
                </p>
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                >
                    {isExporting ? 'Exporting...' : 'Export Net Worth'}
                </button>
                {exportError && <p className="text-red-500 mt-2">{exportError}</p>}
            </div>

            {/* Summary Table */}
            <div className="mb-10 bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-[#004aad]">Summary</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Amount (₹)</th>
                                <th className="px-4 py-2 text-left">Start Date</th>
                                <th className="px-4 py-2 text-left">End Date</th>
                                <th className="px-4 py-2 text-left">Inflation/Growth Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        No Rows To Show
                                    </td>
                                </tr>
                            ) : (
                                summaryItems.map((item, idx) => (
                                    <tr key={idx} className={`border-gray-300 border ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                        <td className="px-4 py-2">{item.category}</td>
                                        <td className="px-4 py-2">{item.type}</td>
                                        <td className="px-4 py-2">₹{item.value}</td>
                                        <td className="px-4 py-2">{item.start_date}</td>
                                        <td className="px-4 py-2">{item.end_date}</td>
                                        <td className="px-4 py-2">{item.rate}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts Section - 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Net Worth Line Chart */}
                        <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-4 flex flex-col">
                            <h4 className="text-lg font-semibold mb-2 text-[#004aad]">Savings Ratio</h4>
                            <div className="flex-grow" style={{ minHeight: 220 }}>
                                {canRenderCharts ? (
                                    <NetWorthGraph userId={user.email} profileId={selectedProfile.id} />
                                ) : (
                                    <div className="flex items-center justify-center text-gray-400 h-full">Loading...</div>
                                )}
                            </div>
                        </div>

                {/* Expenses Chart */}
                <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-4 flex flex-col">
                    <h4 className="text-lg font-semibold mb-2 text-[#004aad]">Expenses</h4>
                    <div className="flex-grow" style={{ minHeight: 220 }}>
                        {canRenderCharts ? (
                            <ExpensesData userId={user.email} profileId={selectedProfile.id} />
                        ) : (
                            <div className="flex items-center justify-center text-gray-400 h-full">Loading...</div>
                        )}
                    </div>
                </div>

                {/* Projected Income Chart */}
                <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-4 flex flex-col">
                    <h4 className="text-lg font-semibold mb-2 text-[#004aad]">Projected Income</h4>
                    <div className="flex-grow" style={{ minHeight: 220 }}>
                        {canRenderCharts ? (
                            <ProjectedIncomeGraph userId={user.email} profileId={selectedProfile.id} />
                        ) : (
                            <div className="flex items-center justify-center text-gray-400 h-full">Loading...</div>
                        )}
                    </div>
                </div>

                {/* Savings Ratio Chart */}
                <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-4 flex flex-col">
                    <h4 className="text-lg font-semibold mb-2 text-[#004aad]">Savings Ratio</h4>
                    <div className="flex-grow" style={{ minHeight: 220 }}>
                        {canRenderCharts ? (
                            <SavingsRatio userId={user.email} profileId={selectedProfile.id} />
                        ) : (
                            <div className="flex items-center justify-center text-gray-400 h-full">Loading...</div>
                        )}
                    </div>
                </div>

                        
            </div>

            {/* Dependents Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-[#004aad]">Dependents Data</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-[#004aad]">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Date of Birth</th>
                                <th className="px-4 py-2 text-left">Gender</th>
                                <th className="px-4 py-2 text-left">Relationship</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dependents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                        No Dependents
                                    </td>
                                </tr>
                            ) : (
                                dependents.map((dependent, idx) => (
                                    <tr key={idx} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                        <td className="px-4 py-2">{dependent.name}</td>
                                        <td className="px-4 py-2">{dependent.date_of_birth}</td>
                                        <td className="px-4 py-2">{dependent.gender}</td>
                                        <td className="px-4 py-2">{dependent.relationship}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            </div>
        </>
    );
};

export default SummaryNetworth;

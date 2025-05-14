import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useTransactionContext } from '../context/TransactionContext ';

const DEFAULT_COL_WIDTH = '90px'; // Adjust as needed

const SUMMARY_COLUMNS = [
    { key: 'UserID', label: 'User ID' },
    { key: 'Bank', label: 'Bank' },
    { key: 'Start_Date', label: 'Start Date' },
    { key: 'End_Date', label: 'End Date' },
    { key: 'Pending_Days', label: 'Pending Days' },
    { key: 'Transactions', label: 'Transactions' },
    { key: 'Opening_Balance', label: 'Opening Balance' },
    { key: 'Closing_Balance', label: 'Closing Balance' }
];

const Summary = () => {
    const { user } = useAuth();
    const { transactionsChanged } = useTransactionContext();
    const email = user?.email || '';
    const [summaryArray, setSummaryArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
    const [filters, setFilters] = useState({});
    const [showFilterInput, setShowFilterInput] = useState({});

    const fetchSummaries = async () => {
        if (!email) {
            setError("User email not found.");
            return;
        }
        setLoading(true);
        setError('');
        setSummaryArray([]);
        try {
            const { data } = await axios.get("http://localhost:8000/get-summaries/", {
                params: { user_email: email }
            });
            setSummaryArray(data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to fetch summaries.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaries();
    }, [email, transactionsChanged]);

    // Sorting
    const handleSort = (column) => {
        setSortConfig(prev => {
            if (prev.key === column) {
                const nextDirection = prev.direction === 'none' ? 'asc' : prev.direction === 'asc' ? 'desc' : 'none';
                return { key: column, direction: nextDirection };
            }
            return { key: column, direction: 'asc' };
        });
    };

    // Filtering
    const toggleFilterInput = (col) => {
        setShowFilterInput(prev => ({ ...prev, [col]: !prev[col] }));
    };
    const clearFilter = (col) => {
        setFilters(prev => ({ ...prev, [col]: '' }));
        setShowFilterInput(prev => ({ ...prev, [col]: false }));
    };

    // Filter and sort
    const sortedSummaries = (() => {
        const filtered = summaryArray.filter((summary) =>
            SUMMARY_COLUMNS.every(
                ({ key }) => !filters[key] || summary[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
            )
        );
        if (sortConfig.key && sortConfig.direction !== 'none') {
            const sorted = [...filtered].sort((a, b) => {
                const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
                const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
                return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
            return sorted;
        }
        return filtered;
    })();

    return (
        <div className="max-w-8xl space-y-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">User Bank Summary</h1>
                <button
                    onClick={fetchSummaries}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Refresh Summary
                </button>
                {loading && <p className="text-gray-500 mt-2">Loading...</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <div className="overflow-auto h-[70vh] mt-4 border  rounded-lg shadow-sm">
                    {/* <div className="overflow-auto h-[70vh] mt-4 border rounded-lg shadow-sm"></div> */}
                    <table className="min-w-full border-collapse text-xs ">
                        <thead className="sticky top-0 z-10 shadow-md bg-gray-100 text-[#004aad]">
                            <tr>
                                {SUMMARY_COLUMNS.map(({ key, label }) => (
                                    <th
                                        key={key}
                                        className="group px-4 py-3   text-left font-semibold  cursor-pointer"
                                        style={{
                                            width: DEFAULT_COL_WIDTH,
                                            minWidth: '70px',
                                            maxWidth: '110px',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        <div className="flex justify-between items-center px-1 py-1 relative">
                                            <div
                                                onClick={() => handleSort(key)}
                                                className="flex items-center gap-1"
                                            >
                                                {label}
                                                {sortConfig.key === key && (
                                                    <span className="text-xs text-gray-500">
                                                        {sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 ml-2 group-hover:flex hidden">
                                                <button
                                                    onClick={() => toggleFilterInput(key)}
                                                    className="text-xs text-gray-600 hover:text-black"
                                                >
                                                    🔍
                                                </button>
                                            </div>
                                        </div>
                                        {showFilterInput[key] && (
                                            <div className="mt-1 flex items-center gap-1 px-1 pb-1">
                                                <input
                                                    type="text"
                                                    placeholder={`Filter ${label}`}
                                                    value={filters[key] || ''}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                                                    }
                                                    className="border rounded-md px-1 py-1 text-xs w-full"
                                                />
                                                <button
                                                    onClick={() => clearFilter(key)}
                                                    className="text-red-500 text-xs px-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSummaries.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={SUMMARY_COLUMNS.length}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No Summary Available
                                    </td>
                                </tr>
                            ) : (
                                sortedSummaries.map((s, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-gray-300 border ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                            }`}
                                    >
                                        {SUMMARY_COLUMNS.map(({ key }) => (
                                            <td
                                                key={key}
                                                className="px-3 py-4"
                                                style={{
                                                    width: DEFAULT_COL_WIDTH,
                                                    minWidth: '70px',
                                                    maxWidth: '110px',
                                                    fontSize: '0.85rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {s[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Summary;

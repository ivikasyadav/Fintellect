import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useTransactionContext } from '../context/TransactionContext ';
import DeleteTransactions from './DeleteTransaction';

const BankEntries = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [filters, setFilters] = useState({});
    const [editingCell, setEditingCell] = useState({ row: null, column: null });
    const [editedValue, setEditedValue] = useState('');
    const [columnWidths, setColumnWidths] = useState({});
    const [showFilterInput, setShowFilterInput] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const { user } = useAuth();
    const { transactionsChanged, markTransactionsChanged } = useTransactionContext();
    const userEmail = user?.email || '';

    const columnsToHide = ['UserID', 'TransactionID', 'Balance'];

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError('');
        setTransactions([]);

        if (!userEmail) {
            setError("User email is missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/get-transactions/', {
                params: { user_email: userEmail },
            });
            setTransactions(response.data);

            if (response.data.length > 0) {
                const cols = Object.keys(response.data[0]).filter(col => !columnsToHide.includes(col));
                setAllColumns(Object.keys(response.data[0])); // Keep all columns for internal use
                setVisibleColumns(cols);
            }
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-categories/');
            setCategoryOptions(response.data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    useEffect(() => {
        if (userEmail) fetchTransactions();
    }, [userEmail, fetchTransactions, transactionsChanged]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSort = (column) => {
        setSortConfig(prev => {
            if (prev.key === column) {
                const nextDirection = prev.direction === 'none' ? 'asc' : prev.direction === 'asc' ? 'desc' : 'none';
                return { key: column, direction: nextDirection };
            }
            return { key: column, direction: 'asc' };
        });
    };

    const handleEditSubmit = async (rowIndex, colName, newValue) => {
        const transaction = sortedTransactions[rowIndex];
        const transactionId = transactions.find(txn => txn.TransactionID === transaction.TransactionID)?.TransactionID;

        if (!transactionId) {
            alert("Missing transaction ID");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('transaction_id', transactionId);
            formData.append('set_column', colName);
            formData.append('set_value', newValue);

            await axios.put('http://localhost:8000/update-transaction/', formData);
            markTransactionsChanged();
        } catch (err) {
            alert("Failed to update transaction: " + (err.response?.data?.detail || err.message));
        }

        setEditingCell({ row: null, column: null });
    };

    const handleKeyDown = (e, rowIndex, colName) => {
        if (e.key === 'Enter') handleEditSubmit(rowIndex, colName, editedValue);
    };

    const handleResizeMouseDown = (e, column) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = e.target.parentElement.offsetWidth;

        const handleMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            setColumnWidths(prev => ({ ...prev, [column]: `${newWidth}px` }));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const sortedTransactions = (() => {
        const filtered = transactions.filter((txn) =>
            Object.keys(filters).every(
                (column) => !filters[column] || txn[column]?.toString().toLowerCase().includes(filters[column].toLowerCase())
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

    const toggleFilterInput = (col) => {
        setShowFilterInput((prev) => ({ ...prev, [col]: !prev[col] }));
    };

    const clearFilter = (col) => {
        setFilters((prev) => ({ ...prev, [col]: '' }));
        setShowFilterInput((prev) => ({ ...prev, [col]: false }));
    };

    const handleToggleColumn = (col) => {
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
        );
    };

    return (
        <div className="max-w-8xl space-y-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">User Transactions</h1>
                <div className="flex gap-4 flex-wrap">
                    <button onClick={fetchTransactions} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Refresh Transactions
                    </button>
                    <button onClick={() => setShowColumnManager(!showColumnManager)} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                        Manage Columns
                    </button>
                </div>

                {showColumnManager && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-sm max-w-full overflow-x-auto">
                        <h2 className="text-lg font-semibold mb-2">Toggle Columns</h2>
                        <div className="flex flex-wrap gap-4">
                            {allColumns.filter(col => !columnsToHide.includes(col)).map((col) => (
                                <label key={col} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col)}
                                        onChange={() => handleToggleColumn(col)}
                                    />
                                    <span>{col}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {loading && <p className="text-gray-500 mt-2">Loading...</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}

                <div className="overflow-auto h-[70vh] mt-4 border rounded-lg shadow-sm">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className=" sticky top-0 z-10 shadow-md bg-gray-100 text-[#004aad]">
                            <tr>
                                {visibleColumns.map((col) => (
                                    <th
                                        key={col}
                                        className="group px-4 py-3   text-left font-semibold  cursor-pointer"
                                        style={{ width: columnWidths[col] || 'auto' }}
                                    >
                                        <div className="flex justify-between items-center px-3 py-2 relative">
                                            <div onClick={() => handleSort(col)} className="flex items-center gap-1">
                                                {col}
                                                {sortConfig.key === col && (
                                                    <span className="text-xs text-gray-500">
                                                        {sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 ml-2 group-hover:flex hidden">
                                                <button onClick={() => toggleFilterInput(col)} className="text-xs text-gray-600 hover:text-black">
                                                    🔍
                                                </button>
                                            </div>
                                            <div className="absolute top-0 right-0 w-2 h-full cursor-ew-resize" onMouseDown={(e) => handleResizeMouseDown(e, col)} />
                                        </div>
                                        {showFilterInput[col] && (
                                            <div className="mt-1 flex items-center gap-1 px-2 pb-1">
                                                <input
                                                    type="text"
                                                    placeholder={`Filter ${col}`}
                                                    value={filters[col] || ''}
                                                    onChange={(e) => setFilters((prev) => ({ ...prev, [col]: e.target.value }))}
                                                    className="border rounded-md px-2 py-1 text-xs w-full"
                                                />
                                                <button onClick={() => clearFilter(col)} className="text-red-500 text-xs px-2">✕</button>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumns.length} className="text-center py-4 text-gray-500">
                                        No Transactions available
                                    </td>
                                </tr>
                            ) : (
                                sortedTransactions.map((txn, rowIndex) => (
                                    <tr key={rowIndex} className={`border-gray-300 border ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                        {visibleColumns.map((col, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-4 py-2 cursor-pointer"
                                                onDoubleClick={() => {
                                                    if (col === "Category") {
                                                        setEditingCell({ row: rowIndex, column: col });
                                                        setEditedValue(txn[col]);
                                                    }
                                                }}
                                            >
                                                {editingCell.row === rowIndex && editingCell.column === col ? (
                                                    <select
                                                        value={editedValue}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            setEditedValue(newValue);
                                                            handleEditSubmit(rowIndex, col, newValue);
                                                        }}
                                                        onBlur={() => setEditingCell({ row: null, column: null })}
                                                        autoFocus
                                                        className="border rounded-md px-2 py-1 w-full"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categoryOptions.map((cat) => (
                                                            <option key={cat.CategoryID} value={cat.Category}>
                                                                {cat.Category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    txn[col]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
            <DeleteTransactions onDelete={fetchTransactions} />
        </div>
    );
};

export default BankEntries;
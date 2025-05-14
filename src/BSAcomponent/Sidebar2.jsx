import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useTransactionContext } from '../context/TransactionContext ';

const Sidebar2 = () => {
    const { user } = useAuth();
    const userEmail = user?.email || '';
    const { markTransactionsChanged } = useTransactionContext();

    const [bank, setBank] = useState('');
    const [file, setFile] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const handleAddData = async (e) => {
        e.preventDefault();

        if (!userEmail) return alert('User email not available');
        if (!bank) return alert('Please select a bank');
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('user_email', userEmail);
        formData.append('bank', bank);
        formData.append('file', file);

        try {
            const response = await axios.post(
                'http://localhost:8000/upload-transactions/',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert('Upload successful!');
            markTransactionsChanged();
        } catch (error) {
            alert('Upload failed');
            console.error(error.response?.data || error.message);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Only PDF, XLS, and XLSX files are supported.");
            e.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    return (
        <div className={`p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} animate-fade-in`}>
            <button
                className="mb-4 p-2 focus:outline-none hover:bg-blue-100 rounded transition"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
            </button>

            {!collapsed && (
                <div className="space-y-6">
                    <p className="text-sm text-gray-700">Logged in as <span className="font-medium">{userEmail}</span></p>

                    {/* Bank Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#004aad] mb-2">Select Bank</h3>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] bg-white"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                        >
                            <option value="">-- Select Bank --</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Bandhan Bank">Bandhan Bank</option>
                            <option value="Bank of Baroda">Bank of Baroda</option>
                            <option value="Bank Of India">Bank Of India</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Indian Overseas Bank">Indian Overseas Bank</option>
                            <option value="Kotak Bank">Kotak Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#004aad] mb-2">
                            Upload Statement <span className="text-xs text-gray-500">(PDF, XLS, XLSX)</span>
                        </h3>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.xls,.xlsx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload">
                            <div className="w-full p-3 text-center bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                {file ? file.name : "Browse files"}
                            </div>
                        </label>
                    </div>

                    {/* Upload Button */}
                    <button
                        className="w-full p-3 bg-gradient-to-r from-[#004aad] to-blue-400 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-500 transition"
                        onClick={handleAddData}
                    >
                        Add Data
                    </button>
                </div>
            )}

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px);}
                    to { opacity: 1; transform: none;}
                }
            `}</style>
        </div>
    );
};

export default Sidebar2;

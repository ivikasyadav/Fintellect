import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

const SidebarProfileManager = () => {
    const { profiles, selectedProfile, setSelectedProfile, addProfile, deleteProfile } = useProfile();
    const [newProfileName, setNewProfileName] = useState('');
    const [deleteTarget, setDeleteTarget] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    const handleCreate = () => {
        if (newProfileName.trim()) {
            addProfile(newProfileName.trim()); // Trim the new profile name
            setNewProfileName('');
        }
    };

    const handleDelete = () => {
        if (deleteTarget) {
            const targetId = parseInt(deleteTarget);
            if (!isNaN(targetId)) { // check if it is a number.
                deleteProfile(targetId);
                setDeleteTarget('');
            } else {
                console.error("Invalid profile ID for deletion.");
            }
        }
    };

    return (
        <div className={`p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} animate-fade-in`}>
            <button
                className="mb-4 p-2 focus:outline-none hover:bg-blue-100 rounded transition"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {/* Hamburger Icon */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
            </button>
            {!collapsed && (
                <div className="space-y-8">
                    {/* Select Profile */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#004aad] mb-2">Select Profile</h3>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] bg-white"
                            value={selectedProfile?.id || ''}
                            onChange={(e) => {
                                const profileId = parseInt(e.target.value);
                                const profile = profiles.find(p => p.id === profileId);
                                setSelectedProfile(profile || null); // Handle not found case
                            }}
                        >
                            <option value="">Select a profile</option> {/* Added default option */}
                            {profiles.map(profile => (
                                <option key={profile.id} value={profile.id}>{profile.profile_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Create Profile */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#004aad] mb-2">Create Profile</h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] bg-white"
                                placeholder="New profile name"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            />
                            <button
                                className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                                onClick={handleCreate}
                                type="button"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Delete Profile */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#004aad] mb-2">Delete Profile</h3>
                        <div className="flex space-x-2">
                            <select
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] bg-white"
                                value={deleteTarget}
                                onChange={(e) => setDeleteTarget(e.target.value)}
                            >
                                <option value="">Select profile</option>
                                {profiles.map(profile => (
                                    <option key={profile.id} value={profile.id}>{profile.profile_name}</option>
                                ))}
                            </select>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                                onClick={handleDelete}
                                type="button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
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

export default SidebarProfileManager;

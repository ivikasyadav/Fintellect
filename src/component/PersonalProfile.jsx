import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { Edit, Trash2 } from "lucide-react";

const PersonalProfile = () => {
    const { user } = useAuth();
    const [showDependentForm, setShowDependentForm] = useState(false);
    const [editablePersonal, setEditablePersonal] = useState(false);
    const [hasSelfProfile, setHasSelfProfile] = useState(false);

    const [name, setName] = useState("");
    const [DOB, setDOB] = useState("");
    const [gender, setGender] = useState("");

    const [dependentName, setDependentName] = useState("");
    const [dependentDOB, setDependentDOB] = useState("");
    const [dependentGender, setDependentGender] = useState("");
    const [dependentRelationship, setDependentRelationship] = useState("");

    const [dependents, setDependents] = useState([]);
    const [selfDependent, setSelfDependent] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        id: null,
        name: ''
    });

    const fetchDependents = async () => {
        if (!user || !user.email) return;
        try {
            const res = await axios.get(`http://localhost:8000/dependents/${user.email}`);
            const allDependents = res.data;
            const selfDep = allDependents.find(dep => dep.relationship === "Self");

            if (selfDep) {
                setHasSelfProfile(true);
                setSelfDependent(selfDep);
                setName(selfDep.name);
                setDOB(selfDep.date_of_birth);
                setGender(selfDep.gender);
            } else {
                setHasSelfProfile(false);
                setName("");
                setDOB("");
                setGender("");
            }

            setDependents(allDependents);
        } catch (e) {
            console.error("Error fetching dependents:", e.response?.data || e.message);
        }
    };

    useEffect(() => {
        fetchDependents();
        // eslint-disable-next-line
    }, [user]);

    const handleCreatePersonalDetails = async () => {
        if (!user?.email) return;
        try {
            const postRes = await axios.post("http://localhost:8000/dependents", {
                user_id: user.email,
                name: name,
                date_of_birth: DOB,
                gender: gender,
                relationship: "Self",
            });
            setSelfDependent(postRes.data);
            setHasSelfProfile(true);
            setEditablePersonal(false);
            fetchDependents();
        } catch (postError) {
            console.error("Error creating self-dependent:", postError.response?.data || postError.message);
        }
    };

    const handleUpdatePersonalDetails = async () => {
        try {
            await axios.put(`http://localhost:8000/dependents/${selfDependent.id}`, {
                user_id: user.email,
                name,
                date_of_birth: DOB,
                gender,
                relationship: "Self"
            });

            setSelfDependent({ ...selfDependent, name, date_of_birth: DOB, gender });
            setDependents(prevDependents =>
                prevDependents.map(dep =>
                    dep.id === selfDependent.id ? { ...dep, name, date_of_birth: DOB, gender } : dep
                )
            );
            setEditablePersonal(false);
        } catch (e) {
            console.error("Error updating personal details:", e.response?.data || e.message);
        }
    };


    const handleAddDependent = async () => {
        if (!dependentRelationship || !user?.email) return;
        try {
            await axios.post("http://localhost:8000/dependents", {
                user_id: user.email,
                name: dependentName,
                date_of_birth: dependentDOB,
                gender: dependentGender,
                relationship: dependentRelationship,
            });
            setDependentName("");
            setDependentDOB("");
            setDependentGender("");
            setDependentRelationship("");
            fetchDependents();
        } catch (error) {
            console.error("Error adding dependent:", error.response?.data || error.message);
        }
    };

    const handleDeleteDependent = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/dependents/${user.email}/${id}`);
            setDependents(prevDependents => prevDependents.filter(dep => dep.id !== id));
            if (selfDependent?.id === id) {
                setSelfDependent(null);
                setHasSelfProfile(false);
                setName("");
                setDOB("");
                setGender("");
            }
            hideDeleteConfirmation();
        } catch (error) {
            console.error("Error deleting dependent:", error.response?.data || error.message);
        }
    };

    const handleUpdateDependent = async (dependent) => {
        try {
            await axios.put(`http://localhost:8000/dependents/${dependent.id}`, dependent);
            setDependents(prevDependents =>
                prevDependents.map(dep => (dep.id === dependent.id ? dependent : dep))
            );
            if (selfDependent?.id === dependent.id) {
                setSelfDependent(dependent);
                setName(dependent.name);
                setDOB(dependent.date_of_birth);
                setGender(dependent.gender);
            }
            setEditIndex(null);
        } catch (error) {
            console.error("Error updating dependent:", error.response?.data || error.message);
        }
    };
    const showDeleteConfirmation = (id, name) => {
        setDeleteConfirmation({ show: true, id, name });
    };

    const hideDeleteConfirmation = () => {
        setDeleteConfirmation({ show: false, id: null, name: '' });
    };

    return (
        <>
            <div className=" mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
                <h2 className="text-3xl font-bold mb-2 text-[#004aad]">Personal Profile</h2>
                <div className=" mx-auto p-6 bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-2xl mt-8">
                    <p className="mb-6 text-gray-600">Your personal details are listed here.</p>

                    {/* Personal Profile Inputs in One Row */}
                    <div className="bg-white p-6 shadow rounded-2xl mb-10">
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                if (!hasSelfProfile) {
                                    handleCreatePersonalDetails();
                                } else if (editablePersonal && hasSelfProfile) {
                                    handleUpdatePersonalDetails();
                                }
                            }}
                        >
                            <div className="flex flex-wrap gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]"
                                    disabled={!editablePersonal && hasSelfProfile}
                                    required
                                />
                                <input
                                    type="date"
                                    value={DOB}
                                    onChange={e => setDOB(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]"
                                    disabled={!editablePersonal && hasSelfProfile}
                                    required
                                />
                                <select
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]"
                                    disabled={!editablePersonal && hasSelfProfile}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Corporate</option>
                                    <option>Prefer not to say</option>
                                    <option>Other</option>
                                </select>
                                {!hasSelfProfile ? (
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white rounded-xl px-5 py-2 font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                                    >
                                        Create Personal Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setEditablePersonal(!editablePersonal)}
                                            className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white rounded-xl px-5 py-2 font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                                        >
                                            {editablePersonal ? "Cancel Edit" : "Edit Personal Details"}
                                        </button>
                                        {editablePersonal && hasSelfProfile && (
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white rounded-xl px-5 py-2 font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                                            >
                                                Confirm Edit
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Add Dependent Section */}
                    <div className="mt-6">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={showDependentForm} onChange={() => setShowDependentForm(!showDependentForm)} />
                            <span className="text-[#004aad] font-medium">Add Dependent</span>
                        </label>
                    </div>

                    {showDependentForm && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-blue-100 to-white rounded-2xl shadow">
                            <h3 className="text-lg text-[#004aad] font-semibold mb-4">Add Dependent</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <input type="text" placeholder="Name" value={dependentName} onChange={e => setDependentName(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]" />
                                <input type="date" value={dependentDOB} onChange={e => setDependentDOB(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]" />
                                <select value={dependentGender} onChange={e => setDependentGender(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]">
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Corporate</option>
                                    <option>Prefer not to say</option>
                                    <option>Other</option>
                                </select>
                                <select value={dependentRelationship} onChange={e => setDependentRelationship(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004aad] min-w-[140px]">
                                    <option value="">Select Relationship</option>
                                    <option value="Self">Self</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Father">Father</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button onClick={handleAddDependent} className="bg-gradient-to-r from-[#004aad] to-blue-400 text-white rounded-xl px-5 py-2 font-semibold hover:from-blue-700 hover:to-blue-500 transition">
                                    Add Dependent
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Dependents Table */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-[#004aad] mb-3">Your Dependents</h3>
                        {dependents.length === 0 ? (
                            <p className="text-gray-500 mt-2">You have no dependents added yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
                                    <thead className="bg-gray-100 text-[#004aad]">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Date of Birth</th>
                                            <th className="px-4 py-2 text-left">Gender</th>
                                            <th className="px-4 py-2 text-left">Relationship</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dependents.map((dep, index) => (
                                            <tr key={dep.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                                {editIndex === index ? (
                                                    <>
                                                        <td className="px-4 py-2">
                                                            <input type="text" value={dep.name} onChange={e => {
                                                                const updated = [...dependents];
                                                                updated[index].name = e.target.value;
                                                                setDependents(updated);
                                                            }} className="p-2 border border-gray-300 rounded" />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input type="date" value={dep.date_of_birth} onChange={e => {
                                                                const updated = [...dependents];
                                                                updated[index].date_of_birth = e.target.value;
                                                                setDependents(updated);
                                                            }} className="p-2 border border-gray-300 rounded" />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <select value={dep.gender} onChange={e => {
                                                                const updated = [...dependents];
                                                                updated[index].gender = e.target.value;
                                                                setDependents(updated);
                                                            }} className="p-2 border border-gray-300 rounded">
                                                                <option>Male</option>
                                                                <option>Female</option>
                                                                <option>Corporate</option>
                                                                <option>Prefer not to say</option>
                                                                <option>Other</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <select value={dep.relationship} onChange={e => {
                                                                const updated = [...dependents];
                                                                updated[index].relationship = e.target.value;
                                                                setDependents(updated);
                                                            }} className="p-2 border border-gray-300 rounded">
                                                                <option value="Self">Self</option>
                                                                <option value="Spouse">Spouse</option>
                                                                <option value="Child">Child</option>
                                                                <option value="Mother">Mother</option>
                                                                <option value="Father">Father</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <button onClick={() => handleUpdateDependent(dependents[index])} className="bg-[#004aad] text-white rounded-lg px-3 py-1 font-semibold hover:bg-blue-700 transition">
                                                                Save
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-4 py-2">{dep.name}</td>
                                                        <td className="px-4 py-2">{dep.date_of_birth}</td>
                                                        <td className="px-4 py-2">{dep.gender}</td>
                                                        <td className="px-4 py-2">{dep.relationship}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            <button onClick={() => setEditIndex(index)} className="text-blue-500 focus:outline-none">
                                                                <Edit size={18} />
                                                            </button>
                                                            <button onClick={() => showDeleteConfirmation(dep.id, dep.name)} className="text-red-500 ml-2 focus:outline-none">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {deleteConfirmation.show && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-2xl shadow-xl">
                                <h4 className="text-xl text-center text-[#004aad] font-semibold">Are you sure you want to delete "{deleteConfirmation.name}"?</h4>
                                <div className="mt-4 flex justify-around gap-4">
                                    <button onClick={() => handleDeleteDependent(deleteConfirmation.id)} className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition">
                                        Yes, Delete
                                    </button>
                                    <button onClick={hideDeleteConfirmation} className="bg-gray-300 text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-400 transition">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    );

};

export default PersonalProfile;

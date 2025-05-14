// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/Authcontext';

// const IncomeSection = () => {
//   const { user } = useAuth();
//   const [incomes, setIncomes] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const [newIncome, setNewIncome] = useState({
//     source: '',
//     value: 0,
//     frequency: 'Monthly',
//     start_date: '',
//     end_date: '',
//     growth_rate: 0
//   });

//   // Fetch incomes on component mount
//   useEffect(() => {
//     if (user) fetchIncomes(user.email);
//   }, [user]);

//   const fetchIncomes = async (email) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/incomes/${email}/1`);
//       setIncomes(response.data);
//     } catch (error) {
//       console.error('Error fetching incomes:', error);
//     }
//   };

//   const handleAddIncome = async () => {
//     if (!user) return;
//     try {
//       const response = await axios.post('http://localhost:8000/incomes', {
//         ...newIncome,
//         user_id: user.email,
//         profile_id: 1
//       });
//       setIncomes([...incomes, response.data]);
//       resetForm();
//     } catch (error) {
//       console.error('Error adding income:', error);
//     }
//   };

//   const handleUpdateIncome = async () => {
//     try {
//       const response = await axios.put(`http://localhost:8000/incomes/${editingId}`, newIncome);
//       setIncomes(incomes.map(income => income.id === editingId ? response.data : income));
//       resetForm();
//     } catch (error) {
//       console.error('Error updating income:', error);
//     }
//   };

//   const handleDeleteIncome = async (incomeId) => {
//     try {
//       await axios.delete(`http://localhost:8000/incomes/${user.email}/${incomeId}`);
//       setIncomes(incomes.filter(income => income.id !== incomeId));
//     } catch (error) {
//       console.error('Error deleting income:', error);
//     }
//   };

//   const startEditing = (income) => {
//     setNewIncome({ ...income });
//     setEditingId(income.id);
//   };

//   const resetForm = () => {
//     setNewIncome({
//       source: '',
//       value: 0,
//       frequency: 'Monthly',
//       start_date: '',
//       end_date: '',
//       growth_rate: 0
//     });
//     setEditingId(null);
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-[#004aad]">Incomes</h2>

//       {/* Form Section */}
//       <div className="bg-white p-6 shadow rounded-2xl space-y-4 mb-10">
//         <h3 className="text-xl font-semibold text-[#004aad]">
//           {editingId ? 'Edit Income' : 'Add New Income'}
//         </h3>

//         {/* Input Fields */}
//         {[
//           {
//             label: 'Source',
//             type: 'select',
//             id: 'source',
//             options: [
//               '', 'Salary', 'Business Income', 'Bonuses & Commission',
//               'Freelancing', 'Consulting', 'Dividends', 'Royalties', 'Others'
//             ]
//           },
//           { label: 'Value', type: 'number', id: 'value' },
//           {
//             label: 'Frequency', type: 'select', id: 'frequency', options: [
//               '', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly',
//               'Quarterly', 'Half_yearly', 'Annual'
//             ]
//           },
//           { label: 'Start Date', type: 'date', id: 'start_date' },
//           { label: 'End Date', type: 'date', id: 'end_date' },
//           { label: 'Growth Rate (%)', type: 'number', id: 'growth_rate' }
//         ].map(({ label, type, id, options }) => (
//           <div key={id}>
//             <label className="block text-gray-700 font-medium mb-1" htmlFor={id}>{label}</label>
//             {type === 'select' ? (
//               <select
//                 id={id}
//                 className="w-full p-3 border border-gray-300 rounded-md"
//                 value={newIncome[id]}
//                 onChange={(e) => setNewIncome({ ...newIncome, [id]: e.target.value })}
//               >
//                 {options.map(option => (
//                   <option key={option} value={option}>
//                     {option || `Select ${label.toLowerCase()}`}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 id={id}
//                 type={type}
//                 className="w-full p-3 border border-gray-300 rounded-md"
//                 value={newIncome[id]}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, [id]: type === 'number' ? parseFloat(e.target.value) : e.target.value })
//                 }
//               />
//             )}
//           </div>
//         ))}

//         {/* Add / Update Button */}
//         <div className="flex justify-between items-center pt-2">
//           <button
//             onClick={editingId ? handleUpdateIncome : handleAddIncome}
//             className="bg-[#004aad] text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition"
//           >
//             {editingId ? 'Update Income' : 'Add Income'}
//           </button>
//           {editingId && (
//             <button onClick={resetForm} className="text-gray-500 hover:underline">
//               Cancel
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Incomes Table */}
//       <div className="overflow-x-auto">
//         <h3 className="text-xl font-semibold mb-3 text-[#004aad]">Incomes List</h3>
//         {incomes.length === 0 ? (
//           <p className="text-gray-500">No incomes found</p>
//         ) : (
//           <table className="min-w-full table-auto border border-gray-200 text-sm rounded-xl overflow-hidden">
//             <thead className="bg-gray-100 text-[#004aad]">
//               <tr>
//                 <th className="px-4 py-2 text-left">Source</th>
//                 <th className="px-4 py-2 text-left">Value</th>
//                 <th className="px-4 py-2 text-left">Frequency</th>
//                 <th className="px-4 py-2 text-left">Start Date</th>
//                 <th className="px-4 py-2 text-left">End Date</th>
//                 <th className="px-4 py-2 text-left">Growth Rate</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {incomes.map((income) => (
//                 <tr key={income.id} className="border-t">
//                   <td className="px-4 py-2">{income.source}</td>
//                   <td className="px-4 py-2">{income.value}</td>
//                   <td className="px-4 py-2">{income.frequency}</td>
//                   <td className="px-4 py-2">{income.start_date}</td>
//                   <td className="px-4 py-2">{income.end_date}</td>
//                   <td className="px-4 py-2">{income.growth_rate}</td>
//                   <td className="px-4 py-2 space-x-2">
//                     <button
//                       onClick={() => startEditing(income)}
//                       className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteIncome(income.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncomeSection;

// src/BSA/BSA.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from '../component/Navbar';
import Sidebar2 from '../BSAcomponent/Sidebar2';
import SmallNavbar2 from '../BSAcomponent/SmallNavbar2';

import Exp from '../BSAcomponent/BankEntries';
import Exp2 from '../BSAcomponent/Exp2';
import Summary from '../BSAcomponent/Summary';
import SendFeedback from '../BSAcomponent/Feedback';
import AddCategory from '../BSAcomponent/Category';
import UpdateTransaction from '../component/UT';
import BankEntries from '../BSAcomponent/BankEntries';
import AllCHarts from '../BSAcomponent/AllCHarts';
import CategoryTransactions from '../BSAcomponent/Exp';

function BSA() {
    return (
      
            <div className="flex flex-col h-screen">
                {/* Top nav, if you want it */}
                {/* <Navbar /> */}

                <div className="flex flex-1">
                    <Sidebar2 />

                    <div className="flex-1 p-6 overflow-y-auto">
                        <SmallNavbar2 />

                        <Routes>
                        <Route path="/bank_entries" element={<BankEntries />} />
                            {/* <Route path="/" element={<Dashboard />} /> */}
                            {/* <Route path="/" element={<AddCategoryForm />} /> */}
                            <Route path="/" element={<AllCHarts />} />
                        <Route path="/exp" element={<CategoryTransactions />} />

                            <Route path="/bank-entries-2" element={<Exp2 />} />
                            <Route path="/summary1" element={<Summary />} />
                            <Route path="/feedback" element={<SendFeedback />} />
                            <Route path="/add-category" element={<AddCategory />} />
                            <Route path="/update-transaction" element={<UpdateTransaction />} />
                            <Route path="*" element={<h2>Page Not Found</h2>} />
                        </Routes>
                    </div>
                </div>
            </div>
     
    );
}

export default BSA;

import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../component/Sidebar';
import IncomeSection from '../component/IncomeSection';
import PersonalProfile from '../component/PersonalProfile'; // if used
import SmallNavbar from '../component/SmallNavbar';
import ExpensesSection from '../component/ExpensesSection';
import InvestmentsAssets from '../component/InvestmentsAssets';
import SummaryNetworth from '../component/SummaryNetworth';
import { ProfileProvider } from '../context/ProfileContext';
import FinancialSummary from '../component/Exp';



const Networth = () => {
    return (
        <>

            <ProfileProvider>
                <div className="flex flex-col h-screen">

                    <div className="flex flex-1">
                        <Sidebar />

                        <div className="flex-1 p-6 overflow-y-auto">
                            <SmallNavbar />
                            <Routes>
                              
                                <Route path="/income" element={<IncomeSection />} />
                                <Route path="/expenses" element={<ExpensesSection />} />
                                <Route path="/investments" element={<InvestmentsAssets />} />
                                <Route path="/summary" element={<SummaryNetworth />} />
                                <Route path="/" element={<PersonalProfile />} />
                                {/* <Route path="/" element={<FinancialSummary />} /> */}

                            </Routes>
                        </div>
                    </div>
                </div>
            </ProfileProvider>
        </>
    )
}

export default Networth
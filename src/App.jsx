import { Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import BSA from './BSA/BSA';
import Networth from './Networth/Networth';
import Login1 from './BSAcomponent/Login1';
import { TransactionProvider } from './context/TransactionContext '; // remove trailing space in import

function App() {
  return (
    <TransactionProvider> {/* ✅ Wrap entire app or necessary part */}
      <div className="flex flex-col h-screen mt-0">
        <Navbar />

        <Routes>
          <Route path='/' element={<Login1 />} />
          <Route path='/bsa/*' element={<BSA />} />
          <Route path='/networth-tracker/*' element={<Networth />} />
        </Routes>
      </div>
    </TransactionProvider>
  );
}

export default App;

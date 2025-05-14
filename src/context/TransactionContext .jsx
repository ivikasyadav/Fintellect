// src/context/TransactionContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactionsChanged, setTransactionsChanged] = useState(false);

    const markTransactionsChanged = () => {
        setTransactionsChanged(prev => !prev); // Toggle to trigger re-fetch
    };

    return (
        <TransactionContext.Provider value={{ transactionsChanged, markTransactionsChanged }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactionContext = () => useContext(TransactionContext);

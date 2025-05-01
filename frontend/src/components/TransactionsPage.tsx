import React, { useEffect, useState } from 'react';
import { fetchTransactions } from "../utils/TimeBankFunctions";


const TransactionsPage: React.FC = () => {
    // Stato per memorizzare le transazioni
    const [transactions, setTransactions] = useState<any[]>([]);
  
    // Funzione per caricare le transazioni
    const loadTransactions = async () => {
      try {
        const allTransactions = await fetchTransactions(); // Ottieni le transazioni dalla funzione importata
        setTransactions(allTransactions || []); // Aggiorna lo stato con le transazioni ottenute
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    };
  
    // Esegui loadTransactions quando il componente viene montato
    useEffect(() => {
      loadTransactions();
    }, []); // Il secondo argomento vuoto [] indica che il codice verrà eseguito solo una volta, quando il componente viene montato
  
    return (
      <div className="container">
        <h1>Transactions</h1>
        <button onClick={loadTransactions}>Refresh Transactions</button>
        {transactions.map((tx, index) => (
          <div key={index}>
            <p><strong>From:</strong> {tx.from}</p>
            <p><strong>To:</strong> {tx.to}</p>
            <p><strong>Amount:</strong> {tx.amount} CT</p>
            <p><strong>Description:</strong> {tx.description}</p>
          </div>
        ))}
      </div>
    );
  };
  

export default TransactionsPage;

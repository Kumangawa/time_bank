import React, { useState, useEffect } from 'react';
import { fetchBalance, fetchOfferedServices, fetchRequestedServices, handleCompleteService } from "../utils/TimeBankFunctions";  // Assicurati di importare le funzioni necessarie

const UserPage: React.FC = () => {
  // Stato per il bilancio, i servizi offerti, i servizi richiesti, le ore lavorate e le valutazioni
  const [balance, setBalance] = useState<number>(0);
  const [offeredServices, setOfferedServices] = useState<any[]>([]);  // Stato inizializzato come array vuoto
  const [requestedServices, setRequestedServices] = useState<any[]>([]);  // Stato inizializzato come array vuoto
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [ratings, setRatings] = useState<number | null>(null);

  // Funzione per aggiornare il bilancio
  const refreshBalance = async () => {
    const updatedBalance = await fetchBalance();
    setBalance(updatedBalance);  // Aggiorna il bilancio
  };

  // Funzione per gestire il completamento di un servizio
  const completeService = async (id: number, hours: number, rating: number) => {
    await handleCompleteService(id, hours, rating);  // Completa il servizio
    // Dopo il completamento, ricarica i servizi richiesti
    const updatedRequestedServices = await fetchRequestedServices();
    setRequestedServices(updatedRequestedServices || []);  // Aggiorna i servizi richiesti
  };

  // Effettua il fetch iniziale di bilancio, servizi offerti e richiesti quando il componente si monta
  useEffect(() => {
    const fetchData = async () => {
      const balance = await fetchBalance();  // Recupera il bilancio
      setBalance(balance);  // Imposta il bilancio

      const offeredServices = await fetchOfferedServices();  // Recupera i servizi offerti
      setOfferedServices(offeredServices || []);  // Imposta i servizi offerti, fallback a array vuoto

      const requestedServices = await fetchRequestedServices();  // Recupera i servizi richiesti
      setRequestedServices(requestedServices || []);  // Imposta i servizi richiesti, fallback a array vuoto
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>User Page</h1>
      <h2>Your Balance: {balance} CT (Tokens)</h2>
      <button onClick={refreshBalance}>Refresh Balance</button>

      <div>
        <h2>My Offered Services</h2>
        {offeredServices.length > 0 ? (
          offeredServices.map((service) => (
            <div key={service.id}>
              <p>ID: {service.id}</p>
              <p>Description: {service.description}</p>
              <p>Rate: {service.rate} Tokens/hour</p>
            </div>
          ))
        ) : (
          <p>No offered services available.</p>
        )}
      </div>

      <div>
        <h2>My Taken Requests</h2>
        {requestedServices.length > 0 ? (
          requestedServices.map((request) => (
            <div key={request.id}>
              <p>ID: {request.id}</p>
              <p>Description: {request.description}</p>
              {!request.isFulfilled && (
                <div>
                  <input
                    type="number"
                    placeholder="Hours Worked"
                    onChange={(e) => setHoursWorked(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Rating (1-5)"
                    onChange={(e) => setRatings(Number(e.target.value))}
                  />
                  <button onClick={() => completeService(request.id, hoursWorked, ratings || 0)}>
                    Complete Request
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No requests taken yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;

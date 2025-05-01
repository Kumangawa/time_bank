import React, { useState } from 'react';
import { requestService, takeRequest } from "../utils/TimeBankFunctions"; // Importa le funzioni direttamente

const RequestsPage: React.FC = () => {
  // Gestisci lo stato localmente nel componente
  const [requestDescription, setRequestDescription] = useState<string>(''); 
  const [requestedServices, setRequestedServices] = useState<any[]>([]);

  const handleRequestService = async () => {
    const updatedServices = await requestService(requestDescription);  // Chiamata alla funzione per richiedere il servizio
    if (updatedServices) {
        setRequestedServices(updatedServices);  // Aggiorna lo stato con la nuova lista
      }
    setRequestDescription('');  // Reset dell'input dopo aver fatto la richiesta
    // Aggiungi qui una logica per aggiornare la lista dei servizi richiesti, se necessario
  };

  const handleTakeRequest = async (id: number) => {
    await takeRequest(id); // Chiamata alla funzione per prendere una richiesta
    // Aggiungi qui una logica per aggiornare la lista dei servizi richiesti, se necessario
  };

  return (
    <div className="container">
      <h1>Service Requests</h1>

      <div>
        <h2>Create a Request</h2>
        <input
          type="text"
          placeholder="Request Description"
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
        />
        <button onClick={handleRequestService}>Request Service</button>
      </div>

      <div>
        <h2>Available Requests</h2>
        {requestedServices.map((request) => (
          <div key={request.id}>
            <p>ID: {request.id}</p>
            <p>Description: {request.description}</p>
            <button onClick={() => handleTakeRequest(request.id)}>Take Request</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;

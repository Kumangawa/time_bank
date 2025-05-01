import React, { useState, useEffect } from 'react';
import { offerService, bookService, fetchOfferedServices } from "../utils/TimeBankFunctions";  // Importa le funzioni

const ServicesPage: React.FC = () => {
  // Stato per la descrizione del servizio, tariffa e lista dei servizi offerti
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceRate, setServiceRate] = useState<number>(0);
  const [offeredServices, setOfferedServices] = useState<any[]>([]);

  // Funzione per offrire un servizio
  const handleOfferService = async () => {
    const updatedServices = await offerService(serviceDescription, serviceRate);  // Offriamo il servizio
    if (updatedServices) {
      setOfferedServices(updatedServices);  // Aggiorna la lista dei servizi offerti
    }
    setServiceDescription('');  // Reset dell'input dopo aver offerto il servizio
    setServiceRate(0);  // Reset della tariffa
  };

  // Funzione per prenotare un servizio
  const handleBookService = async (id: number) => {
    await bookService(id);  // Prenota il servizio
    // Ricarica la lista dei servizi offerti
    const updatedServices = await fetchOfferedServices();
    if (updatedServices) {
      setOfferedServices(updatedServices);  // Aggiorna la lista dei servizi offerti
    }
  };

  // Effettua il fetch iniziale dei servizi offerti quando il componente si monta
  useEffect(() => {
    const fetchServices = async () => {
        const services = await fetchOfferedServices();
        // Aggiungi il controllo per evitare che `services` sia undefined
        setOfferedServices(services || []); // Se `services` è undefined, usa un array vuoto
      };
    fetchServices();
  }, []);

  return (
    <div className="container">
      <h1>Services</h1>

      <div>
        <h2>Offer a Service</h2>
        <input
          type="text"
          placeholder="Service Description"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rate (tokens/hour)"
          value={serviceRate}
          onChange={(e) => setServiceRate(Number(e.target.value))}
        />
        <button onClick={handleOfferService}>Offer Service</button>
      </div>

      <div>
        <h2>Available Services</h2>
        {offeredServices.map((service) => (
          <div key={service.id}>
            <p>ID: {service.id}</p>
            <p>Description: {service.description}</p>
            <p>Rate: {service.rate} CT/hour</p>
            <button onClick={() => handleBookService(service.id)}>Book Service</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;

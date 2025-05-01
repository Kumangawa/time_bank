import { ethers } from "ethers";
import { getTimeBankContract, getTimeBankSigner } from "./TimeBankContract";

// Funzione per registrare un utente
export const registerUser = async () => {
  try {
    const tx = await getTimeBankContract().registerUser();
    await tx.wait();
    return "User registered successfully!";
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

  // Funzione per ottenere il bilancio
export const fetchBalance = async () => {
    try {
        const userBalance = await getTimeBankContract().getBalance(getTimeBankSigner().address);
        return Number(ethers.formatEther(userBalance));
    } catch (error) {
        console.error("Error fetching balance:", error);
        throw error;
    }
};

export const fetchMyTakenRequests = async () => {
    try {
        const requestCount = await getTimeBankContract().requestedServicesCount();
        const myRequestsArray = [];
        const userAddress = await getTimeBankSigner().getAddress();
        
        for (let i = 0; i < requestCount; i++) {
        const request = await getTimeBankContract().getRequestedService(i);
        if (request.takenBy.toLowerCase() === userAddress.toLowerCase()) {
            myRequestsArray.push({
            id: request.id,
            requester: request.requester,
            description: request.description,
            isFulfilled: request.isFulfilled,
            });
        }
        }
        return myRequestsArray;
    } catch (error) {
        console.error("Error fetching taken requests:", error);
    }
};


// Offer service function
export const offerService = async (description: string, rate: number) => {
    try {
        // Offriamo il servizio
        const tx = await getTimeBankContract().offerService(description, rate);
        await tx.wait();  // Aspetta che la transazione venga confermata
        alert('Service offered successfully!');

        await fetchOfferedServices();
        
        // Dopo aver offerto il servizio, aggiorniamo l'elenco dei servizi offerti
        const allOfferedServices = await getTimeBankContract().getAllOfferedServices();
        return allOfferedServices;  // Restituiamo la lista aggiornata dei servizi offerti
    } catch (error) {
        console.error('Error offering service:', error);
    }
};

// Request service function
export const requestService = async (requestDescription: string) => {
    try {
        // Effettua la richiesta di servizio
        const tx = await getTimeBankContract().requestService(requestDescription);
        await tx.wait(); // Aspetta che la transazione venga confermata
        alert('Service requested successfully!');

        // Dopo aver richiesto il servizio, aggiorniamo la lista dei servizi richiesti
        const allRequestedServices = await getTimeBankContract().getAllRequestedServices();
        return allRequestedServices;
    } catch (error) {
        console.error('Error requesting service:', error);
    }
};

// Funzione per prenotare un servizio offerto
export const bookService = async (serviceId: number) => {
    try {
    const tx = await getTimeBankContract().bookService(serviceId);
    await tx.wait();
    alert("Service booked successfully!");
    await fetchOfferedServices(); // Aggiorna la lista dei servizi offerti
    } catch (error) {
    console.error("Error booking service:", error);
    }
};

export const handleCompleteService = async (requestId: number, hoursWorked: number, rating: number) => {
    try {
    // Recupera i dettagli della richiesta
    const details = await getTimeBankContract().getRequestedService(requestId);
    const userAddress = await getTimeBankSigner().getAddress();

    // Controlla se l'utente connesso è il lavoratore assegnato
    if (details.takenBy.toLowerCase() !== userAddress.toLowerCase()) {
        alert("Io sono" + userAddress.toLowerCase());
        alert("Preso da: " + details.takenBy.toLowerCase());

        alert("Non sei autorizzato a completare questa richiesta.");
        return;
    }

    // Completa la richiesta
    await completeRequestedService(requestId, hoursWorked, rating);
    alert("Richiesta completata con successo!");
    } catch (error) {
    console.error("Errore durante il completamento della richiesta:", error);
    }
};


// Funzione per completare un servizio richiesto
export const completeRequestedService = async (requestId: number, hoursWorked: number, rating: number) => {
    try {
    const tx = await getTimeBankContract().completeRequestedService(requestId, hoursWorked, rating);
    await tx.wait();
    alert("Requested service completed successfully!");
    await fetchTransactions();
    await fetchRequestedServices(); // Aggiorna la lista dei servizi richiesti
    } catch (error) {
    console.error("Error completing requested service:", error);
    }
};

// Funzione per completare un servizio offerto
export const completeOfferedService = async (serviceId: number, rating: number) => {
    try {
    console.log("Completing offered service with:", { serviceId, rating });
    const tx = await getTimeBankContract().completeOfferedService(serviceId, rating);

    // Controlla se tx è undefined
    if (!tx) {
        throw new Error("Transaction object is undefined");
    }

    console.log("Transaction:", tx);

    await tx.wait();
    alert("Offered service completed successfully!");

    // Aggiorna la lista dei servizi offerti
    await fetchTransactions();
    await fetchOfferedServices(); 
    } catch (error) {
    console.error("Error completing offered service:", error);
    }
};

// Fetch transactions history
export const fetchTransactions = async () => {
    try {
        // Chiamata al contratto per ottenere tutte le transazioni
        const allTransactions = await getTimeBankContract().getAllTransactions();
        // Converti i valori a un formato leggibile
        const formattedTransactions = allTransactions.map((tx: any) => ({
        from: tx.from,
        to: tx.to,
        amount: ethers.formatUnits(tx.amount, 18), // Se `amount` è in wei
        description: tx.description,
        }));
        return formattedTransactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Fetch offered services
export const fetchOfferedServices = async () => {
    try {
        const serviceCount = await getTimeBankContract().offeredServicesCount();
        const servicesArray = [];
        for (let i = 0; i < serviceCount; i++) {
        const service = await getTimeBankContract().getOfferedService(i);
        servicesArray.push({
            id: service.id,
            provider: service.provider,
            description: service.description,
            rate: Number(ethers.formatEther(service.rate)),
        });
        }
        return servicesArray;
    } catch (error) {
        console.error('Error fetching offered services:', error);
    }
};

export const takeRequest = async (requestId: number) => {
    try {
        const tx = await getTimeBankContract().takeRequest(requestId);
        await tx.wait();
        alert("Request taken successfully!");
        await fetchRequestedServices(); // Aggiorna l'elenco delle richieste
        await fetchMyTakenRequests();
    } catch (error) {
        console.error("Error taking request:", error);
    }
};

// Fetch requested services
export const fetchRequestedServices = async () => {
    try {
        const requestCount = await getTimeBankContract().requestedServicesCount();
        const requestsArray = [];
        for (let i = 0; i < requestCount; i++) {
        const request = await getTimeBankContract().getRequestedService(i);
        requestsArray.push({
            id: request.id,
            requester: request.requester,
            description: request.description,
        });
        }
        return requestsArray;
    } catch (error) {
        console.error('Error fetching requested services:', error);
    }
};

// Fetch all users
export const fetchUsers = async () => {
    try {
        const usersArray = [];
        const serviceCount = await getTimeBankContract().offeredServicesCount();
        for (let i = 0; i < serviceCount; i++) {
        const service = await getTimeBankContract().getOfferedService(i);
        usersArray.push(service.provider);
        }

        const requestCount = await getTimeBankContract().requestedServicesCount();
        for (let i = 0; i < requestCount; i++) {
        const request = await getTimeBankContract().getRequestedService(i);
        usersArray.push(request.requester);
        }

        const uniqueUsers = [...new Set(usersArray)];
        return uniqueUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
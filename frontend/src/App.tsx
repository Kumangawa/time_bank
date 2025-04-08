import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { ethers, Wallet } from 'ethers';
import { PokemonCardManager__factory } from './contracts-types/factories';

function App() {
  const [count, setCount] = useState(0);
  const [contractAddress, setContractAddress] = useState('');
  const [cardInfo, setCardInfo] = useState<any>(null);

  const createPokemonCard = async (
    name: string,
    pokemonType: number,
    rarity: number,
    ownerAddress: string
  ) => {
    try {
      console.log('createPokemonCard method is being called...');
      const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; 
      
      // Connessione al contratto e invio della transazione
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      console.log('la connessione al contratto e invio della transazione non ha dato problemi');

      // Non risolvere l'indirizzo ENS, usa direttamente l'indirizzo
      const signer = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
      console.log('Il wallet e\' stato creato senza problemi');
      
      const pokemonCardManager = PokemonCardManager__factory.connect(contractAddress, signer);
      console.log('La connessione al factory method è andato bene');

      // Chiamata per creare una carta
      const tx = await pokemonCardManager.createPokemonCard(
        name, pokemonType, rarity, ethers.getAddress(ownerAddress)
      );
      console.log('Transaction sent:', tx);
      
      // Aspetta che la transazione venga confermata
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Dopo aver creato la carta, ottieni le informazioni
      await getCardInfo();
    } catch (error) {
      console.error('Error during creating Pokemon card:', error);
    }
  };
  

  const getCardInfo = async () => {
    try {
      // Usa il contratto con l'indirizzo corretto
      const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Usa il tuo contratto distribuito
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      
      // Connessione al contratto
      const pokemonCardManager = PokemonCardManager__factory.connect(contractAddress, provider);
      
      // Ottieni informazioni su una carta Pokémon, ad esempio con ID 0
      const cardId = 0; // ID della carta Pokémon che vuoi visualizzare
      const card = await pokemonCardManager.getPokemonCardById(cardId);
      
      console.log('Card info retrieved:', card); // Aggiungi un log per vedere i dettagli della carta
  
      // Aggiorna lo stato con i dati della carta
      setCardInfo(card);
      setContractAddress(contractAddress);
      setCount(Number(card.level)); // Puoi usare count per visualizzare il livello della carta
    } catch (error) {
      console.error('Error during getting card info:', error);
    }
  };
  

  useEffect(() => {
    getCardInfo(); // Richiama la funzione per ottenere le informazioni della carta all'avvio
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React</h1>
      <div className="card">
        <span>{contractAddress}</span>
        <hr />
        {cardInfo ? (
          <div>
            <h3>Pokemon Card Info:</h3>
            <p>Card ID: {cardInfo.id}</p>
            <p>Name: {cardInfo.name}</p>
            <p>Type: {cardInfo.pokemonType}</p>
            <p>Rarity: {cardInfo.rarity}</p>
            <p>Level: {cardInfo.level}</p>
            <p>Attack Power: {cardInfo.attackPower}</p>
            <p>Owner: {cardInfo.cardOwner}</p>
          </div>
        ) : (
          <p>Loading Pokemon Card...</p>
        )}
        <hr />
        <button
          onClick={() =>
            createPokemonCard('Pikachu', 2, 1, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
          }
        >
          Create Pokemon Card
        </button>
        <hr />
        <button onClick={() => setCount(count + 1)}>Increment Level</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

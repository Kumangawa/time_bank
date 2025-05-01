import { ethers, Wallet } from "ethers";
import { TimeBank__factory } from '../contracts-types/factories/TimeBank__factory';
import { TimeBank } from "../contracts-types";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
var signer = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
var timeBankContract = TimeBank__factory.connect(contractAddress, signer);
/** 
// Variabili globali
let signer: ethers.JsonRpcSigner | undefined;
var signerForces: ethers.Wallet;
let timeBankContract: TimeBank | undefined;
*/

// Funzione per inizializzare il provider, signer e contratto
export const initializeBlockchain = async () => {
  /*
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this app.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum as any);
  signer = await provider.getSigner();

  // Inizializza l'istanza del contratto
  timeBankContract = TimeBank__factory.connect(contractAddress, signer);

  console.log("Blockchain initialized successfully.");
  console.log("Connected account:", await signer.getAddress());

  // Verifica se l'utente è già registrato, se no, registra l'utente
  const account = await signer.getAddress();
  const isRegistered = await timeBankContract.users(account); // supponendo che il mapping `users` esista
  if (!isRegistered) {
    console.log("User not registered. Registering...");
    const tx = await timeBankContract.registerUser(); // Registrazione dell'utente
    await tx.wait();
    console.log("User registered successfully.");
  } else {
    console.log("User is already registered.");
  }
    */
};

export const getTimeBankContract = () => {
  if (!timeBankContract) {
    throw new Error("Blockchain is not initialized. Call initializeBlockchain first. Contract problem");
  }
  return timeBankContract;
};

export const getTimeBankSigner = () => {
  if (!signer) {
    throw new Error("Blockchain is not initialized. Call initializeBlockchain first. Signer problem");
  }
  return signer;
};

export const registerForzedUser = async () => {
  try {
    timeBankContract = TimeBank__factory.connect(contractAddress, signer);
    const tx = await timeBankContract.registerUser();
    await tx.wait();  // Aspetta che la transazione venga confermata
    alert('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};
/** 
import React from 'react';
import { registerUser } from "../utils/TimeBankFunctions";


const RegisterPage: React.FC = () => {
    return (
      <div className="container">
        <h1>Register</h1>
        <button onClick={registerUser}>Register as First User</button>
      </div>
    );
  };


export default RegisterPage;



import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// Definire il connettore per MetaMask
const injected = new InjectedConnector({ supportedChainIds: [31337] }); // Usa Chain ID per la tua chain locale

// Definire il connettore per WalletConnect
const walletconnect = new WalletConnectConnector({
  rpc: { 31337: 'http://127.0.0.1:8545' }, // RPC URL della tua blockchain locale
  qrcode: true,
});

const RegisterPage: React.FC = () => {
  const { activate, deactivate, account } = useWeb3React();
  const [activating, setActivating] = useState(false);

  const connectMetaMask = () => {
    activate(injected);
  };

  const connectWalletConnect = () => {
    setActivating(true);
    activate(walletconnect);
  };

  const disconnect = () => {
    deactivate();
  };

  const handleRegister = () => {
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }
    // Qui gestisci la logica per la registrazione, ad esempio memorizzare l'indirizzo dell'account
    console.log('Account registered:', account);
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {!account ? (
        <div>
          <button onClick={connectMetaMask}>Connect MetaMask</button>
          <button onClick={connectWalletConnect} disabled={activating}>
            {activating ? 'Connecting...' : 'Connect WalletConnect'}
          </button>
        </div>
      ) : (
        <div>
          <p>Connected to {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}

      <div>
        <button onClick={handleRegister}>Register with Wallet</button>
      </div>
    </div>
  );
};

export default RegisterPage;

*/

// RegisterPage.tsx
import React, { useEffect } from 'react';
import { metaMask, hooks } from '../connectors';
import { initializeBlockchain } from "../utils/TimeBankContract";
import { registerForzedUser } from "../utils/TimeBankContract";

const { useAccount, useIsActive, useProvider } = hooks;

const RegisterPage: React.FC = () => {
  const account = useAccount();
  const isActive = useIsActive();
  const provider = useProvider();

  // Connetti MetaMask
  const connectWallet = async () => {
    try {
      await metaMask.activate(); // Attiva il connettore MetaMask
      console.log('MetaMask connected!');
      await initializeBlockchain();
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  const connectForced = async () => {
        await registerForzedUser();
  };


  // Log dello stato della connessione
  useEffect(() => {
    if (isActive && provider) {
      console.log('Connected account:', account);
    }
  }, [isActive, account, provider]);


  return (
    <div className="register-container">
      <h1>Register</h1>
      {!isActive ? (
        <div>
          <button onClick={connectWallet}>Connect MetaMask</button>
          <button onClick={connectForced}>Connessione Forzata</button>
        </div>
      ) : (
        <div>
          <p>Connected to {account}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;


import { ethers } from 'hardhat';
import {PokemonCardManager__factory} from "../typechain-types";


const deploy = async () =>{

    const signer = (await ethers.getSigners())[0];

    
    console.log(`Deploying PokemonCardManager with signer: ${signer.address}`);

    // Deploy del contratto
    const pokemonCardManagerDeployTx = await new PokemonCardManager__factory(signer).deploy();

    // Attendi che il contratto venga effettivamente deployato e ottieni l'indirizzo
    const contractAddress = await pokemonCardManagerDeployTx.getAddress();

    console.log(`PokemonCardManager deployed at ${contractAddress}`);
};

deploy().catch((error) => {
    console.error("Error deploying PokemonCardManager:", error);
    process.exitCode = 1;
});
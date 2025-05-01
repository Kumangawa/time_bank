import { ethers } from 'hardhat';
import { TimeBank__factory } from '../typechain-types/factories';

const deploy = async () => {
    const signer = (await ethers.getSigners())[0];

    console.log(`Deploying TimeBank contract with signer: ${signer.address}`);

    // Deploy the TimeBank contract
    const initialSupply = ethers.parseEther('10000'); // Example: 10,000 tokens
    const timeBankContract = await new TimeBank__factory(signer).deploy(initialSupply);

    // Wait for the deployment to complete and get the address
    const contractAddress = await timeBankContract.getAddress();

    console.log(`TimeBank deployed at ${contractAddress}`);
};

deploy().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});
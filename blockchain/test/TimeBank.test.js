const { expect } = require("chai");  // Importa chai e expect
const { ethers } = require("hardhat");

describe("TimeBank Contract", function () {
    let timeBank;
    let owner;
    let addr1;
    let addr2;
    let initialSupply;

    beforeEach(async function () {
        // Ottieni i signers (indirizzi per testare)
        [owner, addr1, addr2] = await ethers.getSigners();

        // Imposta l'importo iniziale della supply
        initialSupply = ethers.parseEther("10000");  // 10,000 tokens

        // Deploy del contratto TimeBank
        const TimeBank = await ethers.getContractFactory("TimeBank");
        timeBank = await TimeBank.deploy(initialSupply);
    });

    it("should deploy the contract and initialize the owner balance", async function () {
        // Verifica se il contratto è stato distribuito
        expect(timeBank.address).to.be.properAddress;

        // Verifica che il saldo del proprietario sia inizializzato correttamente
        const ownerBalance = await timeBank.getBalance(owner.address);
        expect(ownerBalance).to.equal(initialSupply);
    });

    it("should allow a user to register", async function () {
        // Registra un nuovo utente
        await timeBank.connect(addr1).registerUser();

        // Verifica che l'utente sia stato registrato
        const isRegistered = await timeBank.users(addr1.address);
        expect(isRegistered).to.equal(true);
    });

    it("should allow a registered user to offer a service", async function () {
        // Registra un utente
        await timeBank.connect(addr1).registerUser();

        // Offri un servizio
        const description = "Web development";
        const rate = ethers.parseUnits("5", "ether");
        await timeBank.connect(addr1).offerService(description, rate);

        // Verifica che il servizio sia stato offerto correttamente
        const services = await timeBank.getAllOfferedServices();
        expect(services.length).to.equal(1);
        expect(services[0].provider).to.equal(addr1.address);
        expect(services[0].description).to.equal(description);
        expect(services[0].rate).to.equal(rate);
    });

    it("should allow a user to book a service", async function () {
        // Registra due utenti
        await timeBank.connect(addr1).registerUser();
        await timeBank.connect(addr2).registerUser();

        // Offri un servizio
        const description = "Web development";
        const rate = ethers.parseUnits("5", "ether");
        await timeBank.connect(addr1).offerService(description, rate);

        // Prenota il servizio
        await timeBank.connect(addr2).bookService(0);

        // Verifica che il servizio sia stato prenotato
        const service = await timeBank.getOfferedService(0);
        expect(service.reservedBy).to.equal(addr2.address);
    });

    it("should allow a user to complete a booked service", async function () {
        // Registra due utenti
        await timeBank.connect(addr1).registerUser();
        await timeBank.connect(addr2).registerUser();

        // Offri un servizio
        const description = "Web development";
        const rate = ethers.parseUnits("5", "ether");
        await timeBank.connect(addr1).offerService(description, rate);

        // Prenota il servizio
        await timeBank.connect(addr2).bookService(0);

        // Completa il servizio
        await timeBank.connect(addr2).completeOfferedService(0, 5); // 5 ore lavorate

        // Verifica che i saldi siano aggiornati correttamente
        const addr1Balance = await timeBank.getBalance(addr1.address);
        const addr2Balance = await timeBank.getBalance(addr2.address);

        expect(addr1Balance).to.equal(rate);
        expect(addr2Balance).to.equal(initialSupply.sub(rate)); // Saldo iniziale - pagamento
    });

    it("should allow a user to rate another user", async function () {
        // Registra due utenti
        await timeBank.connect(addr1).registerUser();
        await timeBank.connect(addr2).registerUser();

        // Offri un servizio
        const description = "Web development";
        const rate = ethers.parseUnits("5", "ether");
        await timeBank.connect(addr1).offerService(description, rate);

        // Prenota il servizio
        await timeBank.connect(addr2).bookService(0);

        // Completa il servizio
        await timeBank.connect(addr2).completeOfferedService(0, 5); // 5 ore lavorate

        // Lascia una valutazione
        const rating = 4;  // Valutazione 4 su 5
        await timeBank.connect(addr2).rateUser(addr1.address, rating);

        // Verifica che la valutazione sia stata registrata
        const userRating = await timeBank.ratings(addr1.address);
        expect(userRating).to.equal(rating);
    });
});

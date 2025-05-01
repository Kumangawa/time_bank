// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimeBank {

    event RequestTaken(uint256 indexed requestId, address indexed worker);
    event ServiceBooked(uint256 indexed serviceId, address indexed requester);
    event ServiceCompleted(uint256 indexed serviceId, address indexed provider, address indexed requester);
    event ServiceOffered(uint256 indexed serviceId, address indexed provider, string description, uint256 rate);
    event ServiceRequested(uint256 indexed requestId, address indexed requester, string description);
    event TokenTransferred(address indexed from, address indexed to, uint256 amount);
    event UserRated(address indexed user, uint256 rating);



    address public owner;

    struct Service {
        uint256 id;
        address provider;
        string description;
        uint256 rate; // rate in tokens/hour
        bool isAvailable;
        uint256 valuation;
        address reservedBy;
    }

    struct ServiceRequest {
        uint256 id;
        address requester;
        string description;
        uint256 rate;
        address takenBy;
        bool isFulfilled;
        uint256 valuation;
    }

    struct Transaction {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        string description;
    }

    uint256 public totalSupply;
    uint256 public serviceCount;
    uint256 public requestCount;
    uint256 public transactionCount;

    mapping(address => uint256) public balances;
    mapping(uint256 => Service) public services;
    mapping(uint256 => ServiceRequest) public serviceRequests;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256) public ratings;
    mapping(address => bool) public users;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender], "User not registered");
        _;
    }

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        balances[owner] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Booking functionalities
    function bookService(uint256 serviceId) public onlyRegistered {
        Service storage service = services[serviceId];
        require(service.isAvailable, "Service not available");
        require(service.reservedBy == address(0), "Service already reserved");
        service.reservedBy = msg.sender;
        emit ServiceBooked(serviceId, msg.sender);
    }

    // Prendere in carico una richiesta di servizio
    function takeRequest(uint256 requestId) public onlyRegistered {
        ServiceRequest storage request = serviceRequests[requestId];
        require(request.takenBy == address(0), "Request already taken");
        require(!request.isFulfilled, "Request already fulfilled");
        request.takenBy = msg.sender;
        emit RequestTaken(requestId, msg.sender);
    }

    // functionalities for complete a requested service 
    function completeRequestedService(uint256 requestId, uint256 hoursWorked, uint256 rating) public onlyRegistered {
        ServiceRequest storage request = serviceRequests[requestId];
        require(request.takenBy == msg.sender, "Only the worker can complete this request");
        require(!request.isFulfilled, "Request already fulfilled");

        uint256 payment = hoursWorked;
        require(balances[request.requester] >= payment, "Requester has insufficient tokens");

        balances[request.requester] -= payment;
        balances[msg.sender] += payment;

        request.isFulfilled = true;
        request.valuation = rating;

        transactions[transactionCount++] = Transaction({
            id: transactionCount,
            from: request.requester,
            to: msg.sender,
            amount: payment,
            description: request.description
        });

        emit ServiceCompleted(requestId, msg.sender, request.requester);
    }

    // functionalities for complete an offered service  
    function completeOfferedService(uint256 serviceId, uint256 rating) public onlyRegistered {
        Service storage service = services[serviceId];
        require(service.reservedBy == msg.sender, "Only the reserver can complete this service");
        require(service.isAvailable, "Service already completed or unavailable");

        uint256 payment = service.rate;
        require(balances[msg.sender] >= payment, "Insufficient tokens to pay for the service");

        balances[msg.sender] -= payment;
        balances[service.provider] += payment;

        service.isAvailable = false;
        service.valuation = rating;

        transactions[transactionCount++] = Transaction({
            id: transactionCount,
            from: msg.sender,
            to: service.provider,
            amount: payment,
            description: service.description
        });

        emit ServiceCompleted(serviceId, service.provider, msg.sender);
    }

    // Token functionalities
    function transferTokens(address to, uint256 amount) public onlyRegistered {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;

        transactions[transactionCount++] = Transaction({
            id: transactionCount,
            from: msg.sender,
            to: to,
            amount: amount,
            description: "Token transfer"
        });
        emit TokenTransferred(msg.sender, to, amount);
    }

    // Service functionalities
    function offerService(string memory description, uint256 rate) public onlyRegistered {
        require(rate > 0, "Rate must be greater than zero");
        uint256 serviceId = serviceCount++;
        services[serviceId] = Service(serviceId, msg.sender, description, rate, true, 0, address(0));
        emit ServiceOffered(serviceId, msg.sender, description, rate);
    }

    function requestService(string memory description) public onlyRegistered {
        uint256 requestId = requestCount++;
        serviceRequests[requestId] = ServiceRequest(requestId, msg.sender, description, 0, address(0), false, 0);
        emit ServiceRequested(requestId, msg.sender, description);
    }

    // Rating system
    function rateUser(address user, uint256 rating) public onlyRegistered {
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5");
        ratings[user] = rating;
        emit UserRated(user, rating);
    }

    // Utility functions
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    function getService(uint256 serviceId) public view returns (Service memory) {
        return services[serviceId];
    }

    function getServiceRequest(uint256 requestId) public view returns (ServiceRequest memory) {
        return serviceRequests[requestId];
    }

    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        return transactions[transactionId];
    }

    // Funzione per ottenere tutte le transazioni
    function getAllTransactions() public view returns (Transaction[] memory) {
        Transaction[] memory allTransactions = new Transaction[](transactionCount);
        for (uint256 i = 0; i < transactionCount; i++) {
            allTransactions[i] = transactions[i];
        }
        return allTransactions;
    }


    // Functions to get lists of services and requests
    function getAllOfferedServices() public view returns (Service[] memory) {
        Service[] memory allServices = new Service[](serviceCount);
        for (uint256 i = 0; i < serviceCount; i++) {
            allServices[i] = services[i];
        }
        return allServices;
    }

    function getAllRequestedServices() public view returns (ServiceRequest[] memory) {
        ServiceRequest[] memory allRequests = new ServiceRequest[](requestCount);
        for (uint256 i = 0; i < requestCount; i++) {
            allRequests[i] = serviceRequests[i];
        }
        return allRequests;
    }

    function getAllUsers() public view returns (address[] memory) {
        address[] memory allUsers = new address[](serviceCount);
        uint256 index = 0;
        for (address user = address(0); user < address(type(uint160).max); user = address(uint160(user) + 1)) {
            if (users[user]) {
                allUsers[index] = user;
                index++;
            }
        }
        return allUsers;
    }

    // Register users to the system
    function registerUser() public {
        require(!users[msg.sender], "User already registered");
        users[msg.sender] = true;
    }

    // Funzione per ottenere il numero di servizi offerti
    function offeredServicesCount() public view returns (uint256) {
        return serviceCount;
    }

    // Funzione per ottenere un servizio offerto dato l'indice
    function getOfferedService(uint256 serviceId) public view returns (Service memory) {
        return services[serviceId];
    }

    // Funzione per ottenere il numero di richieste di servizio
    function requestedServicesCount() public view returns (uint256) {
        return requestCount;
    }

    // Funzione per ottenere una richiesta di servizio dato l'indice
    function getRequestedService(uint256 requestId) public view returns (ServiceRequest memory) {
        return serviceRequests[requestId];
    }

}

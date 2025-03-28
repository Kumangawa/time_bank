// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract PokemonCardManager{
    

    event NewCardCreated(uint _id,string name);
    event CardTransfered(address _from, address _to);
    event CardLevelUp(uint _id, uint _level, uint _attackPower);
    
    address public owner;

    enum Rarity{
        COMMON,
        UNCOMMON,
        RARE
    }

    enum PokemonType{
        NORMAL,
        FIRE,
        ELECTRIC,
        WATER,
        GRASS,
        POISON,
        FIGHTING,
        PSYCHIC,
        ICE,
        BUG,
        ROCK,
        GHOST,
        DRAGON
    }
    
    struct PokemonCard{
        uint256 id;
        PokemonType pokemonType;
        Rarity rarity;
        string name;
        uint level;
        uint attackPower;
        address cardOwner;
    }

    mapping(uint => PokemonCard) cards;
    mapping(address => uint[]) ownerToCards;
    uint public cardCount=0;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Caller is not the contract deployer");
        _;
    }

    modifier onlyCardOwner(uint _cardId) {
        require(cards[_cardId].cardOwner == msg.sender, "Caller is not the card owner");
        _;
    }

    modifier cardExists(uint _cardId) {
        require(_cardId < cardCount, "Card does not exist");
        _;
    }


    function createPokemonCard(string memory _name, uint _pokemonType, uint _rarity, address _cardOwner) public onlyOwner {
        require(bytes(_name).length > 0, "Card name cannot be empty");
        require(_cardOwner != address(0), "Card owner address cannot be zero");
        require(_pokemonType < uint(PokemonType.DRAGON) + 1, "Invalid Pokemon type");
        require(_rarity < uint(Rarity.RARE) + 1, "Invalid rarity");
        
        uint id = cardCount++;
        PokemonCard memory card = PokemonCard({id: id, name: _name, pokemonType: (PokemonType(_pokemonType)), rarity: Rarity(_rarity), level: 1, attackPower: (_rarity + 1), cardOwner: _cardOwner});
        cards[id] = card;
        ownerToCards[_cardOwner].push(id);
        emit NewCardCreated(id, _name);
    }

    function getPokemonCardById(uint _cardId) public view returns(uint id, string memory name, uint pokemonType, uint rarity, uint level, uint attackPower, address cardOwner) {
            PokemonCard memory card = cards[_cardId];
            return (card.id, card.name, uint(card.pokemonType), uint(card.rarity), uint(card.level), uint(card.attackPower), card.cardOwner);
    }

    function transferCardOwnership(uint _cardId, address _newOwner) public onlyCardOwner(_cardId) {
        require(_newOwner != address(0), "New owner must be a valid address");

        address previousOwner = cards[_cardId].cardOwner;
        cards[_cardId].cardOwner = _newOwner;

        removeCardFromOwner(previousOwner, _cardId);
        ownerToCards[_newOwner].push(_cardId);

        emit CardTransfered(msg.sender, _newOwner);
    }

    function removeCardFromOwner(address _owner, uint _cardId) private {
        uint[] storage cardList = ownerToCards[_owner];
        for (uint i = 0; i < cardList.length; i++) {
            if (cardList[i] == _cardId) {
                cardList[i] = cardList[cardList.length - 1];
                cardList.pop();
                break;
            }
        }
    }

    function getOwnerByCardId(uint _cardId) private view returns (address){
        ( , , , , , , address cardOwner) = this.getPokemonCardById(_cardId);
        return cardOwner;
    }

    function levelUp(uint _cardId) public onlyCardOwner(_cardId) {
        PokemonCard memory card = cards[_cardId];
        card.level++;
        card.attackPower = card.level * (uint(card.rarity) + 1);
        emit CardLevelUp(_cardId, card.level, card.attackPower);
    }

    function getMyCards() public view returns (uint[] memory) {
        return ownerToCards[msg.sender];
    }

}
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.5;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MarketPlace is ERC721URIStorage{
    using Counters for Counters.Counter;
    
    address owner;
    Counters.Counter private tokenIds;
    Counters.Counter private currentlyListed;
    uint256 listingPrice;
    mapping(uint => NFT) nftData;
    event TokenListingSuccess(uint indexed tokenId,address listedBy,uint price);
    
    struct NFT{
        uint tokenId;
        string name;
        address currOwner;
        address prevOwner;
        uint price;
        bool currentlyListed;
    }

    constructor() ERC721("skaMarket","SKA"){
        owner = payable(msg.sender);
        listingPrice = 10**8;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"Only the contract deployer can call this function");
        _;
    }

    function updateListPrice(uint newPrice) public onlyOwner{
        listingPrice = newPrice;
    }

    function countOfListedTokens() public view returns(uint){
        return currentlyListed.current();
    }

    function countOFTokens() public view returns(uint){
        return tokenIds.current();
    }

    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }
    
    function createToken(string memory tokenURI,string memory name) public returns(uint){
        tokenIds.increment();
        uint tokenId = tokenIds.current();
        _safeMint(msg.sender,tokenId);
        _setTokenURI(tokenId,tokenURI);
        nftData[tokenId] = NFT(
            tokenId,
            name,
            msg.sender,
            address(0),
            0 ether,
            false   
        );
        return tokenId;
    }
    
    // function to list token
    function listToken(uint tokenId, uint price) public payable{
        require(msg.value >= listingPrice,"Not enough ether to list the token");
        address currOwner = nftData[tokenId].currOwner;
        require(msg.sender == currOwner);
        nftData[tokenId].currentlyListed = true;
        nftData[tokenId].price = price;
        currentlyListed.increment();

        // transferring listing-price to the owner
        payable(owner).transfer(listingPrice);
        // approving the smart-contract to transfer the token on behalf of the user
        // approve(address(this),tokenId);
        emit TokenListingSuccess(tokenId,msg.sender,price);
    }
    
    function updateTokenPrice(uint tokenId,uint newPrice) public{
        address tokenOwner = nftData[tokenId].currOwner;
        require(tokenOwner == msg.sender);
        nftData[tokenId].price = newPrice;
    }

    function getAllTokens() public view returns(NFT[] memory){
        uint tokenCount = tokenIds.current();
        NFT[] memory tokens = new NFT[](tokenCount);

        for(uint i = 0; i < tokenCount; i++){
            uint currId = i+1;
            NFT storage currToken = nftData[currId];
            tokens[i] = currToken;
        }
            
        return tokens;
    }

    function getListedTokens() public view returns(NFT[] memory){
        uint total = tokenIds.current();
        uint listedTokenCount = currentlyListed.current();
        
        NFT[] memory listedTokens = new NFT[](listedTokenCount);
        
        uint ind = 0;
        for(uint i = 1; i <= total; i++){
            if(nftData[i].currentlyListed == true){
               NFT storage currToken = nftData[i];
               listedTokens[ind] =  currToken;
               ind++;
            }
        }
        return listedTokens;
    }
    
    function buyToken(uint tokenId) public payable{
        uint price = nftData[tokenId].price;
        require(nftData[tokenId].currentlyListed == true, "Can't buy an unlisted NFt");
        require(msg.value >= price,"Not enough ether to buy the token");
        
        address seller = nftData[tokenId].currOwner;
        address buyer = msg.sender;
        _transfer(seller,buyer,tokenId);

        nftData[tokenId].currentlyListed = false;
        nftData[tokenId].currOwner = buyer;
        nftData[tokenId].prevOwner = seller;
        currentlyListed.decrement();

        payable(seller).transfer(price);
    }
    
    function getMyTokens(address user) public view returns(NFT[] memory){
        uint total = tokenIds.current();
        uint myTokens = 0;
        
        for(uint i = 1; i <= total; i++){
            if(nftData[i].currOwner == user) myTokens++;
        }

        NFT[] memory tokens = new NFT[](myTokens);
        uint ind = 0;
        for(uint i = 1; i <= total; i++){
            if(nftData[i].currOwner == user){
                tokens[ind] = nftData[i];
                ind++;
            }
        }
        return tokens;
    }

    function getTokenPrice(uint tokenId) public view returns(uint){
        return nftData[tokenId].price;
    }

}
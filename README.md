# nftMarketPlace
NFT Market Place built on ethereum blockchain.

# Technologies used - 
### Frontend - 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Backend - 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### For writing Smart Contracts - 
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)

> Other: hardhat.js, ethers.js, openzeppelin


## Implementation details

ERC721 Token Standard has been used to write the smart-contract for nfts using openzeppelin.  
Here is the flow of nft token creation process - 
![flow](https://github.com/AsamShivaKumar/nftMarketPlace/blob/main/pics/flow2.png)

mongoDB has been used to save details about the user - (name & wallet address) and token data

Backend API endpoints - 

POST /user - *checks if a user with the given wallet address exists nad returns username if found*
POST /changeUserName - *changes the username with the given walletaddress*
POST /newToken - *creates a new token(nft)*
POST /token - *fetches the data(number of likes,number of views) of the token with gievn tokenId*
POST /increaseLikes - *increases/decreases number of likes of a token based on whether the user has liked it or not*
POST /increaseViews - *increases views of a token*

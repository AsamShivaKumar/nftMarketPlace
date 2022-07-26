
const run = async() =>{
    const [owner] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("MarketPlace");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Deployed by",owner.address,"to address",contract.address);

    var liPrice = await contract.getListingPrice();
    console.log("Listing price",Number(liPrice));

    const tokenId = await contract.createToken("https://gateway.pinata.cloud/ipfs/QmWXfTUf4ZKqvLjNj3fLMEecQRSScafpxxXL4MPpWqeyE5","ask");
    await tokenId.wait();
    let transaction = await contract.getAllTokens();
    console.log(transaction);
    await contract.listToken(1,hre.ethers.utils.parseEther("0.1"),{value: hre.ethers.utils.parseEther("0.0000001")});
    transaction = await contract.getListedTokens();
    console.log(transaction);
}

run()
.then(() => (process.exit(0)))
.catch((err) => {
    console.log(err);
    process.exit(1);
});
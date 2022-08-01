
const run = async() =>{
    const [owner] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("MarketPlace");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Deployed by",owner.address,"to address",contract.address);

    var liPrice = await contract.getListingPrice();
    console.log("Listing price",Number(liPrice));
    var tokens = await contract.getListedTokens();
    console.log(tokens);
}

run()
.then(() => (process.exit(0)))
.catch((err) => {
    console.log(err);
    process.exit(1);
});
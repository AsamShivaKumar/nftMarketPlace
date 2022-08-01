
const run = async () => {
    const [owner] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("NFTMarket");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Deployed by",owner.address,"to address",contract.address);
}

run()
.then(() => (process.exit(0)))
.catch((err) => {
    console.log(err);
    process.exit(1);
});
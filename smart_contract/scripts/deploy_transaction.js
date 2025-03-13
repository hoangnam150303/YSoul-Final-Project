async function main(){
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    await transactions.waitForDeployment();
    console.log("Transactions token deployed to:",await transactions.getAddress());
  }
  main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  });
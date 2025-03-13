async function main(){
    const message = "Hello World";
      const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await HelloWorld.deploy(message);
    await helloWorld.waitForDeployment();
    console.log("HelloWorld deployed to:", await helloWorld.getAddress());
       

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
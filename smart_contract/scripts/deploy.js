async function main(){
  const YS_Token = await ethers.getContractFactory("YS_Token");
  const ys_token = await YS_Token.deploy();
  await ys_token.waitForDeployment();
  console.log("YSoul token deployed to:",await ys_token.getAddress());
}
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
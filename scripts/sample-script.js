// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

  const feeSetter = owner.address
  //const tokenFeeAddress = addr1.address
  //const platformFeeAddress = addr2.address
  const tokenFeeAddress = "0x18747BE67c5886881075136eb678cEADaf808028"
  const platformFeeAddress = "0x853C123A64047fC78b88F1814B5f646a27AefCF5"

  const DummyToken = await ethers.getContractFactory("DummyToken");
  const WETH9 = await ethers.getContractFactory("WETH9");
  const MyToken = await ethers.getContractFactory("MyToken");
  const RibeSwapRouter = await ethers.getContractFactory("RibeSwapRouter");
  const RibeSwapRouter02Liquidity = await ethers.getContractFactory("RibeSwapRouter02Liquidity");
  const RibeSwapFactory = await ethers.getContractFactory("RibeSwapFactory");
  const HatiSacrifice = await ethers.getContractFactory("HatiSacrifice");

  console.log("Launching dummyTokenA")
  dummyTokenA = await MyToken.deploy("Token A", "TKNA", tokenFeeAddress);
  console.log("Launching dummyTokenB")
  dummyTokenB = await MyToken.deploy("Token B", "TKNB", tokenFeeAddress);
  console.log("Launching weth")
  weth = await WETH9.deploy();
  console.log("Launching dai")
  dai = await DummyToken.deploy("DAI", "DAI");
  console.log("Launching factory")
  factory = await RibeSwapFactory.deploy(feeSetter);
  console.log("Launching router")
  router = await RibeSwapRouter.deploy(factory.address, weth.address);
  console.log("Launching routerLiquidity")
  routerLiquidity = await RibeSwapRouter02Liquidity.deploy(factory.address, weth.address);
  console.log("Launching HatiSacrifice")
  hatiSacrifice = await HatiSacrifice.deploy();

  await dummyTokenA.deployed();
  console.log("dummyTokenA deployed")
  await dummyTokenB.deployed();
  console.log("dummyTokenB deployed")
  await weth.deployed();
  console.log("weth deployed")
  await dai.deployed();
  console.log("dai deployed")
  await factory.deployed();
  console.log("factory deployed")
  await router.deployed();
  console.log("router deployed")
  await routerLiquidity.deployed();
  console.log("routerLiquidity deployed")
  await hatiSacrifice.deployed();
  console.log("hatiSacrifice deployed")

  console.log("run setRouterAddress")
  await factory.setRouterAddress(router.address, true)
  console.log("run setBaseToken")
  await factory.setBaseToken(weth.address, true)
  console.log("run setBaseToken")
  await factory.setBaseToken(dai.address, true)
  console.log("run setHatiSacrificeAddress")
  await factory.setHatiSacrificeAddress(hatiSacrifice.address)

  console.log("")
  console.log("")
  console.log("Owner: " + owner.address)
  console.log("Token fee address: " + tokenFeeAddress)
  console.log("Platform fee address: " + platformFeeAddress)
  console.log("")
  console.log("Token A: " + dummyTokenA.address)
  console.log("Token B: " + dummyTokenB.address)
  console.log("WEth address: " + weth.address)
  console.log("DAI address: " + dai.address)
  console.log("")
  console.log("Router address: " + router.address)
  console.log("Router liquidity address: " + routerLiquidity.address)
  console.log("Factory address: " + factory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

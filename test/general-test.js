const { expect } = require("chai");
const { providers } = require("ethers");
const { ethers } = require("hardhat");

describe("Router Launch", function () {

  let owner
  let addr1
  let addr2
  let tokenATreasuryWallet
  let tokenBTreasuryWallet
  let ribeTreasuryWallet
  let factory
  let router
  let routerLiquidity
  let dummyTokenA
  let dummyTokenB
  let weth
  let dai
  let hatiSacrifice

  it("TokenA - DAI trading", async function () {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestamp = blockBefore.timestamp + 60;

    await dummyTokenA.approve(routerLiquidity.address, ethers.utils.parseEther("100"))
    await routerLiquidity.addLiquidityETH(
      dummyTokenA.address,
      ethers.utils.parseEther("100"),
      ethers.utils.parseEther("0"),
      ethers.utils.parseEther("0"),
      owner.address,
      timestamp,
      {value: ethers.utils.parseEther("100")}
      )

    // Buy with ETH
    await owner.sendTransaction({
      to: addr1.address,
      value: ethers.utils.parseEther("2")
    })
    await router.connect(addr1).swapExactETHForTokens(
      0,
      [weth.address, dummyTokenA.address],
      addr1.address,
      timestamp,
      {value: ethers.utils.parseEther("1")})
    
    // Sell
    await dummyTokenA.connect(owner).transfer(addr1.address, ethers.utils.parseEther("1"))
    await dummyTokenA.connect(addr1).approve(router.address, ethers.utils.parseEther("1"))
    await router.connect(addr1).swapExactTokensForETH(
      ethers.utils.parseEther("1"),
      0,
      [dummyTokenA.address, weth.address],
      addr1.address,
      timestamp)

    console.log("")

    console.log("WETH Token Treasury: " + ethers.utils.formatEther(await weth.balanceOf(tokenATreasuryWallet.address)))
    console.log("WETH Ribe Treasury: " + ethers.utils.formatEther(await weth.balanceOf(hatiSacrifice.address)))
  });


  it("Token B - ETH trading", async function () {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestamp = blockBefore.timestamp + 60;

    await dummyTokenA.approve(routerLiquidity.address, ethers.utils.parseEther("500000"))
    await dai.approve(routerLiquidity.address, ethers.utils.parseEther("500000"))
    
    await routerLiquidity.addLiquidity(
      dummyTokenA.address,
      dai.address,
      ethers.utils.parseEther("500000"),
      ethers.utils.parseEther("500000"),
      ethers.utils.parseEther("0"),
      ethers.utils.parseEther("0"),
      owner.address,
      timestamp
      )

    pair = await ethers.getContractAt(
      "contracts/Factory.sol:IRibeSwapPair",
      await factory.getPair(dummyTokenA.address, dai.address))
    reserves = await pair.getReserves()
      
    // Buy
    await dai.connect(owner).transfer(addr1.address, ethers.utils.parseEther("10"))
    await dai.connect(addr1).approve(router.address, ethers.utils.parseEther("10"))
    await router.connect(addr1).swapExactTokensForTokens(
      ethers.utils.parseEther("10"),
      0,
      [dai.address, dummyTokenA.address],
      addr1.address,
      timestamp
    );


    // Sell
    await dummyTokenA.connect(owner).transfer(addr1.address, ethers.utils.parseEther("10"))
    await dummyTokenA.connect(addr1).approve(router.address, ethers.utils.parseEther("10"))
    await router.connect(addr1).swapExactTokensForTokens(
      ethers.utils.parseEther("10"),
      0,
      [dummyTokenA.address, dai.address],
      addr1.address,
      timestamp
    );

    console.log("")

    console.log("DAI Token Treasury: " + ethers.utils.formatEther(await dai.balanceOf(tokenATreasuryWallet.address)))
    console.log("DAI Ribe Treasury: " + ethers.utils.formatEther(await dai.balanceOf(hatiSacrifice.address)))
  });

  beforeEach(async function () {
    [owner, addr1, addr2, tokenATreasuryWallet, tokenBTreasuryWallet, ribeTreasuryWallet] = await ethers.getSigners();

    const DummyToken = await ethers.getContractFactory("DummyToken");
    const WETH9 = await ethers.getContractFactory("WETH9");
    const MyToken = await ethers.getContractFactory("MyToken");
    const RibeSwapRouter = await ethers.getContractFactory("RibeSwapRouter");
    const RibeSwapRouter02Liquidity = await ethers.getContractFactory("RibeSwapRouter02Liquidity");
    const RibeSwapFactory = await ethers.getContractFactory("RibeSwapFactory");
    const HatiSacrifice = await ethers.getContractFactory("HatiSacrifice");

    dummyTokenA = await MyToken.deploy("Token A", "TKNA", tokenATreasuryWallet.address);
    dummyTokenB = await MyToken.deploy("Token B", "TKNB", tokenBTreasuryWallet.address);
    weth = await WETH9.deploy();
    dai = await DummyToken.deploy("DAI", "DAI");
    factory = await RibeSwapFactory.deploy(owner.address);
    router = await RibeSwapRouter.deploy(factory.address, weth.address);
    routerLiquidity = await RibeSwapRouter02Liquidity.deploy(factory.address, weth.address);
    hatiSacrifice = await HatiSacrifice.deploy();
    
    await factory.setRouterAddress(router.address, true)
    await factory.setBaseToken(weth.address, true)
    await factory.setBaseToken(dai.address, true)
    await factory.setHatiSacrificeAddress(hatiSacrifice.address)

    await dummyTokenA.deployed();
    await dummyTokenB.deployed();
    await weth.deployed();
    await dai.deployed();
    await factory.deployed();
    await router.deployed();

    weth.deposit({value: ethers.utils.parseEther("100")});
  })
});
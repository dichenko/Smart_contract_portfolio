import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { pathToFileURL } from "url";
const uniswapRouterABI = require("../abis/IUniswapV2Router02.json");
const erc20ABI = require("../abis/ERC20.json");
const uniswapFactoryABI = require("../abis/IUniswapV2Factory.json");

describe("Full test", function () {
  let dao: Contract;
  let acdmPlatform: Contract;
  let lpToken: Contract;
  let xxxToken: Contract;
  let staking: Contract;
  let acdmToken: Contract;
  let deployer: SignerWithAddress;

  it("Should work", async function () {
    const deployer = await ethers.getImpersonatedSigner(process.env.ETH_HOLDER_1 as string);

    //deploy xxx token
    const XXXFactory = await ethers.getContractFactory("XXXToken");
    xxxToken = await XXXFactory.connect(deployer).deploy();
    xxxToken.deployed();
    console.log("xxxToken deployed at: ", xxxToken.address);

    ///attach uniswap router and factory
    let UniswapV2Router02Address = process.env.UniswapV2Router02_ADDRESS as string;
    let UniswapV2FactoryAddress = process.env.UniswapV2Factory_ADDRESS as string;
    const UniswapV2Router02 = new ethers.Contract(
      UniswapV2Router02Address,
      uniswapRouterABI,
      deployer
    );
    const UniswapV2Factory = new ethers.Contract(
      UniswapV2FactoryAddress,
      uniswapFactoryABI,
      deployer
    );

    ///Approve XXXtokens to Router
    await xxxToken
      .connect(deployer)
      .approve(UniswapV2Router02Address, ethers.utils.parseEther("100000"));
        //wait for 1 day
   // await network.provider.send("evm_increaseTime", [60 * 60 * 24]);

    //get current time
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;

    ///set options
    const options = { value: ethers.utils.parseEther("1"), gasLimit: 400000 };

    //Add liquidityETH at Uniswap (1ETH + 100000 XXXTokens)/////
    let tx1 = await UniswapV2Router02.connect(deployer).addLiquidityETH(
      xxxToken.address,
      ethers.utils.parseEther("100000"),
      ethers.utils.parseEther("100000"),
      1,
      deployer.address,
      timestamp + 200,
      options
    );

    let wethAddress = await UniswapV2Router02.WETH();

    let poolAddress = await UniswapV2Factory.getPair(xxxToken.address, wethAddress);
    console.log("poolAddress: ", poolAddress);
  });
});

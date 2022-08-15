import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
const uniswapABI = require("../abis/IUniswapV2Router02.json");

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
    xxxToken = await XXXFactory.deploy();
    xxxToken.deployed();
    xxxToken.mint(deployer.address, ethers.utils.parseEther("100000"));

    console.log("xxxToken deployed at: ", xxxToken.address);
    console.log("---by deployer: ", deployer.address);
    console.log("---xxxToken total supply: ", Number(await xxxToken.totalSupply()));

    console.log(
      "---deployer balance of XXXToken = ",
      Number(await xxxToken.balanceOf(deployer.address))
    );

    let UniswapV2Router02Address = process.env.UniswapV2Router02 as string;
    console.log("Uniswap Router addres: ", UniswapV2Router02Address);

    ///attach uniswap router
    const UniswapV2Router02 = new ethers.Contract(UniswapV2Router02Address, uniswapABI, deployer);
    

    console.log("Approve XXXtokens to Router...");
    await xxxToken
      .connect(deployer)
      .approve(UniswapV2Router02Address, ethers.utils.parseEther("100000"));
    let alwnc = Number(await xxxToken.allowance(deployer.address, UniswapV2Router02Address));
    console.log("Allowance: ", alwnc);

    //get current time
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;
    ///set options
    const options = { value: ethers.utils.parseEther("1"), gasLimit: 400000 };

    //Add liquidityETH at Uniswap (1ETH + 100000XXXTokens)/////
    let tx1 = await UniswapV2Router02.connect(deployer).addLiquidityETH(
      xxxToken.address,
      ethers.utils.parseEther("100000"),
      0,
      0,
      deployer.address,
      timestamp + 100,
      options
    );

    console.log(tx1);
  });
});

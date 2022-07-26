import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
import { AbiCoder, defaultPath } from "ethers/lib/utils";

const stakingABI = require("../abis/Staking.json");
dotenv.config();

describe("DAO", function () {
  let dao: Contract;
  let erc20: Contract;
  let staking1: Contract;
  let staking2: Contract;

  let deployer: SignerWithAddress;
  let chairman: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, chairman, user1, user2, user3] = await ethers.getSigners();

    //deploy erc20
    const ERC20Factory = await ethers.getContractFactory("GovernanceToken");
    erc20 = await ERC20Factory.deploy();
    erc20.deployed();

    //deploy Staking 1 Contract
    const Staking1Factory = await ethers.getContractFactory("Staking");
    staking1 = await Staking1Factory.deploy();
    staking1.deployed();

    //deploy Staking 2 Contract
    const Stakin2Factory = await ethers.getContractFactory("Staking");
    staking2 = await Stakin2Factory.deploy();
    staking2.deployed();

    //deploy DAO Contract
    const DAOFactory = await ethers.getContractFactory("DAO");
    dao = await DAOFactory.deploy(erc20.address);
    dao.deployed();

    //grantRoles
    await staking1.grantRole(staking1.DAO(), dao.address);
    await staking2.grantRole(staking2.DAO(), dao.address);
    await dao.grantRole(dao.CHAIRMAN(), chairman.address);

    //deposit tokens for users
    await erc20.transfer(user1.address, ethers.utils.parseEther("1"));
    await erc20.transfer(user2.address, ethers.utils.parseEther("1"));
    await erc20.transfer(user3.address, ethers.utils.parseEther("1"));
    await erc20.connect(user1).approve(dao.address, ethers.utils.parseEther("1"));
    await erc20.connect(user2).approve(dao.address, ethers.utils.parseEther("1"));
    await erc20.connect(user3).approve(dao.address, ethers.utils.parseEther("1"));
  });

  describe("DAO-add-finish-proposal", function () {
    it("Proposal should call staking method after voting", async function () {
      expect(await staking1.percent()).to.eq(10);

      //Preparing of proposal calldata 
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setPercent", ["20"]);

      //add proposal by chairman
      await dao.connect(chairman).addProposal(staking1.address, calldata);

      //vote
      await dao.connect(user1).deposit(ethers.utils.parseEther("1"));
      await dao.connect(user1).vote(0, 1);
      await dao.connect(user2).deposit(ethers.utils.parseEther("1"));
      await dao.connect(user2).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      expect(await dao.finish(0))
        .to.emit(dao, "VotingFinished")
        .withArgs(0, 1);

      expect(await staking1.percent()).to.eq(20);
    });
  });
});

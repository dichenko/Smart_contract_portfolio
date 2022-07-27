import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
import { AbiCoder, defaultPath } from "ethers/lib/utils";

const ABI = require("../abis/Staking.json");
dotenv.config();

describe("DAO-vote", function () {
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

  describe("Vote", function () {
    it("Should vote only once", async function () {
      await  dao.connect(chairman).addProposal(staking1.address, "0x");
      await  dao.connect(user1).deposit(500);
      await  dao.connect(user1).vote(0,1);
      await expect(dao.connect(user1).vote(0,1)).to.be.revertedWith("Already voted'");
    });

    it("Should vote in any votes", async function () {
      await  dao.connect(chairman).addProposal(staking1.address, "0x");
      await  dao.connect(chairman).addProposal(staking2.address, "0x");
      await  dao.connect(user1).deposit(500);
      expect(await  dao.connect(user1).vote(0,1)).to.emit(dao, "Vote").withArgs(user1.address, 0, 1, 500);
      expect(await  dao.connect(user1).vote(1,1)).to.emit(dao, "Vote").withArgs(user1.address, 1, 1, 500);
    });

    it("Should not vote without tokens", async function () {
      await  dao.connect(chairman).addProposal(staking1.address, "0x");
      await expect( dao.connect(user1).vote(0,1)).to.be.revertedWith('Need deposit tokens before vote');
      
    });

    it("Should vote for existing voting", async function () {
      await  dao.connect(chairman).addProposal(staking1.address, "0x");
      await  dao.connect(user1).deposit(500);
      await expect( dao.connect(user1).vote(99,1)).to.be.revertedWith('Voting doesnt exist');
      
    });

    it("Should not vote after debate period", async function () {
      await dao.connect(chairman).addProposal(staking1.address, "0x");
      await  dao.connect(user1).deposit(500);
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod + 1]);
      await expect( dao.connect(user1).vote(0,1)).to.be.revertedWith('Debate period is up');
    });

    it("Should not vote after proposal is finished", async function () {
      await dao.connect(chairman).addProposal(staking1.address, "0x");
      await  dao.connect(user1).deposit(500);
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod + 1]);
      await dao.finish(0);
      await expect( dao.connect(user1).vote(0,1)).to.be.revertedWith('Voting already finished');
    });


  });
});

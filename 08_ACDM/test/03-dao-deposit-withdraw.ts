import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

describe("DAO deposit-withdraw", function () {
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

  describe("Deposit", function () {
    it("Should update balances after deposit", async function () {
      await expect(() => dao.connect(user1).deposit(500)).to.changeTokenBalances(
        erc20,
        [user1, dao],
        [-500, 500]
      );
    });

    it("Should have enough tokens to deposit", async function () {
      await erc20.connect(user1).approve(dao.address, ethers.utils.parseEther("100"));
      await expect(dao.connect(user1).deposit(ethers.utils.parseEther("100"))).to.revertedWith(
        "Not enough tokens"
      );
    });

    it("Should approve tokens before deposit", async function () {
      await erc20.connect(user1).approve(dao.address, 0);
      await expect(dao.connect(user1).deposit(ethers.utils.parseEther("1"))).to.revertedWith(
        "Not allowed"
      );
    });
  });

  describe("Withdraw", function () {
    it("Should deposit before withdraw ", async function () {
      await expect(dao.connect(user1).withdraw()).to.revertedWith("Nothind to withdraw");
    });

    it("Should withdraw if haven't voted yet", async function () {
      await dao.connect(user1).deposit(500);
      await expect(() => dao.connect(user1).withdraw()).to.changeTokenBalances(
        erc20,
        [user1, dao],
        [500, -500]
      );
    });

    it("Should not withdraw before debate period is up", async function () {
      await dao.connect(chairman).addProposal(staking1.address, "0x");
      await dao.connect(user1).deposit(500);
      await dao.connect(user1).vote(0, 1);
      await expect(dao.connect(user1).withdraw()).to.revertedWith("Stil locked");
    });

    it("Should not withdraw before all debate periods is up", async function () {
      //voting 1
      await dao.connect(chairman).addProposal(staking1.address, "0x");
      await dao.connect(user1).deposit(500);
      await dao.connect(user1).vote(0, 1);

      await network.provider.send("evm_increaseTime", [10000]);

      // voting2
      await dao.connect(chairman).addProposal(staking2.address, "0x");
      await dao.connect(user1).vote(1, 1);

      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod - 10000]);

      await expect(dao.connect(user1).withdraw()).to.revertedWith("Stil locked");
    });
  });
});

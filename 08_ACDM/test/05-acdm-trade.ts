import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("ACDM Platform - Trade round", function () {
  let dao: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;
  let acdmPlatform: Contract;
  let acdmToken: Contract;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    //deploy acdmToken
    const ACDMTFactory = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMTFactory.deploy();
    acdmToken.deployed();

    //deploy lpToken
    const LPFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPFactory.deploy();
    lpToken.deployed();

    //deploy reward token
    const REWARDFactory = await ethers.getContractFactory("XXXToken");
    rewardToken = await REWARDFactory.deploy();
    rewardToken.deployed();

    //deploy Staking Contract
    const StakingFactory = await ethers.getContractFactory("Staking");
    staking = await StakingFactory.deploy(lpToken.address, rewardToken.address);
    staking.deployed();

    //deploy DAO Contract
    const DAOFactory = await ethers.getContractFactory("DAO");
    dao = await DAOFactory.deploy(lpToken.address);
    dao.deployed();

    //deploy ACDM Platform Contract
    const ACDMFactory = await ethers.getContractFactory("ACDMPlatform");
    acdmPlatform = await ACDMFactory.deploy(acdmToken.address);
    await acdmPlatform.deployed();

    //deposit lp-tokens for users
    await lpToken.mint(user1.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user2.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user3.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user1).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user2).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user3).approve(staking.address, ethers.utils.parseEther("1"));

    //deposit reward tokens for staking contract
    await rewardToken.mint(staking.address, ethers.utils.parseEther("1"));

    //setup staking to be managed by the DAO
    await staking.setupDao(dao.address);

    //setup dao
    await dao.setupStaking(staking.address);

    //grant role MINTER_BURNER
    await acdmToken.grantRole(acdmToken.MINTER_BURNER(), acdmPlatform.address);

    //user registration
    await acdmPlatform.connect(user1).register(deployer.address);
    await acdmPlatform.connect(user2).register(user1.address);
    await acdmPlatform.connect(user3).register(user2.address);
    //start platform
    await acdmPlatform.connect(deployer).startPlatform();
    //users buy tokens
    await acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") });
    await acdmPlatform.connect(user2).buyAcdm({ value: ethers.utils.parseEther("0.5") });

    //approve tokens to platform
    await acdmToken.connect(user1).approve(acdmPlatform.address, ethers.utils.parseEther("0.5"));
    await acdmToken.connect(user2).approve(acdmPlatform.address, ethers.utils.parseEther("0.5"));

    //start trade round
    await acdmPlatform.startTradeRound();
  });
  describe("Add order", function () {
    it("Should update token balanses", async function () {
      await expect(() =>
        acdmPlatform.connect(user1).addOrder(1000, 10000000)
      ).to.changeTokenBalances(acdmToken, [acdmPlatform, user1], [1000, -1000]);
    });

    it("Adding order should emit OrderPlaced event", async function () {
      expect(await acdmPlatform.connect(user1).addOrder(1000, 10000000))
        .to.emit(acdmPlatform, "OrderPlaced")
        .withArgs(0, 1000, 10000000);
    });
  });

  describe("Remove Order", function () {
    it("Should update token balanses", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);
      await expect(() => acdmPlatform.connect(user1).removeOrder(0)).to.changeTokenBalances(
        acdmToken,
        [acdmPlatform, user1],
        [-1000, 1000]
      );
    });

    it("Should not remove more then once", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);

      await acdmPlatform.connect(user1).removeOrder(0);

      await expect(acdmPlatform.connect(user1).removeOrder(0)).to.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not remove another seller's order", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);
      await acdmPlatform.connect(user2).addOrder(2000, 20000000);
      await expect(acdmPlatform.connect(user1).removeOrder(1)).to.revertedWith("You are not a seller");
    });

    it("Should not remove order after round time", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);
      let roundDuration = 3 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [roundDuration + 1]);
      await expect(acdmPlatform.connect(user1).removeOrder(1)).to.revertedWith("Trade round time is over");
    });
  });

  describe("Redeem order", function () {
    it("Should update token balanses", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);

       expect(
       await acdmPlatform.connect(user2).redeemOrder(0)
      ).to.changeTokenBalances(acdmToken, [acdmPlatform, user2], [-1200, 1000]);
    });

    it("Should update token balanses after partial redemption", async function () {
      await acdmPlatform.connect(user1).addOrder(1000, 10000000);

       expect(
       await acdmPlatform.connect(user2).redeemOrder(0)
      ).to.changeTokenBalances(acdmToken, [acdmPlatform, user2], [-1000, 1000]);
    });

    it("Should update eth balanses", async function () {
      await acdmPlatform.connect(user1).addOrder(10, 1000);

       expect(
       await acdmPlatform.connect(user2).redeemOrder(0)
      ).to.changeTokenBalances(acdmToken, [acdmPlatform, user2], [-1000, 1000]);
    });

    it("-Adding order should emit OrderPlaced event", async function () {
      expect(await acdmPlatform.connect(user1).addOrder(1000, 10000000))
        .to.emit(acdmPlatform, "OrderPlaced")
        .withArgs(0, 1000, 10000000);
    });
  });
});

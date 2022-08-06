import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";


describe("ACDM Platform - SaleRound", function () {
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
  });

  
    it("Should update balanses after ACDM buying ", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await expect(() =>
        acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") })
      ).to.changeTokenBalances(acdmToken, [acdmPlatform, user1], [-50000000000, 50000000000]);

      await expect(() =>
        acdmPlatform.connect(user2).buyAcdm({ value: 1000000000 })
      ).to.changeEtherBalances([acdmPlatform, user2], [1000000000 * 0.92, -1000000000]);
    });

    it("Should sale only in sale round ", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);
      await expect(
        acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") })
      ).to.revertedWith("Not sale round");
    });

    it("Should sale only 3 days after sale round started", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      let roundDuration = 3 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [roundDuration + 1]);

      await expect(
        acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") })
      ).to.revertedWith("Sale round time expired");
    });

    it("Should pay enough eth", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await expect(acdmPlatform.connect(user1).buyAcdm({ value: 1 })).to.revertedWith(
        "Not enough ether to buy token"
      );
    });

    it("Should deposit rewards to referrals", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await expect(() =>
        acdmPlatform.connect(user3).buyAcdm({ value: 100000000 })
      ).to.changeEtherBalances(
        [acdmPlatform, user3, user2, user1],
        [92000000, -100000000, 5000000, 3000000]
      );
    });

    it("Should deposit rewards to platform if no referrs", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await expect(() =>
        acdmPlatform.connect(user1).buyAcdm({ value: 100000000 })
      ).to.changeEtherBalances(
        [acdmPlatform, user1, deployer],
        [92000000 + 3000000, -100000000, 5000000]
      );

      expect(await acdmPlatform.referralRewardBank()).to.eq(3000000);

      await expect(() =>
        acdmPlatform.connect(deployer).buyAcdm({ value: 100000000 })
      ).to.changeEtherBalances(
        [acdmPlatform,  deployer],
        [100000000, -100000000]
      );

      expect(await acdmPlatform.referralRewardBank()).to.eq(3000000 + 3000000 + 5000000);
    });

    it("Should start trade round after 3 days", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.3") });
      await acdmPlatform.connect(user2).buyAcdm({ value: ethers.utils.parseEther("0.3") });

      let roundDuration = 3 * 24 * 60 * 60;
      await network.provider.send("evm_increaseTime", [roundDuration + 1]);

      await acdmPlatform.startTradeRound();

      expect(await acdmPlatform.status()).to.eq(2);
    });

    it("Should start trade round after sold out", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") });
      await acdmPlatform.connect(user2).buyAcdm({ value: ethers.utils.parseEther("0.5") });

      await acdmPlatform.startTradeRound();

      expect(await acdmPlatform.status()).to.eq(2);
    });

    it("Should not start trade round before round duration ", async function () {
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);

      await acdmPlatform.connect(deployer).startPlatform();

      await acdmPlatform.connect(user1).buyAcdm({ value: ethers.utils.parseEther("0.5") });
     
      await expect (acdmPlatform.startTradeRound()).to.revertedWith('Sale round is not over yet');
    });
 
});

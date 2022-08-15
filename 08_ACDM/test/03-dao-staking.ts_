import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
const stakingABI = require("../abis/Staking.json");

describe("DAO - Staking", function () {
  let dao: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;
  let deployer: SignerWithAddress;
  let chairman: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let user5: SignerWithAddress;
  let merkleTree: MerkleTree;
  let leafNodes: string[];
  let user1Proof: string[];
  let user2Proof: string[];
  let user3Proof: string[];
  let user4Proof: string[];

  beforeEach(async () => {
    [deployer, user1, user2, user3, user4, user5] = await ethers.getSigners();

    //deploy lpToken
    const LPFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPFactory.deploy();
    lpToken.deployed();

    //deploy reward token
    const REWARDFactory = await ethers.getContractFactory("XXXToken");
    rewardToken = await REWARDFactory.deploy();
    rewardToken.deployed();

    //create white list
    let whieListedAddresses = [
      deployer.address,
      user1.address,
      user2.address,
      user3.address,
      user4.address,
    ];

    //create array of leaf hashes
    leafNodes = whieListedAddresses.map((addr) => ethers.utils.keccak256(addr));

    //create new merkle tree
    merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });

    //gets root hash from merkle tree
    let rootHash = merkleTree.getRoot();

    user1Proof = merkleTree.getHexProof(leafNodes[1]);
    user2Proof = merkleTree.getHexProof(leafNodes[2]);
    user3Proof = merkleTree.getHexProof(leafNodes[3]);
    user4Proof = merkleTree.getHexProof(leafNodes[4]);

    //deploy Staking Contract
    const StakingFactory = await ethers.getContractFactory("Staking");
    staking = await StakingFactory.deploy(lpToken.address, rewardToken.address, rootHash);
    staking.deployed();

    //deploy DAO Contract
    const DAOFactory = await ethers.getContractFactory("DAO");
    dao = await DAOFactory.deploy(lpToken.address);
    dao.deployed();

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
  });

  describe("DAO: Staking contract management", function () {
    it("Proposal should call setTimeToLockLp staking contract after voting", async function () {
      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);

      //Preparing of proposal calldata
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setTimeToLockLp", [1 * 24 * 60 * 60]);

      //add proposal
      await dao.addProposal(staking.address, calldata);

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"), user1Proof);
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"), user2Proof);
      await dao.connect(user2).vote(0, 1);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"), user3Proof);
      await dao.connect(user3).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      await expect(dao.finish(0)).to.emit(dao, "VotingFinished").withArgs(0, 1);

      expect(await staking.timeToLockLp()).to.eq(1 * 24 * 60 * 60);
    });

    it("Proposal should call setMerkleRoot staking contract after voting", async function () {
      let newWhitelist = [
        deployer.address,
        user1.address,
        user2.address,
        user3.address,
        user4.address,
        user5.address,
      ];

      //create array of leaf hashes
      let newLeafNodes = newWhitelist.map((addr) => ethers.utils.keccak256(addr));
      //create new merkle tree
      let newMerkleTree = new MerkleTree(newLeafNodes, ethers.utils.keccak256, { sortPairs: true });

      //gets root hash from merkle tree
      let newRootHash = newMerkleTree.getRoot();

      //Preparing of proposal calldata
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setMerkleRoot", [newRootHash]);

      //add proposal
      await dao.addProposal(staking.address, calldata);

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"), user1Proof);
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"), user2Proof);
      await dao.connect(user2).vote(0, 1);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"), user3Proof);
      await dao.connect(user3).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      await expect(dao.finish(0)).to.emit(dao, "VotingFinished").withArgs(0, 1);

      expect(await staking.merkleRoot()).to.eq("0x"+newRootHash.toString("hex"));
    });

    it("Proposal should not call staking if voting is negative ", async function () {
      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);

      //Preparing of proposal calldata
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setTimeToLockLp", [1 * 24 * 60 * 60]);

      //add proposal
      await dao.addProposal(staking.address, calldata);

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"), user1Proof);
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"), user2Proof);
      await dao.connect(user2).vote(0, 0);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"), user3Proof);
      await dao.connect(user3).vote(0, 0);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      expect(await dao.finish(0))
        .to.emit(dao, "VotingFinished")
        .withArgs(0, 0);

      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);
    });

    it("Should revert if signature is invalid", async function () {
      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);

      //add proposal with invalid calldata
      await dao.addProposal(staking.address, "0x");

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"), user1Proof);
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"), user2Proof);
      await dao.connect(user2).vote(0, 1);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"), user3Proof);
      await dao.connect(user3).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      await expect(dao.finish(0)).to.revertedWith("Incorrect signature");

      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);
    });
  });
});

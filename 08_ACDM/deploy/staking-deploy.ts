import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";

async function main() {
  let staking: Contract;
  let deployer: SignerWithAddress;
  let merkleTree: MerkleTree;
  let leafNodes: string[];

  [deployer] = await ethers.getSigners();

  //create white list
  let whieListedAddresses = [deployer.address, "0x97B0B25d1b04B7D7739799c7e16c816C3fDBF2A9"];

  //create array of leaf hashes
  leafNodes = whieListedAddresses.map((addr) => ethers.utils.keccak256(addr));

  //create new merkle tree
  merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });

  //gets root hash from merkle tree
  let rootHash = merkleTree.getRoot();

  let lpTokenAddress = process.env.LPTOKEN_ADDRESS as string;
  let rewardTokenAddress = process.env.REWARDTOKEN_ADDRESS as string;

  //staking deploy
  const StakingFactory = await ethers.getContractFactory("Staking");
  staking = await StakingFactory.deploy(lpTokenAddress, rewardTokenAddress ,rootHash);
  staking.deployed();
  console.log("Staking deployed to:", staking.address);
  console.log("grant role Dao...");
  await staking.grantRole(staking.DAO(), process.env.DAO_ADDRESS as string);
  console.log("Dao granted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

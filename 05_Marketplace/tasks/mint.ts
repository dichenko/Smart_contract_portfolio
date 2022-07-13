import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("mint", "Mint new nft in marketplacce")
  .addParam("nftStandart", "721 or 1155")
  .addParam("tokenId", "Token ID").addParam("amount", "amount of nft").addParam("uri", "Token URI (only for ERC721)")
  .setAction(async (taskArgs, hre) => {
    let result;
    const [owner] = await hre.ethers.getSigners();

    const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;

    const marketplace = await hre.ethers.getContractAt(
      "Marketplace",
      marketplaceAddress as string,
      owner
    );
    if (taskArgs.nftStandart == 721){
      result = await marketplace.mint721(owner.address, taskArgs.uri);
    }
    else if(taskArgs.nftStandart == 1155){
      result = await marketplace.mint1155(owner.address, taskArgs.tokenId, taskArgs.amount, "0x");
    }
    console.log(result);
  });

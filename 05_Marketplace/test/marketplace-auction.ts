import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("Marketplace - auction", function () {
  let marketplace: Contract;
  let erc721: Contract;
  let erc1155: Contract;
  let erc20: Contract;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [owner, creator, user2, user3] = await ethers.getSigners();

    //deploy erc721
    const ERC721Factory = await ethers.getContractFactory("MyERC721");
    erc721 = await ERC721Factory.deploy();
    erc721.deployed();

    //deploy erc1155
    const ERC1155Factory = await ethers.getContractFactory("MyERC1155");
    erc1155 = await ERC1155Factory.deploy();
    erc721.deployed();

    //deploy erc20
    const ERC20Factory = await ethers.getContractFactory("MyERC20");
    erc20 = await ERC20Factory.deploy("MarketplaceTOKEN", "MPTKN", 18, ethers.utils.parseEther("10000"));
    erc20.deployed();

    //deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy(erc20.address, erc721.address, erc1155.address, creator.address);
    marketplace.deployed();

    //grantRoles to mint NFT
    await erc721.grantRole(erc721.CREATOR(), marketplace.address);
    await erc1155.grantRole(erc1155.CREATOR(), marketplace.address);

    //deposit and approve erc20 tokens to user2, user3
    await erc20.transfer(user2.address, 100000);
    await erc20.transfer(user3.address, 100000);
    await erc20.connect(user2).approve(marketplace.address, 100000);
    await erc20.connect(user3).approve(marketplace.address, 100000);

    //mint and approve erc721 nft
    await marketplace.connect(creator).mint721(creator.address, "/testURI_id1");
    await marketplace.connect(creator).mint721(creator.address, "/testURI_id2");
    await erc721.connect(creator).approve(marketplace.address, 1);
    await erc721.connect(creator).approve(marketplace.address, 2);

    //mint and approve erc1155 nft
    await marketplace.connect(creator).mint1155(creator.address, 3, 100, "0x");
    await marketplace.connect(creator).mint1155(creator.address, 4, 100, "0x");
    await erc1155.connect(creator).setApprovalForAll(marketplace.address, true);
  });

  describe("Auction listing", function () {
    it("Should list  721 token ", async function () {
      //auction index 0
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      const item = await marketplace.getAuctionItem(0);
      expect(item.nftStandart).to.eq(721);
      expect(item.seller).to.eq(creator.address);
      expect(item.amount).to.eq(1);
      expect(item.initPrice).to.eq(1000);
      expect(item.nftId).to.eq(1);
    });

    it("Should list 1155 token ", async function () {
      await marketplace.connect(creator).listItemOnAuction(1155, 3, 100, 1000);
      const item = await marketplace.getAuctionItem(0);
      expect(item.nftStandart).to.eq(1155);
      expect(item.seller).to.eq(creator.address);
      expect(item.amount).to.eq(100);
      expect(item.initPrice).to.eq(1000);
      expect(item.nftId).to.eq(3);
    });
  });

  describe("Auction bidding", function () {
    it("Should bid corrrectly while auction is in progress", async function () {
      //auction index 0
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await expect(() => marketplace.connect(user2).makeBid(0, 2000)).to.changeTokenBalances(erc20, [user2, marketplace], [-2000, 2000]);
      await expect(() => marketplace.connect(user3).makeBid(0, 3000)).to.changeTokenBalances(
        erc20,
        [user2, user3, marketplace],
        [2000, -3000, 1000]
      );
    });

    it("Should not bid less than the current bid", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await expect(marketplace.connect(user2).makeBid(0, 5)).to.revertedWith("Too low price");
      await marketplace.connect(user3).makeBid(0, 5000);
      await expect(marketplace.connect(user2).makeBid(0, 4999)).to.revertedWith("Too low price");
    });

    it("Should not bid in an auction that does not exist ", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await expect(marketplace.connect(user2).makeBid(20, 5)).to.revertedWith("Auction does not exist");
    });

    it("Should not bid after durationTime ", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      const durationTime = Number(await marketplace.auctionDuration());
      const endtime = await  time.latest() + durationTime;
      await network.provider.send("evm_mine", [endtime + 1]);
      await expect(marketplace.connect(user2).makeBid(0, 5000)).to.revertedWith("Auction finished");
    });
  });

  describe("Auction finishing", function () {
    it("Should  finish corrrectly if succeeds", async function () {
      //auction index 0
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await marketplace.connect(user2).makeBid(0, 1500);
      await marketplace.connect(user3).makeBid(0, 1900);
      await marketplace.connect(user2).makeBid(0, 2000);
      await marketplace.connect(user3).makeBid(0, 2500);
      const durationTime = Number(await marketplace.auctionDuration());
      const endtime = await  time.latest() + durationTime;
      await network.provider.send("evm_mine", [endtime + 1]);
      await expect(() => marketplace.connect(creator).finishAuction(0)).to.changeTokenBalances(
        erc20,
        [creator,marketplace],
        [2500, -2500]
      );
      expect (await erc721.ownerOf(1)).to.eq(user3.address);

    });

    it("Should  finish corrrectly if not succeeds ", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await marketplace.connect(user2).makeBid(0, 1500);
      const durationTime = Number(await marketplace.auctionDuration());
      const endtime = await  time.latest() + durationTime;
      await network.provider.send("evm_mine", [endtime + 1]);
      await expect(() => marketplace.connect(user2).finishAuction(0)).to.changeTokenBalances(
        erc20,
        [user2,marketplace],
        [1500, -1500]
      );
      expect (await erc721.ownerOf(1)).to.eq(creator.address);

    });

    it("Should not finish before durationTime ", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await expect(marketplace.connect(user2).finishAuction(0)).to.revertedWith("'Can't finish auction before duration time is up");
    });

    it("Should not finish twice ", async function () {
      await marketplace.connect(creator).listItemOnAuction(721, 1, 1, 1000);
      await marketplace.connect(user2).makeBid(0, 1500);
      const durationTime = Number(await marketplace.auctionDuration());
      const endtime = await  time.latest() + durationTime;
      await network.provider.send("evm_mine", [endtime + 1]);
      await marketplace.connect(user2).finishAuction(0);
      await  expect (marketplace.connect(user2).finishAuction(0)).to.revertedWith("Auction already finished");
      

    });
  });
});

// struct AuctionItem {
//   bool ended;
//   uint16 nftStandart;
//   uint96 startTime;
//   address seller;
//   address highestBidder;
//   uint nftId;
//   uint amount;
//   uint initPrice;
//   uint highestBid;
//   uint bidCounter;
// }

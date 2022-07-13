import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("Marketplace-store", function () {
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

    //grantRoles
    await erc721.grantRole(erc721.CREATOR(), marketplace.address);
    await erc1155.grantRole(erc1155.CREATOR(), marketplace.address);

    // console.log('erc721: ', erc721.address);
    // console.log('erc1155: ', erc1155.address);
    // console.log('market: ', marketplace.address);
    // console.log('----------------');


  });

  describe("Deployment", function () {
    it("ACCESS: Only creator should mint 721 ", async function () {
      await expect(marketplace.mint721(owner.address, "/testURI")).to.be.revertedWith('AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6');
    await expect(erc721.mint(owner.address, "/testURI")).to.be.revertedWith('AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6');
      await marketplace.connect(creator).mint721(creator.address, "/testURI");
      expect(await erc721.balanceOf(creator.address)).to.equal(1);
    });

    it("ACCESS: Only creator should mint 1155 ", async function () {
      await expect(marketplace.mint1155(owner.address, 2, 100, "0x")).to.be.revertedWith(
        'AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6'
      );

      await marketplace.connect(creator).mint1155(creator.address, 2, 100, "0x");
      expect(await erc1155.balanceOf(creator.address, 2)).to.equal(100);
    });
  });

  describe("Listing and cancelling", function () {
    it("Should list and cancel 721 token ", async function () {
      const _id = 1;
      await marketplace.connect(creator).mint721(creator.address, "/testURI");
      expect(await erc721.ownerOf(_id)).to.equal(creator.address);

      await erc721.connect(creator).approve(marketplace.address, _id);

      await marketplace.connect(creator).listItem(721, _id, 1, ethers.utils.parseEther("2"));
      expect(await erc721.ownerOf(_id)).to.equal(marketplace.address);

      await marketplace.connect(creator).cancel(721, _id, 1, ethers.utils.parseEther("2"));
      expect(await erc721.ownerOf(_id)).to.equal(creator.address);
    });
    it("Should list and cancel 1155 token ", async function () {
      const _id = 2;
      const _amount = 500;
      await marketplace.connect(creator).mint1155(creator.address, _id, _amount, "0x");
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount);

      await erc1155.connect(creator).setApprovalForAll(marketplace.address, true);

      await marketplace.connect(creator).listItem(1155, _id, 100, 25000000);
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount - 100);
      expect(await erc1155.balanceOf(marketplace.address, _id)).to.equal(100);

      await marketplace.connect(creator).cancel(1155, _id, 100, 25000000);
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount);
    });
  });

  describe("Buying", function () {
    it("Should buy 721 nft", async function () {
      const _id = 1;
      await marketplace.connect(creator).mint721(creator.address, "/testURI");
      await erc721.connect(creator).approve(marketplace.address, _id);
      await marketplace.connect(creator).listItem(721, _id, 1, 1000);
      await erc20.mint(1000);
      await erc20.transfer(user2.address, 1000);
      await erc20.connect(user2).approve(marketplace.address, 1000);
      await marketplace.connect(user2).buyItem(creator.address, 721, _id, 1, 1000);
      expect(await erc721.ownerOf(_id)).to.equal(user2.address);
      expect(await erc20.balanceOf(creator.address)).to.equal(1000);
    });

    it("Should buy 1155 nft", async function () {
        const _id = 3;
        await marketplace.connect(creator).mint1155(creator.address, _id, 20, "0x");
        await erc1155.connect(creator).setApprovalForAll(marketplace.address, true);
        await marketplace.connect(creator).listItem(1155, _id, 20, 1000);
        await erc20.mint(1000);
        await erc20.transfer(user2.address, 1000);
        await erc20.connect(user2).approve(marketplace.address, 1000);
        await marketplace.connect(user2).buyItem(creator.address, 1155, _id, 20, 1000);
        expect(await erc1155.balanceOf(user2.address, _id)).to.equal(20);
        expect(await erc20.balanceOf(creator.address)).to.equal(1000);
      });

    it("Should not cancel after purchasing", async function () {
        const _id = 1;
        await marketplace.connect(creator).mint721(creator.address, "/testURI");
        await erc721.connect(creator).approve(marketplace.address, _id);
        await marketplace.connect(creator).listItem(721, _id, 1, 1000);
        await erc20.mint(1000);
        await erc20.transfer(user2.address, 1000);
        await erc20.connect(user2).approve(marketplace.address, 1000);
        await marketplace.connect(user2).buyItem(creator.address, 721, _id, 1, 1000);
        await  expect(marketplace.connect(creator).cancel(721, _id, 1, 1000)).to.be.revertedWith("Nothing to cancel");
      });




  });

  
});

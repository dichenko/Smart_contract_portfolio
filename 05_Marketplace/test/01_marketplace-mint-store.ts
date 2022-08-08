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
  let erc721_2: Contract;
  let erc1155_2: Contract;
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

    //deploy second erc721
    const ERC721_2_Factory = await ethers.getContractFactory("MyERC721");
    erc721_2 = await ERC721_2_Factory.deploy();
    erc721_2.deployed();

    //deploy erc1155
    const ERC1155Factory = await ethers.getContractFactory("MyERC1155");
    erc1155 = await ERC1155Factory.deploy();
    erc1155.deployed();

    //deploy second erc1155
    const ERC1155_2_Factory = await ethers.getContractFactory("MyERC1155");
    erc1155_2 = await ERC1155_2_Factory.deploy();
    erc1155_2.deployed();

    //deploy erc20
    const ERC20Factory = await ethers.getContractFactory("MyERC20");
    erc20 = await ERC20Factory.deploy(
      "MarketplaceTOKEN",
      "MPTKN",
      18,
      ethers.utils.parseEther("10000")
    );
    erc20.deployed();

    //deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy(
      erc20.address,
      erc721.address,
      erc1155.address,
      creator.address
    );
    marketplace.deployed();

    await erc20.mint(20000);
    await erc20.transfer(user2.address, 10000);
    await erc20.transfer(user3.address, 10000);
    await erc20.connect(user2).approve(marketplace.address, 10000);
    await erc20.connect(user3).approve(marketplace.address, 10000);

    //grantRoles
    await erc721.grantRole(erc721.CREATOR(), marketplace.address);
    await erc1155.grantRole(erc1155.CREATOR(), marketplace.address);
    await erc721_2.grantRole(erc721.CREATOR(), marketplace.address);
    await erc1155_2.grantRole(erc1155.CREATOR(), marketplace.address);

    // console.log('erc721: ', erc721.address);
    // console.log('erc1155: ', erc1155.address);
    // console.log('market: ', marketplace.address);
    // console.log('----------------');
  });

  describe("Deployment", function () {
    it("ACCESS: Only creator should mint 721 ", async function () {
      await expect(marketplace.mint721(0, "/testURI")).to.be.revertedWith(
        "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6"
      );
      await expect(erc721.mint(owner.address, "/testURI")).to.be.revertedWith(
        "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6"
      );
      await marketplace.connect(creator).mint721(0, "/testURI");
      expect(await erc721.balanceOf(creator.address)).to.equal(1);
    });

    it("ACCESS: Only creator should mint 1155 ", async function () {
      await expect(marketplace.mint1155(0, 2, 100, "0x")).to.be.revertedWith(
        "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6"
      );
      await marketplace.connect(creator).mint1155(0, 2, 100, "0x");
      expect(await erc1155.balanceOf(creator.address, 2)).to.equal(100);
    });
  });

  describe("Listing and cancelling", function () {
    it("Should list and cancel 721 token ", async function () {
      const _id = 1;
      await marketplace.connect(creator).mint721(0, "/testURI");
      expect(await erc721.ownerOf(_id)).to.equal(creator.address);

      await erc721.connect(creator).approve(marketplace.address, _id);

      await marketplace.connect(creator).listItem(0, 0, _id, 1, ethers.utils.parseEther("2"));
      expect(await erc721.ownerOf(_id)).to.equal(marketplace.address);

      await marketplace.connect(creator).cancel(0);
      expect(await erc721.ownerOf(_id)).to.equal(creator.address);
    });

    it("Should list and cancel 1155 token ", async function () {
      const _id = 2;
      const _amount = 500;
      await marketplace.connect(creator).mint1155(0, _id, _amount, "0x");
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount);

      await erc1155.connect(creator).setApprovalForAll(marketplace.address, true);

      await marketplace.connect(creator).listItem(1, 0, _id, 100, 25000000);
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount - 100);
      expect(await erc1155.balanceOf(marketplace.address, _id)).to.equal(100);

      await marketplace.connect(creator).cancel(0);
      expect(await erc1155.balanceOf(creator.address, _id)).to.equal(_amount);
    });
  });

  describe("Buying", function () {
    it("Should buy 721 nft", async function () {
      const _id = 1;
      await marketplace.connect(creator).mint721(0, "/testURI");
      await erc721.connect(creator).approve(marketplace.address, _id);
      await marketplace.connect(creator).listItem(0, 0, _id, 1, 1000);
      await erc20.mint(1000);
      await erc20.transfer(user2.address, 1000);
      await erc20.connect(user2).approve(marketplace.address, 1000);
      await marketplace.connect(user2).buyItem(0);
      expect(await erc721.ownerOf(_id)).to.equal(user2.address);
      expect(await erc20.balanceOf(creator.address)).to.equal(1000);
    });

    it("Should buy 1155 nft", async function () {
      const _id = 3;
      await marketplace.connect(creator).mint1155(0, _id, 20, "0x");
      await erc1155.connect(creator).setApprovalForAll(marketplace.address, true);
      await marketplace.connect(creator).listItem(1, 0, _id, 20, 1000);
      await erc20.mint(1000);
      await erc20.transfer(user2.address, 1000);
      await erc20.connect(user2).approve(marketplace.address, 1000);
      await marketplace.connect(user2).buyItem(0);
      expect(await erc1155.balanceOf(user2.address, _id)).to.equal(20);
      expect(await erc20.balanceOf(creator.address)).to.equal(1000);
    });

    it("Should not cancel after purchasing", async function () {
      const _id = 1;
      await marketplace.connect(creator).mint721(0, "/testURI");
      await erc721.connect(creator).approve(marketplace.address, _id);
      await marketplace.connect(creator).listItem(0, 0, _id, 1, 1000);
      await erc20.mint(1000);
      await erc20.transfer(user2.address, 1000);
      await erc20.connect(user2).approve(marketplace.address, 1000);
      await marketplace.connect(user2).buyItem(0);
      await expect(marketplace.connect(creator).cancel(0)).to.be.revertedWith(
        "Item didn't listed'"
      );
    });
  });

  describe("Multiple collections listing", function () {
    it("Should list token on different collections ", async function () {
      // Add more supported collections (0 - 721, 1 - 1155)
      await marketplace.addNftCollection(0, erc721_2.address);
      await marketplace.addNftCollection(1, erc1155_2.address);

      //Grant Role Creator
      await erc721_2.grantRole(erc721_2.CREATOR(), marketplace.address);
      await erc1155_2.grantRole(erc1155_2.CREATOR(), marketplace.address);

      //mint and approve erc721_2 nft
      await marketplace.connect(creator).mint721(1, "/testURI_id1");
      await erc721_2.connect(creator).approve(marketplace.address, 1);

      //mint and approve erc1155_2 nft
      await marketplace.connect(creator).mint1155(1, 3, 100, "0x");
      await erc1155_2.connect(creator).setApprovalForAll(marketplace.address, true);
    
      //list item standart 721(0) from collection 1 
      //with id = 1, amount = 1, price = 1000
      await marketplace.connect(creator).listItem(0, 1, 1, 1, 1000);
      
      //list item from collection 1 standart 1155(1)
      //with id = 3, amount = 100, price = 1000
      await marketplace.connect(creator).listItem(1, 1, 3, 100, 1000);
      
      //user2 buy item #0
      await expect(() => marketplace.connect(user2).buyItem(0)).to.changeTokenBalance(
        erc20,
        user2,
        -1000
      );
      
      //user3 buy item #1
      await expect( () => marketplace.connect(user3).buyItem(1)).to.changeTokenBalance(
        erc20,
        user3,
        -1000
      );

  
      expect(await erc721_2.ownerOf(1)).to.eq(user2.address);
      expect(await erc1155_2.balanceOf(user3.address, 3)).to.eq(100);
    });
  });
});

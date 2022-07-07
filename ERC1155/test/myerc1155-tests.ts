import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("myERC1155", function () {
  let myERC1155: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    const ERC1155Factory = await ethers.getContractFactory("MyERC1155");
    myERC1155 = await ERC1155Factory.deploy();
    myERC1155.deployed();
    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the correct params", async function () {
      expect(await myERC1155.owner()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    it("Should mint properly to any address", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155.mint(user1.address, process.env.URI02);
      expect(await myERC1155.balanceOf(owner.address)).to.equal(1);
      expect(await myERC1155.balanceOf(user1.address)).to.equal(1);
    });

    it("Should mint only by owner", async function () {
      await expect(
        myERC1155.connect(user1).mint(user1.address, process.env.URI01)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer", function () {
    it("Should transfer properly", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155.transferFrom(owner.address, user1.address, 1);
      expect(await myERC1155.balanceOf(user1.address)).to.equal(1);
      expect(await myERC1155.ownerOf(1)).to.equal(user1.address);
    });

    it("Should safe transfer properly", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155["safeTransferFrom(address,address,uint256)"](owner.address, user1.address, 1);
      expect(await myERC1155.balanceOf(user1.address)).to.equal(1);
      expect(await myERC1155.ownerOf(1)).to.equal(user1.address);
    });

    it("Should safe transfer2 properly", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155["safeTransferFrom(address,address,uint256,bytes)"](owner.address, user1.address, 1, "0x");
      expect(await myERC1155.balanceOf(user1.address)).to.equal(1);
      expect(await myERC1155.ownerOf(1)).to.equal(user1.address);
    });

    it("Should not transfer without allowance", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await expect(
        myERC1155.connect(user1).transferFrom(owner.address, user2.address, 1)
      ).to.be.revertedWith("ERC721: caller is not token owner nor approved");
    });
  });

  describe("Approve", function () {
    it("Should approve properly", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155.approve(user1.address, 1);
      await expect(
        myERC1155.connect(user2).transferFrom(owner.address, user2.address, 1)
      ).to.be.revertedWith("ERC721: caller is not token owner nor approved");
      await myERC1155
        .connect(user1)
        .transferFrom(owner.address, user2.address, 1);
      expect(await myERC1155.balanceOf(user2.address)).to.equal(1);
      expect(await myERC1155.ownerOf(1)).to.equal(user2.address);
    });

    it("Should set approval for all", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      await myERC1155.mint(owner.address, process.env.URI02);
      await myERC1155.mint(owner.address, process.env.URI03);
      await myERC1155.setApprovalForAll(user1.address, true);

      expect(
        await myERC1155.isApprovedForAll(owner.address, user1.address)
      ).to.equal(true);
      expect(
        await myERC1155.isApprovedForAll(owner.address, user2.address)
      ).to.equal(false);

      await myERC1155
        .connect(user1)
        .transferFrom(owner.address, user2.address, 1);
      await myERC1155
        .connect(user1)
        .transferFrom(owner.address, user2.address, 2);
      await myERC1155
        .connect(user1)
        .transferFrom(owner.address, user2.address, 3);
      expect(await myERC1155.balanceOf(user2.address)).to.equal(3);
    });
  });

  describe("Utils", function () {
    it("Should return correct URI", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      expect(await myERC1155.tokenURI(1)).to.equal(process.env.URI01);
    });

    it("Shoulld transfer ownership", async function () {
      await myERC1155["transferOwnership(address)"](user1.address);
      expect(await myERC1155.owner()).to.equal(user1.address);
    });
    
  });

  describe("Events", function () {
    it("Should emit Transfer event", async function () {
      expect(await myERC1155.mint(owner.address, process.env.URI01)).to.emit(myERC1155, "Transfer").withArgs('0', owner.address, 1);
      expect(await myERC1155.transferFrom(owner.address, user1.address, 1)).to.emit(myERC1155, "Transfer").withArgs(owner.address, user1.address, 1);
    });

    it("Should emit Approval event", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      expect(await myERC1155.approve(user1.address, 1)).to.emit(myERC1155, "Approval").withArgs(owner.address, user1.address, 1);
    });

    it("Should emit ApprovalForAll event", async function () {
      await myERC1155.mint(owner.address, process.env.URI01);
      expect(await myERC1155.setApprovalForAll(user1.address, true)).to.emit(myERC1155, "ApprovalForAll").withArgs(owner.address, user1.address, true);
    });

   
    
  });




});

import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("PandaNFT", function () {
  let pandaNft: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    const PandaNftFactory = await ethers.getContractFactory("PandaNFT");
    pandaNft = await PandaNftFactory.deploy();
    pandaNft.deployed();
    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the correct params", async function () {
      expect(await pandaNft.owner()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    it("Should mint properly to any address", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      await pandaNft.mint(user1.address, process.env.URI02);
      expect(await pandaNft.balanceOf(owner.address)).to.equal(1);
      expect(await pandaNft.balanceOf(user1.address)).to.equal(1);
    });

    it("Should mint only by owner", async function () {
      await expect(
        pandaNft.connect(user1).mint(user1.address, process.env.URI01)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer", function () {
    it("Should transfer properly", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      await pandaNft.transferFrom(owner.address, user1.address, 1);
      expect(await pandaNft.balanceOf(user1.address)).to.equal(1);
      expect(await pandaNft.ownerOf(1)).to.equal(user1.address);
    });

    // it("Should safe transfer properly", async function () {
    //   await pandaNft.mint(owner.address, process.env.URI01);
    //   await pandaNft.safeTransferFrom(owner.address, user1.address, 1);
    //   expect(await pandaNft.balanceOf(user1.address)).to.equal(1);
    //   expect(await pandaNft.ownerOf(1)).to.equal(user1.address);
    // });

    // it("Should safe transfer2 properly", async function () {
    //   await pandaNft.mint(owner.address, process.env.URI01);
    //   await pandaNft.safeTransferFrom(owner.address, user1.address, 1, "0x");
    //   expect(await pandaNft.balanceOf(user1.address)).to.equal(1);
    //   expect(await pandaNft.ownerOf(1)).to.equal(user1.address);
    // });

    it("Should not transfer without allowance", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      await expect(
        pandaNft.connect(user1).transferFrom(owner.address, user2.address, 1)
      ).to.be.revertedWith("ERC721: caller is not token owner nor approved");
    });
  });

  describe("Approve", function () {
    it("Should approve properly", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      await pandaNft.approve(user1.address, 1);
      await expect(
        pandaNft.connect(user2).transferFrom(owner.address, user2.address, 1)
      ).to.be.revertedWith("ERC721: caller is not token owner nor approved");
      await pandaNft
        .connect(user1)
        .transferFrom(owner.address, user2.address, 1);
      expect(await pandaNft.balanceOf(user2.address)).to.equal(1);
      expect(await pandaNft.ownerOf(1)).to.equal(user2.address);
    });

    it("Should set approval for all", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      await pandaNft.mint(owner.address, process.env.URI02);
      await pandaNft.mint(owner.address, process.env.URI03);
      await pandaNft.setApprovalForAll(user1.address, true);

      expect(
        await pandaNft.isApprovedForAll(owner.address, user1.address)
      ).to.equal(true);
      expect(
        await pandaNft.isApprovedForAll(owner.address, user2.address)
      ).to.equal(false);

      await pandaNft
        .connect(user1)
        .transferFrom(owner.address, user2.address, 1);
      await pandaNft
        .connect(user1)
        .transferFrom(owner.address, user2.address, 2);
      await pandaNft
        .connect(user1)
        .transferFrom(owner.address, user2.address, 3);
      expect(await pandaNft.balanceOf(user2.address)).to.equal(3);
    });
  });

  describe("Utils", function () {
    it("Should return correct URI", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      expect(await pandaNft.tokenURI(1)).to.equal(process.env.URI01);
    });

    // it("Shoulld transfer ownership", async function () {
    //   await pandaNft.transferOwnership(user1.address);
    //   expect(await pandaNft.owner()).to.equal(user1.address);
    // });
    
  });

  describe("Events", function () {
    it("Should emit Transfer event", async function () {
      expect(await pandaNft.mint(owner.address, process.env.URI01)).to.emit(pandaNft, "Transfer").withArgs('0', owner.address, 1);
      expect(await pandaNft.transferFrom(owner.address, user1.address, 1)).to.emit(pandaNft, "Transfer").withArgs(owner.address, user1.address, 1);
    });

    it("Should emit Approval event", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      expect(await pandaNft.approve(user1.address, 1)).to.emit(pandaNft, "Approval").withArgs(owner.address, user1.address, 1);
    });

    it("Should emit ApprovalForAll event", async function () {
      await pandaNft.mint(owner.address, process.env.URI01);
      expect(await pandaNft.setApprovalForAll(user1.address, true)).to.emit(pandaNft, "ApprovalForAll").withArgs(owner.address, user1.address, true);
    });

   
    
  });




});

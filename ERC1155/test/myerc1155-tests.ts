import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
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
      await myERC1155.mint(user1.address, 1, 1, "0x");
      await myERC1155.mint(user2.address, 2, 1, "0x");
      expect(await myERC1155.balanceOf(user1.address, 1)).to.equal(1);
      expect(await myERC1155.balanceOf(user2.address, 2)).to.equal(1);
    });

    it("Should mint batch properly to any address", async function () {
      await myERC1155.mintBatch(user1.address, [2, 3, 4], [5, 6, 7], "0x");
      expect(await myERC1155.balanceOf(user1.address, 2)).to.equal(5);
      expect(await myERC1155.balanceOf(user1.address, 3)).to.equal(6);
      expect(await myERC1155.balanceOf(user1.address, 4)).to.equal(7);
    });

    it("Should mint only by owner", async function () {
      await expect(
        myERC1155.connect(user1).mint(user1.address, 1, 1, "0x")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should increase total supply of token", async function () {
      const tsBefore = await myERC1155.totalSupply(1);
      await myERC1155.mint(user1.address, 1, 100, "0x");
      const tsAfter = await myERC1155.totalSupply(1);
      await expect(tsAfter).to.equal(tsBefore.add(100));
    });
  });

  describe("Transfer", function () {
    it("Should update balances after transfer", async function () {
      const balanceOwnerBefore = await myERC1155.balanceOf(owner.address, 1);
      await myERC1155.safeTransferFrom(
        owner.address,
        user1.address,
        1,
        15,
        "0x"
      );
      const balanceOwnerAfter = await myERC1155.balanceOf(owner.address, 1);
      expect(await myERC1155.balanceOf(user1.address, 1)).to.equal(15);
      expect(balanceOwnerAfter).to.equal(balanceOwnerBefore.sub(15));
    });

    it("Should update balances after batch transfer", async function () {
      const balancesBefore = await myERC1155.balanceOfBatch(
        [owner.address, owner.address, owner.address],
        [1, 2, 3]
      );
      await myERC1155.safeBatchTransferFrom(
        owner.address,
        user1.address,
        [1, 2, 3],
        [100, 100, 100],
        "0x"
      );
      const balancesAfter = await myERC1155.balanceOfBatch(
        [owner.address, owner.address, owner.address],
        [1, 2, 3]
      );
      
      expect(await myERC1155.balanceOfBatch([user1.address,user1.address,user1.address], [1,2,3]))
      .to.eql([BigNumber.from("100"),BigNumber.from("100"),BigNumber.from("100")]);
      expect(balancesAfter[0]).to.equal(balancesBefore[0].sub(100));
      expect(balancesAfter[1]).to.equal(balancesBefore[1].sub(100));
      expect(balancesAfter[2]).to.equal(balancesBefore[2].sub(100));
    });


    it("Should transferFrom only after allowance", async function () {
      await expect(
        myERC1155
          .connect(user1)
          .safeTransferFrom(owner.address, user2.address, 1, 15, "0x")
      ).to.be.revertedWith("ERC1155: caller is not token owner nor approved");

      await myERC1155.setApprovalForAll(user1.address, true);
      await myERC1155
        .connect(user1)
        .safeTransferFrom(owner.address, user2.address, 1, 15, "0x");

      expect(await myERC1155.balanceOf(user2.address, 1)).to.equal(15);
    });
  });

  describe("Approve", function () {
    it("Should approve for any operators", async function () {
      await myERC1155.setApprovalForAll(user1.address, true);
      await myERC1155.setApprovalForAll(user2.address, true);

      await myERC1155
        .connect(user1)
        .safeTransferFrom(owner.address, user3.address, 1, 10, "0x");

      await myERC1155
        .connect(user2)
        .safeBatchTransferFrom(
          owner.address,
          user3.address,
          [2, 3],
          [10, 10],
          "0x"
        );

      expect(await myERC1155.balanceOf(user3.address, 1)).to.equal(10);
      expect(await myERC1155.balanceOf(user3.address, 2)).to.equal(10);
      expect(await myERC1155.balanceOf(user3.address, 3)).to.equal(10);
    });
  });

  describe("Access", function () {
    it("Should transfer access", async function () {
      await myERC1155.transferOwnership(user1.address);
      expect(await myERC1155.owner()).to.equal(user1.address);

      await expect(
        myERC1155.mint(owner.address, 1, 1, "0x")
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await myERC1155.connect(user1).mint(user1.address, 5, 1, "0x");
      expect(await myERC1155.balanceOf(user1.address, 5)).to.equal(1);
    });
  });

  describe("Events", function () {
    describe("Should emit TransferSingle event", function () {
      it("after mint", async function () {
        expect(await myERC1155.mint(user1.address, 1, 1, "0x"))
          .to.emit(myERC1155, "TransferSingle")
          .withArgs(
            owner.address,
            ethers.constants.AddressZero,
            owner.address,
            1,
            1,
            "0x0"
          );
      });

      it("after transfer", async function () {
        expect(
          await myERC1155.safeTransferFrom(
            owner.address,
            user1.address,
            1,
            1,
            "0x"
          )
        )
          .to.emit(myERC1155, "TransferSingle")
          .withArgs(owner.address, owner.address, user1.address, 1, 1, "0x0");
      });
    });
    describe("Should emit TransferBatch event", function () {
      it("after batch transfer", async function () {
        expect(
          await myERC1155.safeBatchTransferFrom(
            owner.address,
            user1.address,
            [1, 2, 3, 4, 5],
            [12, 12, 12, 12, 1],
            "0x"
          )
        )
          .to.emit(myERC1155, "TransferBatch")
          .withArgs(
            owner.address,
            owner.address,
            user1.address,
            [1, 2, 3, 4, 5],
            [12, 12, 12, 12, 1],
            "0x0"
          );
      });
    });
    describe("Should emit ApprovalForAll event", function () {
      it("after setApprovalForAll", async function () {
        expect(await myERC1155.setApprovalForAll(user1.address, true))
          .to.emit(myERC1155, "ApprovalForAll")
          .withArgs(owner.address, user1.address, true);

          expect(await myERC1155.setApprovalForAll(user1.address, false))
          .to.emit(myERC1155, "ApprovalForAll")
          .withArgs(owner.address, user1.address, false);
      });
    });
  });
});

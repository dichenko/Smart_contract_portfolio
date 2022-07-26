import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("MyERC20Token", function () {
  let name = "RewardToken";
  let symbols = "RWD";
  let decimals = 18;
  let initialSupply = ethers.utils.parseEther("1000000");

  let myToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    const MyTokenFactory = await ethers.getContractFactory("MyERC20");
    myToken = await MyTokenFactory.deploy(
      name,
      symbols,
      decimals,
      initialSupply
    );

    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the correct params", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
      expect(await myToken.name()).to.equal(name);
      expect(await myToken.symbol()).to.equal(symbols);
      expect(await myToken.totalSupply()).to.equal(initialSupply);
      expect(await myToken.decimals()).to.equal(decimals);
    });

    it("Should state correct owner balance", async function () {
      expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

  describe("Transfer", function () {
    it("Should update balances after transfers", async function () {
      const initialBalance = await myToken.balanceOf(owner.address);
      await myToken.transfer(user1.address, 5);
      expect(await myToken.balanceOf(owner.address)).to.equal(
        initialBalance.sub(5)
      );
      expect(await myToken.balanceOf(user1.address)).to.equal(5);
    });

    it("Should fail transfer more tokens then you have ", async function () {
      await expect(
        myToken.connect(user2).transfer(user3.address, 10000)
      ).to.be.revertedWith("Not enough tokens");
    });

    it("Should emit the Transfer event", async function () {
      await expect(myToken.transfer(user1.address, 500))
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, user1.address, 500);
    });

    it("Should transfer zero amount of token with emitting Transfer event", async function () {
      await expect(myToken.transfer(user1.address, 0))
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, user1.address, 0);
    });
  });

  describe("TransferFrom", function () {
    it("Should approve correctly", async function () {
      await myToken.approve(user2.address, 1000000);
      expect(await myToken.allowance(owner.address, user2.address)).to.equal(
        1000000
      );
    });

    it("Should update balances after transerFrom", async function () {
      let initialBalance = await myToken.balanceOf(owner.address);
      await myToken.approve(user1.address, 500);
      await myToken
        .connect(user1)
        .transferFrom(owner.address, user2.address, 500);
      expect(await myToken.balanceOf(owner.address)).to.equal(
        initialBalance.sub(500)
      );
      expect(await myToken.balanceOf(user2.address)).to.equal(500);
    });

    it("Should emit the Approval and Transfer event", async function () {
      await expect(myToken.approve(user1.address, 500))
        .to.emit(myToken, "Approval")
        .withArgs(owner.address, user1.address, 500);

      await expect(
        myToken.connect(user1).transferFrom(owner.address, user2.address, 500)
      )
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, user2.address, 500);
    });

    it("Should fail transferFrom without approve", async function () {
      await expect(
        myToken.connect(user1).transferFrom(owner.address, user2.address, 500)
      ).to.be.revertedWith("Not approved");
    });

    it("Should not transfer more then approved", async function () {
      await myToken.approve(user1.address, 500);
      await expect(
        myToken.connect(user1).transferFrom(owner.address, user2.address, 1000)
      ).to.be.revertedWith("Not approved");
    });
  });

  describe("Mint'n'Burn", function () {
    it("Should mint tokens to owner balance", async function () {
      let tokenAmountBefore = await myToken.balanceOf(owner.address);
      await myToken.mint(1);
      expect(await myToken.balanceOf(owner.address)).to.equal(tokenAmountBefore.add(1));
    });

    it("Should burn tokens from owner balance", async function () {
      let tokenAmountBefore = await myToken.balanceOf(owner.address);
      await myToken.burn(1);
      expect(await myToken.balanceOf(owner.address)).to.equal(tokenAmountBefore.sub(1));
    });

    it("Should have correct totalSupply after mint and burn ", async function () {
      let totalSupplyBeforeBurn = await myToken.totalSupply();
      await myToken.burn(1);
      expect(await myToken.totalSupply()).to.equal(
        totalSupplyBeforeBurn.sub(1)
      );

      let totalSupplyBefore = await myToken.totalSupply();
      await myToken.mint(1);
      expect(await myToken.totalSupply()).to.equal(totalSupplyBefore.add(1));
    });

    it("Should emit Transfer event after mint and burn", async function () {
      await expect(myToken.burn(1))
        .to.emit(myToken, "Transfer")
        .withArgs(
          owner.address,
          "0x0000000000000000000000000000000000000000",
          1
        );
      await expect(myToken.mint(1))
        .to.emit(myToken, "Transfer")
        .withArgs(
          "0x0000000000000000000000000000000000000000",
          owner.address,
          1
        );
    });

    it("Only owner can mint and burn", async function () {
      await expect(myToken.connect(user1).burn(1)).to.revertedWith(
        "You are not an owner"
      );

      await expect(myToken.connect(user2).mint(1)).to.revertedWith(
        "You are not an owner"
      );
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("Bridge", function () {
  let bridge: Contract;
  let erc20: Contract;
  let owner: SignerWithAddress;
  let validator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    [owner, validator, user1, user2] = await ethers.getSigners();

    //deploy erc20
    const ERC20Factory = await ethers.getContractFactory("BridgeToken");
    erc20 = await ERC20Factory.deploy();
    erc20.deployed();

    //deploy Bridge Contract
    const BridgeFactory = await ethers.getContractFactory("Bridge");
    bridge = await BridgeFactory.deploy(erc20.address, validator.address);
    bridge.deployed();

    //grantRoles
    await erc20.grantRole(erc20.MINTER_ROLE(), bridge.address);
    await erc20.grantRole(erc20.BURNER_ROLE(), bridge.address);
    await erc20.transfer(user1.address, 100000000);
    await erc20.transfer(user2.address, 100000000);
    await erc20.connect(user1).approve(bridge.address, 100000000);
    await erc20.connect(user2).approve(bridge.address, 100000000);
  });

  describe("Deployment", function () {
    it("ACCESS: Only minter should mint erc20 ", async function () {
      await expect(erc20.mint(owner.address, 1000)).to.be.revertedWith(
        "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
      );
    });

    it("ACCESS: Only burner should burn erc20 ", async function () {
      //FIX
      // await expect(erc20.burn(owner.address, 100)).to.be.reverted;

      await expect(() => bridge.connect(user1).swap(user2.address, 57, 100)).to.changeTokenBalance(
        erc20,
        user1,
        -100
      );
    });
  });

  describe("Swap", function () {
    it("Should burn erc20", async function () {
      await expect(() => bridge.connect(user1).swap(user2.address, 57, 100)).to.changeTokenBalance(
        erc20,
        user1,
        -100
      );
    });

    it("Should emit SwapInitialized event", async function () {
      expect(await bridge.connect(user1).swap(user2.address, 57, 100))
        .to.emit(bridge, "SwapInitialized")
        .withArgs(user1.address, user2.address, 57, 100, 0);
    });
  });

  describe("Redeem", function () {
    it("Should deposit correct amount of tokens", async function () {
      // emulate user2 wants to swap 100 tokens from another blockchain, nonce=0, recipient = user2.address
      let msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user2.address, user2.address, 100, 0]
      );
      let signature = await validator.signMessage(ethers.utils.arrayify(msg));
      let sig = await ethers.utils.splitSignature(signature);
      await expect(() =>
        bridge.connect(user2).redeem(user2.address, user2.address, 100, 0, sig.v, sig.r, sig.s)
      ).to.changeTokenBalance(erc20, user2, 100);
    });

    it("Should emit RedeemFinished event", async function () {
      // emulate user2 wants to swap 200 tokens from another blockchain, nonce=0, recipient = user2.address
      let msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user2.address, user2.address, 200, 3]
      );
      let signature = await validator.signMessage(ethers.utils.arrayify(msg));
      let sig = await ethers.utils.splitSignature(signature);
      expect(
        await bridge
          .connect(user2)
          .redeem(user2.address, user2.address, 200, 3, sig.v, sig.r, sig.s)
      )
        .to.emit(bridge, "RedeemFinished")
        .withArgs(user2.address, user2.address, 200, 3);
    });

    it("Should redeem only once", async function () {
      // emulate user2 wants to swap 200 tokens from another blockchain, nonce=0, recipient = user2.address
      let msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user2.address, user2.address, 200, 3]
      );
      let signature = await validator.signMessage(ethers.utils.arrayify(msg));
      let sig = await ethers.utils.splitSignature(signature);

      await bridge.connect(user2).redeem(user2.address, user2.address, 200, 3, sig.v, sig.r, sig.s);
      await expect(
        bridge.connect(user2).redeem(user2.address, user2.address, 200, 3, sig.v, sig.r, sig.s)
      ).to.be.revertedWith("Already redeemed");
    });

    it("Only validator can sign transactions", async function () {
      // emulate user2 wants to swap 200 tokens from another blockchain, nonce=0, recipient = user2.address
      let msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user2.address, user2.address, 200, 3]
      );
      let signature = await user1.signMessage(ethers.utils.arrayify(msg));
      let sig = await ethers.utils.splitSignature(signature);
      await expect(
        bridge.connect(user2).redeem(user2.address, user2.address, 200, 3, sig.v, sig.r, sig.s)
      ).to.be.revertedWith("Invalid signer");
    });

    it("Only recipient can redeem", async function () {
      // emulate user2 wants to swap 200 tokens from another blockchain, nonce=0, recipient = user2.address
      let msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user2.address, user2.address, 200, 3]
      );
      let signature = await validator.signMessage(ethers.utils.arrayify(msg));
      let sig = await ethers.utils.splitSignature(signature);
      await expect(
        bridge.connect(user1).redeem(user2.address, user2.address, 200, 3, sig.v, sig.r, sig.s)
      ).to.be.revertedWith("Not a recipient");
    });
  });

  describe("Utils", function () {
    it("Should change validator address by owner", async function () {
       expect(await bridge.validator()).to.eq(validator.address);

       await bridge.setValidator(user1.address);

       expect(await bridge.validator()).to.eq(user1.address);
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("PandaNFT", function () {
  let name = "PandaNFT";
  let symbol = "PFT";


  let pandaNft: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    const PandaNftFactory = await ethers.getContractFactory("PandaNFT");
    pandaNft = await PandaNftFactory.deploy(
      name,
      symbol
    );

    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the correct params", async function () {
      expect(await pandaNft.owner()).to.equal(owner.address);
      expect(await pandaNft.name()).to.equal(name);
      expect(await pandaNft.symbol()).to.equal(symbols);
      expect(await pandaNft.totalSupply()).to.equal(initialSupply);
      expect(await pandaNft.decimals()).to.equal(decimals);
    });

    it("Should state correct owner balance", async function () {
      expect(await pandaNft.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

});

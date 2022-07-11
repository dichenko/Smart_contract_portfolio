import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("Marketplace", function () {
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

    //deploy erc721 with creator account
    const ERC721Factory = await ethers.getContractFactory("MyERC721");
    erc721 = await ERC721Factory.deploy(creator.address);
    erc721.deployed();

    //deploy erc1155 with creator account
    const ERC1155Factory = await ethers.getContractFactory("MyERC1155");
    erc1155 = await ERC1155Factory.deploy(creator.address);
    erc721.deployed();

    //deploy erc20 
    const ERC20Factory = await ethers.getContractFactory("MyERC20");
    erc20 = await ERC20Factory.deploy("MarketplaceTOKEN", "MPTKN", 18, ethers.utils.parseEther("10000"));
    erc20.deployed();

    //deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy(erc20.address, erc721.address, erc1155.address, creator.address);
    marketplace.deployed();
    
  });

  describe("Deployment", function () {
    it("ACCESS: Only creator should mint 721 ", async function () {
      await expect(erc721.mint(owner.address, '/testURI'))
      .to.be.
      revertedWith('AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6');

      await erc721.connect(creator).mint(creator.address, '/testURI');
      expect (await erc721.balanceOf(creator.address)).to.equal(1);
    });

    it("ACCESS: Only creator should mint 1155 ", async function () {
        await expect(erc1155.mint(owner.address, 2, 100, '0x'))
        .to.be.
        revertedWith('AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c2519c4487d47714872f92cf90a50c25f5deaec2789dc2a497b1272df611db6');
  
        await erc1155.connect(creator).mint(creator.address, 2, 100, '0x');
        expect (await erc1155.balanceOf(creator.address,2)).to.equal(100);
      });
  });

});

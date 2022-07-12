// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./interfaces/IERC721Mintable.sol";
import "./interfaces/IERC1155Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is AccessControl, IERC1155Receiver {
    IERC20 erc20;
    IERC721Mintable nft721;
    IERC1155Mintable nft1155;

    //NFT-auction
    uint public auctionDuration = 3 days;
    uint public minBidCounter = 2;

    struct AuctionItem {
        bool ended;
        uint16 nftStandart;
        uint96 startTime;
        address seller;
        address highestBidder;
        uint nftId;
        uint amount;
        uint initPrice;
        uint highestBid;
    }
    AuctionItem[] public auctionItems;

    //mapping for the NFT-store
    mapping(bytes32 => bool) itemsForSale;

    //Roles
    bytes32 public constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 public constant CREATOR = keccak256(abi.encodePacked("CREATOR"));

    event ItemListed(
        address seller,
        uint16 nftStandart,
        uint id,
        uint amount,
        uint price
    );
    event ItemCancelled(
        address seller,
        uint16 nftStandart,
        uint id,
        uint amount,
        uint price
    );
    event ItemPurchased(
        address buyer,
        address seller,
        uint16 nftStandart,
        uint id,
        uint amount,
        uint price
    );
    event AuctionItemListed(
        uint itemIndex,
        uint nftStandart,
        uint id,
        uint amount,
        uint initPrice,
        address seller
    );
    event Bid(uint _id, uint _bid, address bidder);

    constructor(
        address _erc20,
        address _nft721,
        address _nft1155,
        address _creator
    ) {
        _grantRole(ADMIN, msg.sender);
        _grantRole(CREATOR, _creator);

        erc20 = IERC20(_erc20);
        nft721 = IERC721Mintable(_nft721);
        nft1155 = IERC1155Mintable(_nft1155);
    }

    ///@notice list nft in Marketplace
    function listItem(
        uint16 _nftStandart,
        uint _id,
        uint _amount,
        uint _price
    ) external {
        require(_nftStandart == 721 || _nftStandart == 1155);
        if (_nftStandart == 721) {
            require(_amount == 1, "Wrong NFT standart");
            require(nft721.ownerOf(_id) == msg.sender);
            bytes32 item = keccak256(
                abi.encodePacked(msg.sender, _nftStandart, _id, _amount, _price)
            );
            require(!itemsForSale[item], "Item already listed");
            nft721.transferFrom(msg.sender, address(this), _id);
            itemsForSale[item] = true;
        } else {
            require(
                nft1155.balanceOf(msg.sender, _id) >= _amount,
                "Not enough tokens"
            );

            bytes32 item = keccak256(
                abi.encodePacked(msg.sender, _nftStandart, _id, _amount, _price)
            );
            require(!itemsForSale[item], "Item already listed");
            nft1155.safeTransferFrom(
                msg.sender,
                address(this),
                _id,
                _amount,
                ""
            );
            itemsForSale[item] = true;
        }
        emit ItemListed(msg.sender, _nftStandart, _id, _amount, _price);
    }

    ///@notice unlist nft in Marketplace
    function cancel(
        uint16 _nftStandart,
        uint _id,
        uint _amount,
        uint _price
    ) external {
        bytes32 item = keccak256(
            abi.encodePacked(msg.sender, _nftStandart, _id, _amount, _price)
        );
        require(itemsForSale[item], "Nothing to cancel");
        if (_nftStandart == 721) {
            nft721.safeTransferFrom(address(this), msg.sender, _id);
            itemsForSale[item] = false;
        } else {
            nft1155.safeTransferFrom(
                address(this),
                msg.sender,
                _id,
                _amount,
                ""
            );
            itemsForSale[item] = false;
        }
        emit ItemCancelled(msg.sender, _nftStandart, _id, _amount, _price);
    }

    ///@notice buy nft in Marketplace
    function buyItem(
        address _seller,
        uint16 _nftStandart,
        uint _id,
        uint _amount,
        uint _price
    ) external {
        bytes32 item = keccak256(
            abi.encodePacked(_seller, _nftStandart, _id, _amount, _price)
        );
        require(itemsForSale[item], "Nothing to buy");
        erc20.transferFrom(msg.sender, _seller, _price);

        if (_nftStandart == 721) {
            nft721.safeTransferFrom(address(this), msg.sender, _id);
        } else {
            nft1155.safeTransferFrom(
                address(this),
                msg.sender,
                _id,
                _amount,
                ""
            );
        }
        itemsForSale[item] = false;
        emit ItemPurchased(
            msg.sender,
            _seller,
            _nftStandart,
            _id,
            _amount,
            _price
        );
    }

    ///@notice Allow creator to mint new 721 NFT
    function mint721(address recipient, string memory _tokenURI)
        external
        onlyRole(CREATOR)
    {
        nft721.mint(recipient, _tokenURI);
    }

    ///@notice Allow creator to mint new 1155 NFT
    function mint1155(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyRole(CREATOR) {
        nft1155.mint(account, id, amount, data);
    }

    //@notice listed item on auction
    function listItemOnAuction(
        uint16 _nftStandart,
        uint _id,
        uint _amount,
        uint _initPrice
    ) external {
        require(
            _nftStandart == 721 || _nftStandart == 1155,
            "Invalid standart"
        );
        if (_nftStandart == 721) {
            require(nft721.ownerOf(_id) == msg.sender, "Not NFT owner");
            nft721.transferFrom(msg.sender, address(this), _id);
        } else {
            require(
                nft1155.balanceOf(msg.sender, _id) >= _amount,
                "Not enough tokens"
            );
            nft1155.safeTransferFrom(
                msg.sender,
                address(this),
                _id,
                _amount,
                ""
            );
        }

        auctionItems.push(
            AuctionItem(
                false,
                _nftStandart,
                uint96(block.timestamp),
                msg.sender,
                address(0),
                _id,
                _amount,
                _initPrice,
                _initPrice
            )
        );

        uint itemIndex = auctionItems.length - 1;

        emit AuctionItemListed(
            itemIndex,
            _nftStandart,
            _id,
            _amount,
            _initPrice,
            msg.sender
        );
    }

    function makeBid(uint _id, uint _bid) external{
        require (auctionItems[_id].startTime + auctionDuration > block.timestamp, "Auction ended");
        require (_bid > auctionItems[_id].highestBid, "Too low price");
        erc20.transferFrom(msg.sender, address(this), _bid);
        if (auctionItems[_id].highestBidder != address(0)){
            erc20.transfer(auctionItems[_id].highestBidder, auctionItems[_id].highestBid);
        }
        auctionItems[_id].highestBidder = msg.sender;
        auctionItems[_id].highestBid = _bid;

        emit Bid(_id, _bid, msg.sender);
    }

    function finishAuction() external{}




    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(IERC165, AccessControl)
        returns (bool)
    {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"
                )
            );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./interfaces/IERC721Mintable.sol";
import "./interfaces/IERC1155Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is AccessControl, IERC1155Receiver {
    IERC20 erc20;
   
    enum NftStandart {
        ERC721,
        ERC1155
    }

    IERC721Mintable[] public supported721;
    IERC1155Mintable[] public supported1155;

    //NFT-auction
    uint public auctionDuration = 3 days;
    uint public minBidCounter = 3;

    struct StoreItem{
        bool listed;
        address seller;
        NftStandart nftStandart;
        uint collectionId;
        uint nftId;
        uint amount;
        uint price;
    }

    StoreItem[] public storeItems;

    struct AuctionItem {
        bool ended;
        uint collectionId;
        NftStandart nftStandart;
        uint96 startTime;
        address seller;
        address highestBidder;
        uint nftId;
        uint amount;
        uint initPrice;
        uint highestBid;
        uint bidCounter;
    }
    AuctionItem[] public auctionItems;

    //mapping for the NFT-store
    //mapping(bytes32 => bool) itemsForSale;

    bytes32 public constant CREATOR = keccak256(abi.encodePacked("CREATOR"));

    event ItemListed(
        uint itemId,
        address seller,
        NftStandart nftStandart,
        uint collectionId,
        uint nftId,
        uint amount,
        uint price
    );
    event ItemCancelled(uint id);
    event ItemPurchased( uint id);
    event AuctionItemListed(
        uint itemIndex,
        uint collectionId,
        NftStandart nftStandart,
        uint id,
        uint amount,
        uint initPrice,
        address seller
    );
    event Bid(uint _id, uint _bid, address bidder);
    event SupportedCollection(NftStandart _nftStandart, address _address);
    event AuctionFinished(uint _id);

    constructor(
        address _erc20,
        address _nft721,
        address _nft1155,
        address _creator
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(CREATOR, DEFAULT_ADMIN_ROLE);
        _grantRole(CREATOR, _creator);

        erc20 = IERC20(_erc20);
        supported721.push(IERC721Mintable(_nft721));
        supported1155.push(IERC1155Mintable(_nft1155));
    }

    ///@notice list nft in Marketplace
    function listItem(
        NftStandart _nftStandart,
        uint _collectionId,
        uint _nftId,
        uint _amount,
        uint _price
    ) external {
        if (_nftStandart == NftStandart.ERC721) {
            IERC721Mintable nft721 = supported721[_collectionId];
            require(_amount == 1, "Wrong NFT standart");
            require(nft721.ownerOf(_nftId) == msg.sender);
            nft721.transferFrom(msg.sender, address(this), _nftId);
            storeItems.push(StoreItem(true, msg.sender, _nftStandart, _collectionId,_nftId,  _amount, _price));

        } else {
            IERC1155Mintable nft1155 = supported1155[_collectionId];
            require(
                nft1155.balanceOf(msg.sender, _nftId) >= _amount,
                "Not enough tokens"
            );

            nft1155.safeTransferFrom(
                msg.sender,
                address(this),
                _nftId,
                _amount,
                ""
            );
            storeItems.push(StoreItem(true, msg.sender, _nftStandart, _collectionId,_nftId,  _amount, _price));
        }
        
        emit ItemListed(storeItems.length-1,msg.sender, _nftStandart, _collectionId, _nftId, _amount, _price);
    }

    ///@notice unlist nft in Marketplace store
    function cancel(uint _itemId) external {
        StoreItem storage item = storeItems[_itemId];
        require (item.listed, "Item didn't listed");
        require (item.seller == msg.sender, "Caller is not a seller of this item");
        if (item.nftStandart == NftStandart.ERC721) {
            IERC721Mintable nft721 = supported721[item.collectionId];
            nft721.safeTransferFrom(address(this), msg.sender, item.nftId);
            
        } else {
            IERC1155Mintable nft1155 = supported1155[item.collectionId];
            nft1155.safeTransferFrom(
                address(this),
                msg.sender,
                item.nftId,
                item.amount,
                ""
            );
        }
        item.listed = false;
        emit ItemCancelled(_itemId);
    }

    ///@notice buy nft in Marketplace
    function buyItem(uint _itemId) external {
        StoreItem storage item = storeItems[_itemId];
        require(item.listed, "Iten didn't listed");

        erc20.transferFrom(msg.sender, item.seller, item.price);

        if (item.nftStandart == NftStandart.ERC721) {
            IERC721Mintable nft721 = supported721[item.collectionId];

            nft721.safeTransferFrom(address(this), msg.sender, item.nftId);
        } else {
            IERC1155Mintable nft1155 = supported1155[item.collectionId];
            nft1155.safeTransferFrom(
                address(this),
                msg.sender,
                item.nftId,
                item.amount,
                ""
            );
        }
        item.listed= false;
        emit ItemPurchased(_itemId);
    }

    ///@notice Allow creator to mint new 721 NFT
    function mint721(uint _collectionId, string memory _tokenURI)
        external
        onlyRole(CREATOR)
    {  
        IERC721Mintable nft721 = supported721[_collectionId];
        nft721.mint(msg.sender, _tokenURI);
    }

    ///@notice Allow creator to mint new 1155 NFT
    function mint1155(
        uint256 _collectionId,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyRole(CREATOR) {
        IERC1155Mintable nft1155 = supported1155[_collectionId];
        nft1155.mint(msg.sender, id, amount, data);
    }

    //@notice listed item on auction
    function listItemOnAuction(
        uint256 _collectionId,
        NftStandart _nftStandart,
        uint _id,
        uint _amount,
        uint _initPrice
    ) external {
        if (_nftStandart == NftStandart.ERC721) {
            IERC721Mintable nft721 = supported721[_collectionId];
            require(nft721.ownerOf(_id) == msg.sender, "Caller is not NFT's owner");
            nft721.transferFrom(msg.sender, address(this), _id);
        } else {
            IERC1155Mintable nft1155 = supported1155[_collectionId];
            require(
                nft1155.balanceOf(msg.sender, _id) >= _amount,
                "Not enough NFTs"
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
                _collectionId,
                _nftStandart,
                uint96(block.timestamp),
                msg.sender,
                address(0),
                _id,
                _amount,
                _initPrice,
                _initPrice,
                0
            )
        );

        uint itemIndex = auctionItems.length - 1;

        emit AuctionItemListed(
            itemIndex,
            _collectionId,
            _nftStandart,
            _id,
            _amount,
            _initPrice,
            msg.sender
        );
    }

    function makeBid(uint _id, uint _bid) external {
        require(_id < auctionItems.length, "Auction does not exist");
        require(
            auctionItems[_id].startTime + auctionDuration > block.timestamp,
            "Auction finished"
        );
        require(_bid > auctionItems[_id].highestBid, "Too low price");
        erc20.transferFrom(msg.sender, address(this), _bid);
        if (auctionItems[_id].highestBidder != address(0)) {
            erc20.transfer(
                auctionItems[_id].highestBidder,
                auctionItems[_id].highestBid
            );
        }
        auctionItems[_id].highestBidder = msg.sender;
        auctionItems[_id].highestBid = _bid;
        auctionItems[_id].bidCounter += 1;

        emit Bid(_id, _bid, msg.sender);
    }

    function finishAuction(uint _id) external {
        AuctionItem storage item = auctionItems[_id];
        require(!item.ended, "Auction already finished");
        require(
            item.startTime + auctionDuration <= block.timestamp,
            "Can't finish auction before duration time is up"
        );
        item.ended = true;
        if (item.bidCounter >= minBidCounter) {
            erc20.transfer(
                item.seller,
                item.highestBid
            );
            if (item.nftStandart == NftStandart.ERC721) {
                IERC721Mintable nft721 = supported721[item.collectionId];
                nft721.transferFrom(
                    address(this),
                    item.highestBidder,
                    item.nftId
                );
            } else {
                IERC1155Mintable nft1155 = supported1155[item.collectionId];
                nft1155.safeTransferFrom(
                    address(this),
                    item.highestBidder,
                    item.nftId,
                    item.amount,
                    ""
                );
            }
        } else {
            erc20.transfer(
                item.highestBidder,
                item.highestBid
            );
            if (item.nftStandart == NftStandart.ERC721) {
                IERC721Mintable nft721 = supported721[item.collectionId];
                nft721.transferFrom(
                    address(this),
                    item.seller,
                    item.nftId
                );
            } else {
                IERC1155Mintable nft1155 = supported1155[item.collectionId];
                nft1155.safeTransferFrom(
                    address(this),
                    item.seller,
                    item.nftId,
                    item.amount,
                    ""
                );
            }
        }
        emit AuctionFinished(_id);
    }

    ///@notice get info about auction item by id
    function getAuctionItem(uint _id)
        external
        view
        returns (AuctionItem memory item)
    {
        return auctionItems[_id];
    }

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
///@notice add new NFT collection to marketplace
    function addNftCollection (NftStandart _nftStandart, address _address) external onlyRole(DEFAULT_ADMIN_ROLE){
        if (_nftStandart == NftStandart.ERC721){
            supported721.push(IERC721Mintable(_address));
        } else {
            supported1155.push(IERC1155Mintable(_address));
        }
        emit SupportedCollection(_nftStandart, _address);
    }
}

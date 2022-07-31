//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Warranty is ERC721URIStorage,Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    //modifier for checking sellers authorisation
    modifier onlySeller{
        _;
        require(isSeller[msg.sender] == true,"Not authorised seller");
    }

    //struct to store warranty details
    struct WntDetails{
        address owner;
        address seller;
        uint buyDate;
        int warrantyPeriod;
        string TokenUri;
    }
    
    //mapping from seller address to boolean
    mapping(address => bool)  private isSeller;

    //mapping from tokenId to Warranty details
    mapping(uint => WntDetails) Warranties;

    constructor() ERC721("warranty", "WNT") {}

    //authorise seller after kyc;
    function authoriseSeller(address seller) public onlyOwner returns(bool){
        isSeller[seller] = true;
        return isSeller[seller];
    }


    function mintNFT(address recipient,int warrantyPeriod, string memory tokenURI)
        public 
        onlySeller
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
         
         //set warranty details
        WntDetails memory _wnt = WntDetails(recipient,
                                  msg.sender,
                                  block.timestamp,
                                  warrantyPeriod,
                                  tokenURI
                                );

        Warranties[newItemId] = _wnt;

        return newItemId;
    }

    //To check if warranty is still valid.
    function checkWarranty(uint itemId) public view returns(bool){
        return (block.timestamp - Warranties[itemId].buyDate) <= uint(Warranties[itemId].warrantyPeriod);
    }

    //function to get a warranty's details.
    function getWarrantyDetails(uint itemId) public view returns(WntDetails memory){
        return Warranties[itemId];
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");

        _transfer(from, to, tokenId);

        Warranties[tokenId].owner = to;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        _safeTransfer(from, to, tokenId, data);
        Warranties[tokenId].owner = to;
    }



}
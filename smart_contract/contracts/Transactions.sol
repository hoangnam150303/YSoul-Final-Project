// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;

    event Transfer(
        address from,
        address receiver,
        string nftName,
        string urlImage,
        uint amount,
        uint256 timeStamp,
        string keyword
    );

    struct TransferStruct {
        address sender;
        address receiver;
        string nftName;
        string urlImage;
        uint amount;
        uint256 timeStamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver,
        uint amount,
        string memory nftName,
        string memory urlImage,
        string memory keyword
    ) public {
        require(receiver != address(0), "Receiver address cannot be zero");
        require(amount > 0, "Amount must be greater than zero");
        require(bytes(nftName).length > 0, "NFT name cannot be empty");
        require(bytes(urlImage).length > 0, "Image URL cannot be empty");

        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                nftName,
                urlImage,
                amount,
                block.timestamp,
                keyword
            )
        );

        emit Transfer(
            msg.sender,
            receiver,
            nftName,
            urlImage,
            amount,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}

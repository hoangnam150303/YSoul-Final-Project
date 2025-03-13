const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Transactions Contract", function () {
  let transactionsContract;
  let deployer, addr1;

  beforeEach(async function () {
    [deployer, addr1] = await ethers.getSigners();
    const Transactions = await ethers.getContractFactory("Transactions");
    transactionsContract = await Transactions.deploy();
    await transactionsContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have initial transaction count of 0", async function () {
      const count = await transactionsContract.getTransactionCount();
      expect(count).to.equal(0);
    });
  });

  describe("Transactions", function () {
    it("Should add a transaction and update the count", async function () {
      const receiver = addr1.address;
      const amount = ethers.parseUnits("1", "ether"); // 1 ETH
      const nftName = "Test NFT";
      const urlImage = "http://example.com/nft.png";
      const keyword = "Test";

      await expect(
        transactionsContract
          .connect(deployer)
          .addToBlockchain(receiver, amount, nftName, urlImage, keyword)
      )
        .to.emit(transactionsContract, "Transfer")
        .withArgs(
          deployer.address,
          receiver,
          nftName,
          urlImage,
          amount,
          anyValue, // block.timestamp
          keyword
        );

      // Kiểm tra transaction count sau khi thêm
      const countAfter = await transactionsContract.getTransactionCount();
      expect(countAfter).to.equal(1);

      // Lấy danh sách giao dịch
      const transactions = await transactionsContract.getAllTransactions();
      expect(transactions.length).to.equal(1);

      // Kiểm tra thông tin giao dịch
      const tx = transactions[0];
      expect(tx.sender).to.equal(deployer.address);
      expect(tx.receiver).to.equal(receiver);
      expect(tx.nftName).to.equal(nftName);
      expect(tx.urlImag).to.equal(urlImage); // Đúng với tên biến trong struct
      expect(tx.amount).to.equal(amount);
      expect(tx.keyword).to.equal(keyword);
    });
  });
});

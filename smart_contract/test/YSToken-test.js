const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20-BEP20 YS_Token", function() {
    let [accountA, accountB, accountC] = [];
    let token;
    let amount = 100;
    let totalSupply = 1000000;
    let timestamp = Math.floor(Date.now() / 1000);
    let data = "Test transfer";

    beforeEach(async function() {
        [accountA, accountB, accountC] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("YS_Token");
        token = await Token.deploy();        
        await token.waitForDeployment();
    });

    describe("common", function() {
        it("total supply should return correct value", async function() {
            expect(await token.totalSupply()).to.be.equal(totalSupply);
        });

        it("balance Of account A should return correct value", async function(){
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply);
        });

        it("balance of account B should return correct value", async function(){
            expect(await token.balanceOf(accountB.address)).to.be.equal(0);
        });

        it("allowance of account A to account B should return correct value", async function(){
            expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(0);
        });
    });

    describe("transfer", function() {
        it("should revert if amount exceeds balance", async function(){
            await expect(token.transfer(accountB.address, totalSupply + 1, timestamp, data)).to.be.reverted;
        });

        it("should transfer tokens correctly", async function(){
            let transferTx = await token.transfer(accountB.address, amount, timestamp, data);
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount);
            expect(await token.balanceOf(accountB.address)).to.be.equal(amount);
            await expect(transferTx).to.emit(token, "Transfer").withArgs(accountA.address, accountB.address, amount, timestamp, data);
        });    
    });

    describe("transferFrom", function() {
        it("should revert if amount exceeds balance", async function(){
            await expect(token.connect(accountB).transferFrom(accountA.address, accountC.address, totalSupply + 1, timestamp, data)).to.be.reverted;
        });

        it("should revert if amount exceeds allowance", async function(){
            await expect(token.connect(accountB).transferFrom(accountA.address, accountC.address, amount, timestamp, data)).to.be.reverted;
        });

        it("should transfer tokens correctly", async function(){
            await token.approve(accountB.address, amount);
            let transferFromTx = await token.connect(accountB).transferFrom(accountA.address, accountC.address, amount, timestamp, data);
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount);
            expect(await token.balanceOf(accountC.address)).to.be.equal(amount);
            await expect(transferFromTx).to.emit(token, "Transfer").withArgs(accountA.address, accountC.address, amount, timestamp, data);
        });    
    });

    describe("approve", function() {
        it("should approve correctly", async function(){
            const approveTx = await token.approve(accountB.address, amount);
            expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(amount);
            await expect(approveTx).to.emit(token, "Approval").withArgs(accountA.address, accountB.address, amount);
        });
    });
});
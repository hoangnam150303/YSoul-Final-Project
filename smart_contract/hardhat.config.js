require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: Number(process.env.CHAIN_ID),  // Chuyển đổi sang số
      accounts: process.env.PRIVATE_KEY
        ? [
            {
              privateKey: process.env.PRIVATE_KEY,
              balance: process.env.BALANCE,
            },
          ]
        : [], // Kiểm tra nếu PRIVATE_KEY không có thì trả về mảng rỗng
    },
  },
};

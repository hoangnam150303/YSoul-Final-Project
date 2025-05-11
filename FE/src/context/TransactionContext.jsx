import React, { createContext, useEffect, useState } from "react";
import { contractABI, contractAddress } from "../constants/AddressContants";
import { ethers } from "ethers";
import { message } from "antd";
export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    nftName: "",
    urlImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const checkIfWalletConnected = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      getAllTransactions();
    } else {
      console.log("No accounts found");
    }
  };
  const logOut = async () => {
    setCurrentAccount("");
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, nftName, urlImage } = formData;
      const transactionContract = await getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount.toString());
      let txHash;
      try {
        txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to send transaction:", error);
        message.error("Failed to send transaction");
        return;
      }

      try {
        await transactionContract.addToBlockchain(
          addressTo,
          parsedAmount,
          nftName,
          urlImage,
          keyword
        );
 
        setFormData({
          addressTo: "",
          amount: "",
          keyword: "",
          nftName: "",
          urlImage: "",
        });
      } catch (error) {
        console.error("Lỗi từ contract:", error);
        message.error("Blockchain interaction failed");
        return;
      }
      await getAllTransactions();
    } catch (error) {
      console.error(error);
      message.error("An unexpected error occurred");
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!ethereum) {
        console.error("Ethereum object not found!");
        return;
      }

      const transactionsContract = await getEthereumContract();

      if (!transactionsContract) {
        console.error("Contract instance not found!");
        return;
      }

      const currentTransactionCount =
        await transactionsContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", currentTransactionCount);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllTransactions = async () => {
    try {
      const transactionsContract = await getEthereumContract();

      try {
        const result = await transactionsContract.getAllTransactions();
        console.log(result);

        setTransactions(result);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletConnected();
    checkIfTransactionsExists();
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        logOut,
        formData,
        setFormData,
        sendTransaction,
        transactions,
        getAllTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

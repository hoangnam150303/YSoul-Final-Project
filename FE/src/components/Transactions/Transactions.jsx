import React, { useContext, useEffect, useState } from "react";
import { SwapOutlined } from "@ant-design/icons";
import { TransactionContext } from "../../context/TransactionContext";
import { ethers } from "ethers";

const Transactions = () => {
  const { transactions } = useContext(TransactionContext);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Sắp xếp theo thời gian mới nhất
      const sorted = [...transactions].sort(
        (a, b) =>
          parseInt(b.timeStamp._hex, 16) - parseInt(a.timeStamp._hex, 16)
      );
      setAllTransactions(sorted);
    } else {
      setAllTransactions([]);
    }
  }, [transactions]);

  const TransactionCard = ({ tx }) => {
    const amountInETH = ethers.utils.formatEther(tx.amount);
    const time = new Date(
      parseInt(tx.timeStamp._hex, 16) * 1000
    ).toLocaleString();

    return (
      <div className="flex flex-col border border-pink-500 text-gray-300 w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2">
        <img
          src={tx.urlImage}
          alt={tx.nftName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-2 text-pink-400 font-semibold">
            <SwapOutlined className="mr-2" /> {tx.nftName}
          </div>
          <p className="text-sm mb-1">
            <span className="font-medium">From:</span>{" "}
            {`${tx.sender.slice(0, 6)}...${tx.sender.slice(-4)}`}
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">To:</span>{" "}
            {`${tx.receiver.slice(0, 6)}...${tx.receiver.slice(-4)}`}
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">Amount:</span> {amountInETH} ETH
          </p>
          <p className="text-sm mb-1">
            <span className="font-medium">Keyword:</span> {tx.keyword}
          </p>
          <p className="text-sm">
            <span className="font-medium">Time:</span> {time}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#151c25] min-h-screen">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient mb-4">
          Latest Transactions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTransactions.length > 0 ? (
            allTransactions.map((tx, i) => <TransactionCard key={i} tx={tx} />)
          ) : (
            <p className="text-white col-span-full text-center">
              No transactions found.
            </p>
          )}
        </div>

        <div className="text-center my-5">
          <button
            className="shadow-lg shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] 
            rounded-full px-6 py-2 text-sm font-medium"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

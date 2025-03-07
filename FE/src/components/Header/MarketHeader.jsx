import React, { useContext, useEffect } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import { Link } from "react-router-dom";

const MarketHeader = () => {
  const { connectWallet, currentAccount, logOut } =
    useContext(TransactionContext);

  return (
    <div className="w-4/5 flex justify-between md:jusity-center items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          className="w-32 cursor-pointer"
          src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
          alt="Logo"
        />
      </div>
      <ul className="md:flex-[0.5] text-white md:flex hidden list-none justify-between items-center flex-initial">
        <Link to="/market">
          <li className="mx-4 cursor-pointer">Market</li>
        </Link>
        <li className="mx-4 cursor-pointer">Artist</li>
        <li className="mx-4 cursor-pointer">NFTs</li>
        {currentAccount && (
          <Link to="/store">
            <li className="mx-4 cursor-pointer">Your Store</li>
          </Link>
        )}
      </ul>
      {!currentAccount ? (
        <button
          className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
        rounded-full"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
      rounded-full"
          onClick={logOut}
        >
          {currentAccount.slice(0, 5)}...{currentAccount.slice(38, 42)}
        </button>
      )}
    </div>
  );
};

export default MarketHeader;

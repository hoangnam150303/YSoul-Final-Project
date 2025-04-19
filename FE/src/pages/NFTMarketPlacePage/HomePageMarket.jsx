import React, { useContext, useEffect, useState } from "react";
import MarketHeader from "../../components/Header/MarketHeader";
import Hero from "../../components/Hero/Hero";
import Artwork from "../../components/Artwork/Artwork";
import Transactions from "../../components/Transactions/Transactions";
import { TransactionContext } from "../../context/TransactionContext";

const HomePageMarket = () => {
  const [filter, setFilter] = useState("all"); // Default filter is "all"
  const [search, setSearch] = useState(""); // Default search is empty string
  // Gọi useContext ở cấp component
  
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <MarketHeader />
        <Hero />
      </div>
      <Artwork search={search} filter={filter} isHomePage={true}/>
    
      <Transactions />
    </div>
  );
};

export default HomePageMarket;

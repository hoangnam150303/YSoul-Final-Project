import React from "react";
import MarketHeader from "../../components/Header/MarketHeader";
import Hero from "../../components/Hero/Hero";
import Artwork from "../../components/Artwork/Artwork";
import Transactions from "../../components/Transactions/Transactions";

const HomePageMarket = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <MarketHeader />
        <Hero />
      </div>
      <Artwork />
      <Transactions />
    </div>
  );
};

export default HomePageMarket;

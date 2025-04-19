import React from "react";
import MarketHeader from "../../components/Header/MarketHeader";
import ArtistNFTs from "../../components/ArtistNFts/ArtistNFTs";

export const ArtistNFTsPage = () => {
  return (
    <div className="gradient-bg-hero min-h-screen">
      <MarketHeader />
      <ArtistNFTs />
    </div>
  );
};

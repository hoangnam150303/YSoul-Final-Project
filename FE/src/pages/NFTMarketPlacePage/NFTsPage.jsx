import React, { useState } from "react";
import MarketHeader from "../../components/Header/MarketHeader";

import Artwork from "../../components/Artwork/Artwork";

const NFTsPage = () => {
  const [filter, setFilter] = useState("all"); // Default filter is "newest"

  return (
    <div className="gradient-bg-hero min-h-screen">
      <MarketHeader />

      <Artwork filter={filter} isHomePage={false} />
      {/* Điều chỉnh Pagination */}
    </div>
  );
};

export default NFTsPage;

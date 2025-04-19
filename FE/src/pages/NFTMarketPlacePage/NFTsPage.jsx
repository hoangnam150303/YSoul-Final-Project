import React, { useState } from "react";
import MarketHeader from "../../components/Header/MarketHeader";
import { Pagination } from "antd";
import Artwork from "../../components/Artwork/Artwork";
const NFTsPage = () => {
  const [filter, setFilter] = useState("all"); // Default filter is "newest"
  const [search, setSearch] = useState(""); // Default search is empty string
  const [page, setPage] = useState(1); // Default page is 1
  const [limit, setLimit] = useState(8); // Default limit is 10
  const [totalNFT, setTotalNFT] = useState(0); // Default totalNFT is 0

  return (
    <div className="gradient-bg-hero min-h-screen">
      <MarketHeader />
      <Artwork
        search={search}
        filter={filter}
        limit={limit}
        page={page}
        setTotalNFT={setTotalNFT}
        isHomePage={false}
      />
      {/* Điều chỉnh Pagination */}
      <div className="flex justify-end mt-4 bg-[#151c25]">
        <Pagination
          current={page}
          pageSize={limit}
          total={totalNFT}
          onChange={(newPage, newPageSize) => {
            setPage(newPage);
            setLimit(newPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default NFTsPage;

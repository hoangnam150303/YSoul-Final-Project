import React, { useState } from "react";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { UserAddOutlined } from "@ant-design/icons";
import { Radio, Input } from "antd";
import { SocialHeader } from "../../components/Header/SocialHeader";

export const NetworkPage = () => {
  const [reviewers, setReviewers] = useState([
    { id: 1, name: "Alice", description: "Top Reviewer", img: "" },
    { id: 2, name: "Bob", description: "Tech Enthusiast", img: "" },
    { id: 3, name: "Charlie", description: "Gadget Lover", img: "" },
  ]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRadioChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SocialHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-5 ml-4">
        <div className="col-span-1 lg:col-span-1">
          <SocialSideBar />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-secondary rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Networks</h1>

            {/* Bộ lọc */}
            <div className="mb-4 flex justify-center gap-x-4">
              <Radio.Group
                value={selectedFilter}
                onChange={handleRadioChange}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio value="Followers">Followers</Radio>
                <Radio value="Following">Following</Radio>
                <Radio value="All">All</Radio>
              </Radio.Group>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="mb-4 flex justify-center">
              <Input.Search
                placeholder="Search reviewers..."
                value={searchQuery}
                onChange={handleSearch}
                allowClear
                className="w-1/2"
              />
            </div>

            {/* Danh sách reviewers */}
            {filteredReviewers.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Top Reviewers</h2>
                <div className="space-y-4">
                  {filteredReviewers.map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="bg-white rounded-lg shadow p-4 flex items-center"
                    >
                      <img
                        src={reviewer.img || "https://via.placeholder.com/48"}
                        alt={reviewer.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {reviewer.name}
                        </h3>
                        <p className="text-gray-600">{reviewer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
                <UserAddOutlined
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  No Reviewer Available
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

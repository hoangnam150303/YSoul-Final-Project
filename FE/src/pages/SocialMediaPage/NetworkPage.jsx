import React, { useEffect, useState } from "react";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { UserAddOutlined } from "@ant-design/icons";
import { Radio, Input, Pagination } from "antd";
import { SocialHeader } from "../../components/Header/SocialHeader";
import userApi from "../../hooks/useUser";
import { useSelector } from "react-redux";

export const NetworkPage = () => {
  const [reviewers, setReviewers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("popular");
  const [search, setSearch] = useState(" ");
  const userId = useSelector((state) => state.user.id);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchRevierwers = async () => {
    try {
      const response = await userApi.getAllReviewer(
        filter,
        search,
        pageSize,
        currentPage
      );
      setReviewers(response.data.reviewers);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRevierwers();
  }, [filter, search, currentPage, pageSize]);

  const handleRadioChange = (e) => {
    const selected = e.target.value;
    setSelectedFilter(selected);
    if (selected === "All") setFilter("popular");
    else if (selected === "Followers") setFilter("followers");
    else if (selected === "Following") setFilter("following");
    setCurrentPage(1); // reset về trang đầu khi đổi filter
  };
  const handleUpdateStatus = async (id) => {
    try {
      const response = await userApi.followUser(id);
      fetchRevierwers();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSearch(e.target.value);
    setCurrentPage(1); // reset về trang đầu khi search
  };

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
            {reviewers.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Top Reviewers</h2>
                <div className="space-y-4">
                  {reviewers.map((reviewer) => {
                    const isFollowed = reviewer.user_followed?.some(
                      (user) => user === userId
                    );
                    console.log(reviewer);

                    return (
                      <div
                        key={reviewer.id}
                        className="bg-white rounded-lg shadow p-4 flex items-center"
                      >
                        <img
                          src={
                            reviewer.avatar || "https://via.placeholder.com/48"
                          }
                          alt={reviewer.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {reviewer.name}
                          </h3>
                        </div>
                        <div className="ml-auto">
                          {reviewer.id !== userId && (
                            <button
                              className={`px-3 py-1 rounded-full text-sm ${
                                isFollowed ? "bg-green-600" : "bg-blue-600"
                              } text-white flex items-center`}
                              onClick={() => handleUpdateStatus(reviewer.id)}
                            >
                              {isFollowed ? "Followed" : "Follow"}
                              {isFollowed ? (
                                <i className="bi bi-check-circle ml-1"></i>
                              ) : (
                                <UserAddOutlined className="ml-1" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size); // nếu muốn giữ 10 cố định, có thể bỏ dòng này
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

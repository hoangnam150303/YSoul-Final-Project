import { UserAddOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import reviewerApi from "../../hooks/reviewerApi";
import { useSelector } from "react-redux";

export const RecommendedSideBar = () => {
  const [topReviewers, setTopReviewers] = useState([]);
  const userId = useSelector((state) => state.user.id);

  const fetchTopReviewers = async () => {
    try {
      const response = await reviewerApi.getAllReviewer("popular", " ", 10, 1);
      setTopReviewers(response.data.reviewers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopReviewers();
  }, []);

  const toggleFollow = async (id) => {
    try {
      await reviewerApi.followUser(id);
      fetchTopReviewers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // ✨ Dark Container
    // Thuộc tính sticky đã được áp dụng. Top: 620px là khoảng cách an toàn để nó dính ngay bên dưới SocialSideBar.
    <div
      className="bg-[#1f1f1f] rounded-xl shadow-lg border border-[#2a2a2a] p-4 sticky transition-all duration-300"
      style={{ top: "600px", zIndex: 0 }}
    >
      <h3 className="text-white font-bold text-base mb-4 border-b border-[#2a2a2a] pb-2">
        Who to follow
      </h3>

      <div className="flex flex-col space-y-4">
        {topReviewers.length > 0 ? (
          topReviewers.slice(0, 10).map((reviewer) => {
            const isFollowed = reviewer.user_followed?.some(
              (user) => user === userId
            );

            return (
              <div
                key={reviewer.id}
                className="flex items-center justify-between group"
              >
                <Link
                  className="flex items-center gap-3 flex-1 min-w-0"
                  to={`/profile/${reviewer.id}`}
                >
                  <div className="relative">
                    <img
                      src={reviewer.avatar}
                      className="w-10 h-10 rounded-full object-cover border border-[#333] group-hover:border-gray-500 transition-colors"
                      alt="Reviewer Avatar"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-200 truncate group-hover:text-white transition-colors">
                      {reviewer.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      Top Reviewer
                    </p>
                  </div>
                </Link>

                {reviewer.id === userId ? (
                  <span className="text-xs text-gray-500 italic px-2">You</span>
                ) : (
                  <button
                    className={`ml-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 min-w-[85px] ${
                      isFollowed
                        ? "bg-[#2a2a2a] text-green-500 border border-green-900 hover:bg-green-900/20"
                        : "bg-white text-black hover:bg-gray-200 border border-transparent"
                    }`}
                    onClick={() => toggleFollow(reviewer.id)}
                  >
                    {isFollowed ? (
                      <>
                        Followed <i className="bi bi-check-circle-fill"></i>
                      </>
                    ) : (
                      <>
                        Follow <UserAddOutlined />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <UserAddOutlined className="text-2xl mb-2 opacity-50" />
            <p className="text-xs">No recommendations yet</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
        <Link
          to="/network"
          className="block text-center text-xs text-blue-400 hover:text-blue-300 hover:underline"
        >
          View all recommendations
        </Link>
      </div>
    </div>
  );
};

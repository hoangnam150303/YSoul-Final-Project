import { UserAddOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../hooks/useUser";
import { useSelector } from "react-redux";

export const RecommendedSideBar = () => {
  const [topReviewers, setTopReviewers] = useState([]);
  const userId = useSelector((state) => state.user.id);
  const fetchTopReviewers = async () => {
    try {
      const response = await userApi.getAllReviewer("popular", "");
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
      await userApi.followUser(id);
      fetchTopReviewers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 gap-2">
      {topReviewers.length > 0 ? (
        topReviewers.slice(0, 10).map((reviewer) => {
          const isFollowed = reviewer.user_followed?.some(
            (user) => user === userId
          );

          return (
            <div key={reviewer.id} className="flex items-center space-x-3">
              <Link className="flex items-center" to="/profile">
                <img
                  src={reviewer.avatar}
                  className="w-12 h-12 rounded-full mr-2"
                  alt="Reviewer Avatar"
                />
                <div>
                  <h3 className="font-semibold text-sm">{reviewer.name}</h3>
                  <h3 className="text-xs text-gray-500">Top Reviewer</h3>
                </div>
              </Link>
              {reviewer.id === userId ? (
                <div></div>
              ) : (
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    isFollowed ? "bg-green-600" : "bg-blue-600"
                  } text-white flex items-center`}
                  onClick={() => toggleFollow(reviewer.id)}
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
          );
        })
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-gray-500">No reviewers available</p>
        </div>
      )}
    </div>
  );
};

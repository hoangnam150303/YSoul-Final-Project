import React, { useEffect, useState } from "react";
import { SocialHeader } from "../../components/Header/SocialHeader";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { PostCreation } from "../../components/Post/PostCreation";
import { UserOutlined } from "@ant-design/icons";
import { RecommendedSideBar } from "../../components/SideBar/RecommendedSideBar";
import { ListPost } from "../../components/Post/ListPost";
import postApi from "../../hooks/postApi";

export const SocialHomePage = () => {
  const [recommendedUsers, setRecommendedUsers] = useState([1]);

  return (
    <>
      <SocialHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="hidden lg:block lg:col-span-1">
          <SocialSideBar />
          {recommendedUsers.length > 0 && (
            <div className="col-span-1 lg:col-span-1 hidden lg:block mt-5">
              <div className="bg-gray-200 rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4">Top reviewers</h2>
                {recommendedUsers.map((user) => (
                  <RecommendedSideBar key={user?._id} user={user?.name} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-3 p-6 bg-gray-50 rounded-lg shadow">
          {/* Main Content Here */}
          <PostCreation />
          <ListPost />
        </div>
      </div>
    </>
  );
};

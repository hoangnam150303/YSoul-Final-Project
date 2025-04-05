import React from "react";
import { SocialHeader } from "../../components/Header/SocialHeader";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { PostCreation } from "../../components/Post/PostCreation";
import { RecommendedSideBar } from "../../components/SideBar/RecommendedSideBar";
import { ListPost } from "../../components/Post/ListPost";

export const SocialHomePage = () => {
  return (
    <>
      <SocialHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="hidden lg:block lg:col-span-1">
          <SocialSideBar />
          <div className="col-span-1 lg:col-span-1 hidden lg:block mt-5">
            <div className="bg-gray-200 rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Top reviewers</h2>
              <RecommendedSideBar />
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 p-6 bg-gray-50 rounded-lg shadow">
          {/* Main Content Here */}
          <PostCreation />
          <ListPost type={"homepage"}/>
        </div>
      </div>
    </>
  );
};

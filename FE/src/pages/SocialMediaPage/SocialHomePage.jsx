import React, { useState } from "react";
import { SocialHeader } from "../../components/Header/SocialHeader";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { PostCreation } from "../../components/Post/PostCreation";
import { RecommendedSideBar } from "../../components/SideBar/RecommendedSideBar";
import { ListPost } from "../../components/Post/ListPost";

export const SocialHomePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <>
      <SocialHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <SocialSideBar />
          <RecommendedSideBar />
        </div>

        <div className="lg:col-span-3 p-6 bg-[#0f0f0f] rounded-xl shadow-inner border border-[#2a2a2a]">
          <PostCreation onPostCreated={handlePostCreated} />
          <ListPost type={"homepage"} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </>
  );
};

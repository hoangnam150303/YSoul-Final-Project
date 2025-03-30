import React from "react";
import { SocialProfileHeader } from "../../components/Header/SocialProfileHeader";
import { ListPost } from "../../components/Post/ListPost";

export const ProfileSocialPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <SocialProfileHeader />
      <div>
        <ListPost />
      </div>
    </div>
  );
};

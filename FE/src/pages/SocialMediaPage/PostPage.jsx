import React from "react";

import { SocialHeader } from "../../components/Header/SocialHeader";

import { ListPost } from "../../components/Post/ListPost";

const PostPage = () => {
  return (
    <>
      <SocialHeader />
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
        <ListPost type={"singlePost"} />
      </div>
    </>
  );
};

export default PostPage;

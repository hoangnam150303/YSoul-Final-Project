import {
  CommentOutlined,
  LikeOutlined,
  LoadingOutlined,
  MoreOutlined,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import { PostAction } from "./PostAction";
import { formatDistanceToNow } from "date-fns";
export const ListPost = ({ posts }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(posts?.comments || [2]);
  const [newComment, setNewComment] = useState("");
  const [isPending, setIsPending] = useState(false);
  // Menu khi bấm vào nút More
  const menu = (
    <Menu>
      <Menu.Item key="1">🚩 Báo cáo</Menu.Item>
      <Menu.Item key="2">🙈 Ẩn bài viết</Menu.Item>
      <Menu.Item key="3" danger>
        🗑️ Xóa bài viết
      </Menu.Item>
      <Menu.Item key="4">✏️ Sửa bài viết</Menu.Item>
    </Menu>
  );

  // Link phim hoặc nhạc (Có thể lấy từ props nếu cần)
  const mediaLink = {
    type: "movie", // "movie" hoặc "music"
    url: "https://www.imdb.com/title/tt0816692/", // Ví dụ link phim Interstellar
    title: "Interstellar",
  };
  const handleLikePost = async () => {};
  const handleCommentPost = async () => {
    setShowComments(!showComments);
  };
  const handleSharePost = async () => {};
  const handleAddComment = async (e) => {
    e.preventDefault();
    console.log(newComment);
  };
  return (
    <div className="gradient-bg-hero rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile`}>
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQHqFkGID_VAfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704300367200?e=1747267200&v=beta&t=m74QfO9g0462KKxTjXu5EBsy__Vu_9oa62u4eBYyPTs"
                alt="avatar"
                className="size-10 rounded-full mr-3"
              />
            </Link>
            <div className="text-white">
              <Link to={`/profile`}>
                <h3 className="font-semibold ">Hoang Nam</h3>
              </Link>
              <p className="text-xs ">I'm a software Engineer</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date("03/12/2025"), {
                  addSuffix: true,
                }).replace("about ", "")}
              </p>
            </div>
          </div>
          {/* Nút More với dropdown */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <MoreOutlined className="text-white cursor-pointer text-xl" />
          </Dropdown>
        </div>
        <p className="mb-4 text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          repellendus officia, similique ex inventore ullam quos harum nam
          maiores commodi totam sapiente. Sint ex magnam repellendus labore
          necessitatibus quidem aspernatur!
        </p>
        {/* Cố định kích thước ảnh */}
        <div className="w-full h-[300px] overflow-hidden rounded-lg">
          <img
            src="https://www.fahasa.com/blog/wp-content/uploads/2025/03/interstellar-dai-dien.jpg"
            alt="image-post"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Hiển thị link phim hoặc nhạc */}
        {mediaLink && (
          <div className="mt-3">
            <a
              href={mediaLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  hover:text-blue-400 transition duration-200"
            >
              {mediaLink.type === "movie" ? "🎬" : "🎵"}{" "}
              <span className="ml-2 underline text-white">
                {mediaLink.title} Click here to explore
              </span>
            </a>
          </div>
        )}
        <div className="flex justify-between  text-white mt-4">
          <PostAction
            icon={<LikeOutlined size={18} />}
            text={"Like (10)"}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<CommentOutlined size={18} />}
            text={"Comment (10)"}
            onClick={handleCommentPost}
          />

          <PostAction
            icon={<ShareAltOutlined size={18} />}
            text={"Share"}
            onClick={handleLikePost}
          />
        </div>
        {showComments && (
          <div className="px-4 pb-4 text-black mt-5">
            <div className="mb-4 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-2 bg-white p-2 rounded flex items-start"
                >
                  <img
                    src="https://media.licdn.com/dms/image/v2/D5603AQHqFkGID_VAfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704300367200?e=1747267200&v=beta&t=m74QfO9g0462KKxTjXu5EBsy__Vu_9oa62u4eBYyPTs"
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold mr-2">
                        hoang nam dep trai
                      </span>
                      <span className="text-xs text-gray-500 ">
                        {formatDistanceToNow(new Date("03/12/2025"), {
                          addSuffix: true,
                        }).replace("about ", "")}
                      </span>
                    </div>
                    <p>{comment.content || "Hello "}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow p-2 rounded-l-full bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="text-white p-2 rounded-r-full bg-blue-500 h-full
              hover:bg-primary-dark transition duration-300"
                onClick={() => setIsPending(true)}
              >
                {isPending ? <LoadingOutlined /> : <SendOutlined />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

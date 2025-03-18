import {
  CommentOutlined,
  LikeOutlined,
  LoadingOutlined,
  MoreOutlined,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import { PostAction } from "./PostAction";
import { formatDistanceToNow } from "date-fns";
import commentApi from "../../hooks/commentApi";
export const ListPost = ({ data }) => {
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [newReplyComment, setNewReplyComment] = useState("");
  const [showReplyComments, setShowReplyComments] = useState({});

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
  const handleCommentPost = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Chuyển đổi trạng thái của bài viết cụ thể
    }));
  };
  const toggleReplyComments = (commentId) => {
    setShowReplyComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleSharePost = async () => {};
  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Tránh comment rỗng

    try {
      const comment = { content: newComment };
      const response = await commentApi.postCreateComment(comment, postId);

      // Cập nhật state để hiển thị comment mới ngay lập tức

      // Reset input comment
      setNewComment("");
      setIsPending(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddReplyComment = async (e, postId, commentId) => {
    e.preventDefault();
    try {
      const comment = { content: newReplyComment };
      const response = await commentApi.postReplyComment(
        comment,
        postId,
        commentId
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="gradient-bg-hero rounded-lg shadow mb-4">
      {data.map((item, index) =>
        item.post.map((post, index) => (
          <div className="p-4" key={index}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link to={`/profile`}>
                  <img
                    src={item.user?.avatar}
                    alt="avatar"
                    className="size-10 rounded-full mr-3"
                  />
                </Link>
                <div className="text-white">
                  <Link to={`/profile`}>
                    <h3 className="font-semibold ">{item.user?.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post?.createdAt), {
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
            <p className="mb-4 text-white">{post.content}</p>
            {/* Cố định kích thước ảnh */}
            <div className="w-full h-[300px] overflow-hidden rounded-lg">
              <img
                src={post.image}
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
                text={`Like (${post.likes?.length})`}
                onClick={handleLikePost}
              />

              <PostAction
                icon={<CommentOutlined size={18} />}
                text={`Comment (${
                  post.comments?.length +
                  post.comments?.reduce(
                    (total, c) => total + (c.commentReplied?.length || 0),
                    0
                  )
                })`}
                onClick={() => handleCommentPost(post._id)} // Truyền ID bài viết vào
              />

              <PostAction
                icon={<ShareAltOutlined size={18} />}
                text={"Share"}
                onClick={handleLikePost}
              />
            </div>
            {showComments[post._id] && (
              <div className="px-4 pb-4 text-black mt-5">
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="mb-2 bg-white p-2 rounded flex items-start"
                    >
                      <img
                        src={comment.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold mr-2">
                            {comment.username}
                          </span>
                          {comment && (
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(
                                new Date(comment?.createdAt),
                                {
                                  addSuffix: true,
                                }
                              ).replace("about ", "")}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p>{comment.content}</p>
                          {/* Nút show reply comments */}
                          <div
                            className="text-sm text-gray-500 cursor-pointer ml-auto mt-1 hover:underline"
                            onClick={() => toggleReplyComments(comment._id)}
                          >
                            {showReplyComments[comment._id]
                              ? "Hide replies"
                              : "Show reply comments"}
                          </div>
                          {/* Hiển thị danh sách reply comments */}
                          {showReplyComments[comment._id] &&
                            comment.commentReplied && (
                              <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-3">
                                {comment.commentReplied.map((reply) => (
                                  <div
                                    key={reply._id}
                                    className="bg-gray-100 p-2 rounded mb-1"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={reply.avatar}
                                        alt="avatar"
                                        className="w-6 h-6 rounded-full mr-2"
                                      />
                                      <span className="font-semibold text-sm">
                                        {reply.username}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">
                                      {reply.content}
                                    </p>
                                  </div>
                                ))}
                                <form
                                  className="flex items-center"
                                  onSubmit={(e) =>
                                    handleAddReplyComment(
                                      e,
                                      post._id,
                                      comment._id
                                    )
                                  }
                                >
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newReplyComment}
                                    onChange={(e) =>
                                      setNewReplyComment(e.target.value)
                                    }
                                    className="flex-grow p-2 rounded-l-full bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                  <button
                                    type="submit"
                                    className="text-white p-2 rounded-r-full bg-blue-500 h-full hover:bg-primary-dark transition duration-300"
                                    onClick={() => setIsPending(true)}
                                  >
                                    {isPending ? (
                                      <LoadingOutlined />
                                    ) : (
                                      <SendOutlined />
                                    )}
                                  </button>
                                </form>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => handleAddComment(e, post._id)}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow p-2 rounded-l-full bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="text-white p-2 rounded-r-full bg-blue-500 h-full hover:bg-primary-dark transition duration-300"
                    onClick={() => setIsPending(true)}
                  >
                    {isPending ? <LoadingOutlined /> : <SendOutlined />}
                  </button>
                </form>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

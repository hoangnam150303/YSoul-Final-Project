import {
  CommentOutlined,
  LikeOutlined,
  LoadingOutlined,
  MoreOutlined,
  SendOutlined,
  ShareAltOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Menu,
  Dropdown,
  Button,
  message,
  Modal,
  Input,
  Select,
  Upload,
  Pagination,
} from "antd";
import { PostAction } from "./PostAction";
import { formatDistanceToNow } from "date-fns";
import commentApi from "../../hooks/commentApi";
import { useSelector } from "react-redux";
import postApi from "../../hooks/postApi";
import filmApi from "../../hooks/filmApi";
import singleApi from "../../hooks/singleApi";

export const ListPost = ({ type }) => {
  const { id } = useParams();
  const [showComments, setShowComments] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newReplyComment, setNewReplyComment] = useState("");
  const [showReplyComments, setShowReplyComments] = useState({});
  const [isPending, setIsPending] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [postSelected, setPostSelected] = useState(null);
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [films, setFilms] = useState([]);
  const [musics, setMusics] = useState([]);
  const [content, setContent] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentEdit, setCommentEdit] = useState(null);
  const [editingReplyCommentId, setEditingReplyCommentId] = useState(null);
  const [replyCommentEdit, setReplyCommentEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);

  // --- MENU HANDLERS ---
  const getMenu = (user_id, post_id) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleReport(post_id)}>
        🚩 Report
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleHide(post_id)}>
        🙈 Hide Post
      </Menu.Item>
      {user_id === userId.toString() ? (
        <>
          <Menu.Item key="3" danger onClick={() => handleDelete(post_id)}>
            🗑️ Delete
          </Menu.Item>
          <Menu.Item key="4" onClick={() => handleEditPost(post_id)}>
            ✏️ Edit
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  const getCommentMenu = (user_id, commentId, post_id, content) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleReport(post_id, commentId)}>
        🚩 Report
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleHide(post_id, commentId)}>
        🙈 Hide
      </Menu.Item>
      {user_id === userId.toString() ? (
        <>
          <Menu.Item
            key="3"
            danger
            onClick={() => handleDeleteComment(post_id, commentId)}
          >
            🗑️ Delete
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={() => handleEditComment(commentId, content)}
          >
            ✏️ Edit
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  const getCommentReplyMenu = (
    user_id,
    commentId,
    post_id,
    replyId,
    content
  ) => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => handleReport(post_id, commentId, replyId)}
      >
        🚩 Report
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => handleHide(post_id, commentId, replyId)}
      >
        🙈 Hide
      </Menu.Item>
      {user_id === userId.toString() ? (
        <>
          <Menu.Item
            key="3"
            danger
            onClick={() =>
              handleDeleteReplyComment(post_id, commentId, replyId)
            }
          >
            🗑️ Delete
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={() => handleEditReplyComment(replyId, content)}
          >
            ✏️ Edit
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  // --- API FETCHING ---
  const fetchPosts = async () => {
    try {
      if (type === "homepage") {
        const response = await postApi.getAllPost(
          search,
          currentPage,
          pageSize
        );
        setData(response.data.data);
        setTotalPosts(response.data.total);
      } else if (type === "profile") {
        const response = await postApi.getPostByUser(id);
        const result = response.data.data;
        setData([{ post: result.post, user: result.user[0] }]);
      } else if (type === "singlePost") {
        const response = await postApi.getPostById(id);
        const result = response.data.result;
        setData([{ post: [result.post], user: result.author[0] }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, currentPage]);

  useEffect(() => {
    if (postSelected) {
      setPostType(postSelected.film_id != undefined ? "Film" : "Music");
      setContent(postSelected.content);
      setImage(postSelected.image);
    }
  }, [postSelected]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (postType === "Film") {
          const response = await filmApi.getAllFilm({ typeUser: "user" });
          if (isMounted) {
            setFilms(response.data.data.data);
            if (response.data.data.data.length > 0) {
              setSelectedOption(
                response.data.data.data.find(
                  (film) => film._id === postSelected.film_id
                )
              );
            }
          }
        } else {
          const response = await singleApi.getAllSingle({
            filter: "",
            search: "",
            typeUser: "user",
          });
          if (isMounted) {
            setMusics(response.data.singles);
            if (response.data.singles.length > 0) {
              setSelectedOption(
                response.data.singles.find(
                  (music) => music.id === parseInt(postSelected?.single_id)
                )
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [postType, postSelected]);

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setImage(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPostType(null);
    setPostSelected(null);
  };

  const handleSubmit = async () => {
    let formData = new FormData();
    if (postType === "Film") {
      formData.append("film_id", selectedOption._id);
    } else {
      formData.append("single_id", selectedOption.id || selectedOption);
    }
    formData.append("content", content);
    formData.append("image", image);
    try {
      const response = await postApi.updatePost(postSelected._id, formData);
      if (response.status === 200) {
        message.success("Post updated successfully!");
        setModalOpen(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // --- ACTIONS ---
  const handleReport = (postId) => console.log("Report:", postId);
  const handleHide = (postId) => console.log("Hide:", postId);
  const handleDelete = async (postId) => {
    try {
      const response = await postApi.activeOrDeactivePost(postId);
      if (response.status === 200) {
        message.success("Delete Success!");
        fetchPosts();
      }
    } catch (error) {
      message.error("Delete Failed!");
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const response = await postApi.getPostById(postId);
      if (response.status === 200) {
        setPostSelected(response.data.result.post);
      }
      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // --- COMMENT ACTIONS ---
  const handleDeleteComment = async (post_id, commentId) => {
    try {
      const response = await commentApi.deleteComment(post_id, commentId);
      if (response.status === 200) {
        message.success("Delete Success!");
        fetchPosts();
      }
    } catch (error) {
      message.error("Delete Failed!");
    }
  };
  const handleEditComment = async (id, content) => {
    setIsEdit(true);
    setEditingCommentId(id);
    setCommentEdit(content);
  };
  const handleSubmitEditComment = async (postId) => {
    try {
      const response = await commentApi.updateComment(
        editingCommentId,
        postId,
        commentEdit
      );
      if (response.status === 200) {
        message.success("Update Success!");
        fetchPosts();
        setIsEdit(false);
        setEditingCommentId(null);
        setCommentEdit("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReplyComment = async (post_id, commentId, replyId) => {
    try {
      const response = await commentApi.deleteReplyComment(
        post_id,
        commentId,
        replyId
      );
      if (response.status === 200) {
        message.success("Delete Success!");
        fetchPosts();
      }
    } catch (error) {
      message.error("Delete Failed!");
    }
  };
  const handleEditReplyComment = async (id, content) => {
    setIsEdit(true);
    setEditingReplyCommentId(id);
    setReplyCommentEdit(content);
  };
  const handleSubmitEditReplyComment = async (postId, commentId) => {
    try {
      const response = await commentApi.updateCommentReply(
        commentId,
        postId,
        editingReplyCommentId,
        replyCommentEdit
      );
      if (response.status === 200) {
        message.success("Update Success!");
        fetchPosts();
        setIsEdit(false);
        setEditingReplyCommentId(null);
        setReplyCommentEdit("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async (id) => {
    try {
      await postApi.likePost(id);
      fetchPosts();
    } catch (error) {
      message.error(error);
    }
  };
  const handleCommentPost = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };
  const toggleReplyComments = (commentId) => {
    setShowReplyComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // 🔥 Define handleSharePost here
  const handleSharePost = async () => {
    console.log("Share post clicked");
    // Add share logic here if needed
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = { content: newComment };
      const response = await commentApi.postCreateComment(comment, postId);
      if (response.status === 200) {
        message.success("Comment added!");
        setNewComment("");
        setIsPending(false);
        fetchPosts();
      }
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
      if (response.status === 200) {
        message.success("Reply added!");
        setNewReplyComment("");
        setIsPending(false);
        fetchPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {type === "homepage" && (
        <div className="p-4 relative z-10">
          <Input.Search
            placeholder="Search poster name ..."
            allowClear
            enterButton="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => setCurrentPage(1)}
            className="custom-search-dark" // Có thể cần thêm CSS global hoặc style inline để override AntD
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Thay đổi container: Bỏ gradient-bg-hero, dùng space-y để tách các post */}
      <div className="space-y-6">
        {data.map((item, index) =>
          item.post.map((post, postIndex) => (
            // ✨ DARK POST CARD
            <div
              className="bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden"
              key={`${index}-${postIndex}`}
            >
              <div className="p-4">
                {/* Header Post */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${item.user?.id}`}>
                      {/* Avatar User */}
                      <div className="p-[2px] rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 hover:from-red-500 hover:to-purple-600 transition-all duration-300">
                        <img
                          src={item.user?.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#1f1f1f]"
                        />
                      </div>
                    </Link>
                    <div>
                      <Link to={`/profile`}>
                        <h3 className="font-bold text-white text-sm hover:underline cursor-pointer">
                          {item.user?.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 m-0">
                        {formatDistanceToNow(new Date(post?.createdAt), {
                          addSuffix: true,
                        }).replace("about ", "")}
                      </p>
                    </div>
                  </div>

                  {/* More Menu */}
                  <Dropdown
                    overlay={getMenu(post.user_id, post._id)}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <MoreOutlined className="text-gray-400 hover:text-white cursor-pointer text-xl transition-colors" />
                  </Dropdown>
                </div>

                {/* Content */}
                <p className="mb-4 text-gray-200 text-sm leading-relaxed">
                  {post.content}
                </p>

                {/* Image */}
                {post.image && (
                  <div className="w-full h-[350px] overflow-hidden rounded-lg border border-[#333] mb-4">
                    <img
                      src={post.image}
                      alt="post-img"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Media Link (Film/Music) */}
                {post.film_id ? (
                  <div className="mb-4 p-3 bg-[#141414] rounded-lg border border-[#333] flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <div>
                      <p className="text-xs text-gray-500 mb-0">Watching</p>
                      <Link
                        to={`/watchPage/${post.film_id}`}
                        className="text-red-500 hover:text-red-400 font-medium text-sm hover:underline"
                      >
                        Click here to explore movie
                      </Link>
                    </div>
                  </div>
                ) : post.single_id ? (
                  <div className="mb-4 p-3 bg-[#141414] rounded-lg border border-[#333] flex items-center gap-3">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <p className="text-xs text-gray-500 mb-0">Listening to</p>
                      <a
                        href={`http://localhost:5173/singlePage/${post.single_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm hover:underline"
                      >
                        Click here to explore music
                      </a>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-[#333] pt-3 mt-2 text-white">
                  <PostAction
                    icon={<LikeOutlined />}
                    text={`${post.likes?.length || 0} Likes`}
                    onClick={() => handleLikePost(post._id)}
                    className="text-gray-400 hover:text-red-500"
                  />
                  <PostAction
                    icon={<CommentOutlined />}
                    text={`${
                      (post.comments?.length || 0) +
                      (post.comments?.reduce(
                        (total, c) => total + (c.commentReplied?.length || 0),
                        0
                      ) || 0)
                    } Comments`}
                    onClick={() => handleCommentPost(post._id)}
                    className="text-gray-400 hover:text-blue-500"
                  />
                  <PostAction
                    icon={<ShareAltOutlined />}
                    text="Share"
                    onClick={handleSharePost}
                    className="text-gray-400 hover:text-green-500"
                  />
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="bg-[#141414] border-t border-[#2a2a2a] p-4">
                  <div className="mb-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#333]">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="mb-3 group/comment">
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover border border-[#333]"
                          />
                          <div className="flex-grow">
                            {/* Comment Bubble */}
                            <div className="bg-[#252525] p-3 rounded-2xl rounded-tl-none inline-block min-w-[200px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white text-xs">
                                  {comment.username}
                                </span>
                                <span className="text-[10px] text-gray-500 ml-2">
                                  {formatDistanceToNow(
                                    new Date(comment?.createdAt),
                                    { addSuffix: true }
                                  ).replace("about ", "")}
                                </span>
                              </div>

                              {isEdit && editingCommentId === comment._id ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <input
                                    type="text"
                                    value={commentEdit}
                                    onChange={(e) =>
                                      setCommentEdit(e.target.value)
                                    }
                                    className="flex-1 bg-[#333] text-white border border-[#444] p-1.5 rounded text-sm focus:outline-none focus:border-blue-500"
                                  />
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() =>
                                      handleSubmitEditComment(post._id)
                                    }
                                  >
                                    Save
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-gray-300 text-sm m-0">
                                  {comment.content}
                                </p>
                              )}
                            </div>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 mt-1 ml-2">
                              <span
                                className="text-xs text-gray-500 cursor-pointer hover:text-white"
                                onClick={() => toggleReplyComments(comment._id)}
                              >
                                {showReplyComments[comment._id]
                                  ? "Hide Replies"
                                  : "Reply"}
                              </span>
                              <Dropdown
                                overlay={getCommentMenu(
                                  comment.user_id,
                                  comment._id,
                                  post._id,
                                  comment.content
                                )}
                                trigger={["click"]}
                                placement="bottomLeft"
                              >
                                <MoreOutlined className="text-gray-600 hover:text-white cursor-pointer text-xs opacity-0 group-hover/comment:opacity-100 transition-opacity" />
                              </Dropdown>
                            </div>

                            {/* Replies */}
                            {showReplyComments[comment._id] && (
                              <div className="mt-3 pl-3 border-l-2 border-[#333] space-y-3">
                                {comment.commentReplied &&
                                  comment.commentReplied.map((reply) => (
                                    <div
                                      key={reply._id}
                                      className="flex items-start gap-2 group/reply"
                                    >
                                      <img
                                        src={reply.avatar}
                                        alt="avatar"
                                        className="w-6 h-6 rounded-full object-cover border border-[#333]"
                                      />
                                      <div className="flex-grow">
                                        <div className="bg-[#1f1f1f] p-2 rounded-xl rounded-tl-none border border-[#333]">
                                          <div className="flex justify-between items-center">
                                            <span className="font-bold text-white text-xs">
                                              {reply.username}
                                            </span>
                                            <Dropdown
                                              overlay={getCommentReplyMenu(
                                                reply.user_id,
                                                comment._id,
                                                post._id,
                                                reply._id,
                                                reply.content
                                              )}
                                              trigger={["click"]}
                                            >
                                              <MoreOutlined className="text-gray-600 hover:text-white cursor-pointer text-[10px]" />
                                            </Dropdown>
                                          </div>

                                          {isEdit &&
                                          editingReplyCommentId ===
                                            reply._id ? (
                                            <div className="flex gap-2 mt-1">
                                              <input
                                                className="bg-[#333] text-white text-xs p-1 rounded w-full border-none"
                                                value={replyCommentEdit}
                                                onChange={(e) =>
                                                  setReplyCommentEdit(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <Button
                                                size="small"
                                                type="primary"
                                                onClick={() =>
                                                  handleSubmitEditReplyComment(
                                                    post._id,
                                                    comment._id
                                                  )
                                                }
                                              >
                                                Save
                                              </Button>
                                            </div>
                                          ) : (
                                            <p className="text-gray-300 text-xs m-0 mt-1">
                                              {reply.content}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                {/* Reply Input */}
                                <form
                                  className="flex items-center gap-2 mt-2"
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
                                    placeholder="Write a reply..."
                                    value={newReplyComment}
                                    onChange={(e) =>
                                      setNewReplyComment(e.target.value)
                                    }
                                    className="flex-1 bg-[#222] text-white text-xs p-2 rounded-full border border-[#333] focus:outline-none focus:border-gray-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    {isPending ? (
                                      <LoadingOutlined className="text-xs" />
                                    ) : (
                                      <SendOutlined className="text-xs" />
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

                  {/* Add Comment Input */}
                  <form
                    onSubmit={(e) => handleAddComment(e, post._id)}
                    className="flex items-center gap-3"
                  >
                    <img
                      src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png" // Hoặc avatar user hiện tại
                      className="w-8 h-8 rounded-full border border-[#333]"
                      alt="my-avt"
                    />
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-[#222] text-white p-2.5 pl-4 pr-10 rounded-full border border-[#333] focus:outline-none focus:border-gray-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        onClick={() => setIsPending(true)}
                      >
                        {isPending ? <LoadingOutlined /> : <SendOutlined />}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}

        {/* --- EDIT MODAL --- */}
        {postSelected && (
          <Modal
            title={<span className="text-black">Edit Post</span>} // AntD Modal mặc định nền trắng nên để title đen hoặc custom CSS
            visible={modalOpen}
            onCancel={handleCancel}
            onOk={handleSubmit}
            centered
          >
            <div className="flex flex-col gap-4">
              <Input.TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Edit content..."
                rows={4}
              />

              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Change Image</Button>
              </Upload>

              {image && (
                <div className="rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={filePreview || image}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {postType && (
                <Select
                  value={postType}
                  onChange={setPostType}
                  className="w-full"
                >
                  <Select.Option value="Film">Film</Select.Option>
                  <Select.Option value="Music">Music</Select.Option>
                </Select>
              )}

              {postType === "Film" && (
                <Select
                  value={selectedOption?.name || selectedOption?._id}
                  onChange={(val) => {
                    const film = films.find((f) => f._id === val);
                    setSelectedOption(film);
                  }}
                  placeholder="Select a film"
                  className="w-full"
                >
                  {films.map((film) => (
                    <Select.Option key={film._id} value={film._id}>
                      {film.name}
                    </Select.Option>
                  ))}
                </Select>
              )}

              {postType === "Music" && (
                <Select
                  value={selectedOption?.title || selectedOption?.id}
                  onChange={(val) => {
                    const music = musics.find((m) => m.id === val);
                    setSelectedOption(music);
                  }}
                  placeholder="Select a single"
                  className="w-full"
                >
                  {musics.map((music) => (
                    <Select.Option key={music.id} value={music.id}>
                      {music.title}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </div>
          </Modal>
        )}
      </div>

      {type === "homepage" && (
        <div className="text-center mt-8 pb-10">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalPosts}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="dark-pagination" // Cần CSS custom cho pagination tối màu nếu muốn
          />
        </div>
      )}
    </>
  );
};

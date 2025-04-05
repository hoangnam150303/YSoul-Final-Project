import {
  CommentOutlined,
  LikeOutlined,
  LoadingOutlined,
  MoreOutlined,
  SendOutlined,
  ShareAltOutlined,
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
} from "antd";
import { PostAction } from "./PostAction";
import { formatDistanceToNow, set } from "date-fns";
import commentApi from "../../hooks/commentApi";
import { useSelector } from "react-redux";
import postApi from "../../hooks/postApi";
import { UploadOutlined } from "@ant-design/icons";
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
  // Menu khi bấm vào nút More
  const getMenu = (user_id, post_id) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleReport(post_id)}>
        🚩 Báo cáo
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleHide(post_id)}>
        🙈 Ẩn bài viết
      </Menu.Item>
      {user_id === userId.toString() ? (
        <>
          <Menu.Item key="3" danger onClick={() => handleDelete(post_id)}>
            🗑️ Xóa bài viết
          </Menu.Item>
          <Menu.Item key="4" onClick={() => handleEditPost(post_id)}>
            ✏️ Sửa bài viết
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  // Menu for comment
  const getCommentMenu = (user_id, commentId, post_id, content) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleReport(post_id, commentId)}>
        🚩 Báo cáo
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleHide(post_id, commentId)}>
        🙈 Ẩn Comment
      </Menu.Item>
      {user_id === userId.toString() ? (
        <>
          <Menu.Item
            key="3"
            danger
            onClick={() => handleDeleteComment(post_id, commentId)}
          >
            🗑️ Xóa Comment
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={() => handleEditComment(commentId, content)}
          >
            ✏️ Sửa Comment
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  // Menu for reply comment
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
        🚩 Báo cáo
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => handleHide(post_id, commentId, replyId)}
      >
        🙈 Ẩn Comment
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
            🗑️ Xóa Comment
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={() => handleEditReplyComment(replyId, content)}
          >
            ✏️ Sửa Comment
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );
  const fetchPosts = async () => {
    try {
      if (type === "homepage") {
        const response = await postApi.getAllPost(search);
        setData(response.data.data);
      } else if (type === "profile") {
        const response = await postApi.getPostByUser(id);
        const result = response.data.data;
        setData([
          {
            post: result.post,
            user: result.user[0],
          },
        ]);
      } else if (type === "singlePost") {
        const response = await postApi.getPostById(id); // gọi API để lấy bài viết theo ID
        const result = response.data.result;
        setData([
          {
            post: [result.post], // ✅ biến object thành array
            user: result.author[0],
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  useEffect(() => {
    if (postSelected) {
      setPostType(postSelected.film_id != undefined ? "Film" : "Music");
      setContent(postSelected.content);
      setImage(postSelected.image);
    }
  }, [postSelected]); // Chỉ chạy khi postSelected thay đổi

  useEffect(() => {
    let isMounted = true; // Giúp tránh setState sau khi component đã unmount

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
      isMounted = false; // Cleanup function tránh memory leak
    };
  }, [postType, postSelected]); // useEffect này chỉ chạy khi postType hoặc postSelected thay đổi
  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;

    if (file) {
      setImage(file); // Lưu file thay vì URL blob
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
      console.log(selectedOption);
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
  // Function for post
  const handleReport = (postId) => {
    console.log("Báo cáo bài viết:", postId);
  };

  const handleHide = (postId) => {
    console.log("Ẩn bài viết:", postId);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await postApi.activeOrDeactivePost(postId);
      if (response.status === 200) {
        message.success("Delete Success!");
        fetchPosts();
      }
    } catch (error) {
      message.error("Delete Failed!");
      console.log(error);
    }
  };
  const handleEditPost = async (postId) => {
    try {
      try {
        const response = await postApi.getPostById(postId);
        if (response.status === 200) {
          setPostSelected(response.data.result.post);
        }
      } catch (error) {
        console.log(error);
      }

      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // function for comment
  const handleDeleteComment = async (post_id, commentId) => {
    try {
      const response = await commentApi.deleteComment(post_id, commentId);
      if (response.status === 200) {
        message.success("Delete Success!");
        fetchPosts();
      }
    } catch (error) {
      message.error("Delete Failed!");
      console.log(error);
    }
  };
  const handleEditComment = async (id, content) => {
    try {
      setIsEdit(true);
      setEditingCommentId(id);
      setCommentEdit(content);
    } catch (error) {
      console.log(error);
    }
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
  // Function for reply comment
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
      console.log(error);
    }
  };
  const handleEditReplyComment = async (id, content) => {
    try {
      setIsEdit(true);
      setEditingReplyCommentId(id);
      setReplyCommentEdit(content);
    } catch (error) {
      console.log(error);
    }
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

  // Link phim hoặc nhạc (Có thể lấy từ props nếu cần)

  const handleLikePost = async (id) => {
    try {
      await postApi.likePost(id);

      fetchPosts();
    } catch (error) {
      message.error(error);
    }
  };
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
      if (response.status === 200) {
        message.success("Comment added successfully!");
        setNewComment("");
        setIsPending(false);
        fetchPosts();
      }
      // Cập nhật state để hiển thị comment mới ngay lập tức

      // Reset input comment
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
        message.success("Comment added successfully!");
        setNewReplyComment("");
        setIsPending(false);
        fetchPosts();
      }
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
                <Link to={`/profile/${item.user?.id}`}>
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
              <Dropdown
                overlay={getMenu(post.user_id, post._id)}
                trigger={["click"]}
              >
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
            {post.film_id ? (
              <div className="mt-3">
                <a
                  href={`http://localhost:5173/watchPage/${post.film_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center  hover:text-blue-400 transition duration-200"
                >
                  🎬
                  <span className="ml-2 underline text-white">
                    Click here to explore
                  </span>
                </a>
              </div>
            ) : (
              <div className="mt-3">
                <a
                  // href={mediaLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center  hover:text-blue-400 transition duration-200"
                >
                  {/* {mediaLink.type === "movie" ? "🎬" : "🎵"}{" "} */}
                  {/* <span className="ml-2 underline text-white">
                    {mediaLink.title} Click here to explore
                  </span> */}
                </a>
              </div>
            )}
            <div className="flex justify-between  text-white mt-4">
              <PostAction
                icon={<LikeOutlined size={18} />}
                text={`Like (${post.likes?.length})`}
                onClick={() => handleLikePost(post._id)}
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
                          <Dropdown
                            overlay={getCommentMenu(
                              comment.user_id,
                              comment._id,
                              post._id,
                              comment.content
                            )}
                            trigger={["click"]}
                            className="justify-end"
                          >
                            <MoreOutlined className="text-gray-500 cursor-pointer ml-2" />
                          </Dropdown>
                        </div>

                        <div className="flex flex-col">
                          {isEdit &&
                          isEdit &&
                          editingCommentId === comment._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={commentEdit}
                                onChange={(e) => setCommentEdit(e.target.value)}
                                className="flex-1 border p-2 rounded"
                              />
                              <Button
                                onClick={() =>
                                  handleSubmitEditComment(post._id)
                                }
                                className="size-10"
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <p>{comment.content}</p>
                          )}
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
                                      <span className="font-semibold text-sm mr-2">
                                        {reply.username}
                                      </span>
                                      {reply && (
                                        <span className="text-xs text-gray-500">
                                          {formatDistanceToNow(
                                            new Date(reply?.createdAt),
                                            {
                                              addSuffix: true,
                                            }
                                          ).replace("about ", "")}
                                        </span>
                                      )}
                                      <Dropdown
                                        overlay={getCommentReplyMenu(
                                          reply.user_id,
                                          comment._id,
                                          post._id,
                                          reply._id,
                                          reply.content
                                        )}
                                        trigger={["click"]}
                                        className="justify-end"
                                      >
                                        <MoreOutlined className="text-gray-500 cursor-pointer ml-2" />
                                      </Dropdown>
                                    </div>
                                    {isEdit &&
                                    isEdit &&
                                    editingReplyCommentId === reply._id ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={replyCommentEdit}
                                          onChange={(e) =>
                                            setReplyCommentEdit(e.target.value)
                                          }
                                          className="flex-1 border p-2 rounded"
                                        />
                                        <Button
                                          onClick={() =>
                                            handleSubmitEditReplyComment(
                                              post._id,
                                              comment._id
                                            )
                                          }
                                          className="size-10"
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    ) : (
                                      <p className="text-sm mt-1">
                                        {reply.content}
                                      </p>
                                    )}
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
      {postSelected && (
        <Modal
          title="Edit Post"
          visible={modalOpen}
          onCancel={handleCancel}
          onOk={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <Input.TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit content..."
            />

            <Upload beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>

            {image && (
              <img
                src={filePreview || image}
                alt="Preview"
                className="w-full h-40 object-cover mt-2"
              />
            )}

            {postType && (
              <Select value={postType} onChange={setPostType}>
                <Select.Option value="Film">Film</Select.Option>
                <Select.Option value="Music">Music</Select.Option>
              </Select>
            )}

            {postType === "Film" && (
              <Select
                value={selectedOption?.name}
                onChange={setSelectedOption}
                placeholder="Select a film"
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
                value={selectedOption?.title}
                onChange={setSelectedOption}
                placeholder="Select a single"
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
  );
};

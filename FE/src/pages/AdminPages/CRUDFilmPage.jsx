import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Popconfirm,
  Table,
  theme,
  Button,
  Modal,
  Input,
  Select,
  Upload,
  message,
  Radio,
  Flex,
} from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
import filmApi from "../../hooks/filmApi";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
export const CRUDFilmPage = () => {
  const [films, setFilms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [film, setFilm] = useState({});
  const [filmType, setFilmType] = useState("Movie"); // State để lưu loại film
  const [additionalFields, setAdditionalFields] = useState([]);
  const [isSeries, setIsSeries] = useState(false);
  const [video, setVideo] = useState([""]);
  const [title, setTitle] = useState([""]);
  const [kind, setKind] = useState("All");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { TextArea } = Input;
  const handleTitleChange = (value, index) => {
    const updatedTitles = [...title];
    updatedTitles[index] = value; // Gán giá trị mới cho tiêu đề
    setTitle(updatedTitles); // Cập nhật state
  };

  const handleVideoChange = (value, index) => {
    const updatedVideos = [...video];
    updatedVideos[index] = value; // Gán giá trị mới cho video

    setVideo(updatedVideos); // Cập nhật state
  };

  const handleTypeChange = (value) => {
    setFilmType(value); // Cập nhật loại film khi người dùng chọn
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Hàm xử lý nút "Create"
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleAddMore = () => {
    setAdditionalFields([
      ...additionalFields,
      { numberTitle: [], movieFiles: [] }, // Thêm trường mới
    ]);
  };

  const handleEdit = (id) => {
    const selectedFilm = films.find((film) => film._id === id);

    if (selectedFilm) {
      if (!selectedFilm.movie) {
        setFilmType("TV Shows");
      } else {
        setFilmType("Movie");
      }
      setFilm(selectedFilm);
      setIsModalEditVisible(true);
    } else {
      message.error("Film not found");
    }
  };

  const handleCancelEdit = () => {
    setIsModalEditVisible(false);
    setFilm({});
  };

  const fetchFilms = async () => {


    try {
      const respone = await filmApi.getAllFilm({
        typeFilm: kind,
        sort: filter,
        search: searchTerm,
        typeUser: "admin",
      });
      setFilms(respone.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await filmApi.postDeleteFilm(id);
      fetchFilms();
    } catch (error) {}
  };
  useEffect(() => {
    if (filmType === "Movie") {
      setIsSeries(false);
    } else if (filmType === "TV Shows") {
      setIsSeries(true);
    }
    fetchFilms();
  }, [filmType, kind, searchTerm, filter]);

  const alignCenter = {
    align: "center",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    cast: Yup.array()
      .min(1, "At least 1 cast is required")
      .required("Cast is required"),
    releaseYear: Yup.string().required("Release Year is required"),
    rangeUser: Yup.array()
      .min(1, "At least one type of user is required")
      .required("Language is required"),
    genre: Yup.array()
      .min(1, "At least one category is required")
      .required("Category is required"),
    small_image: Yup.string().required("Image is required"),
    large_image: Yup.string().required("Image is required"),
    trailer: Yup.string().required("Trailer URL is required"),
    director: Yup.string().required("Director is required"),
    movie: Yup.array()
      .min(1, "At least one movie is required")
      .required("Movie URL is required"),
    age: Yup.string().required("Age is required"),
  });

  const data = films.map((film) => ({
    key: film._id,
    small_image: film.small_image,
    name: film.name,
    releaseYear: film.releaseYear,
    kind: film.video.length > 1 ? "TV Shows" : "Movie",
    genre: film.genre.replace(/[\[\]]/g, "").split(","),
    isDeleted: film.isDeleted ? "Yes" : "No",
    rating: film.totalRating || "N/A",
    views: film.countClick || "N/A",
    rangeUser: film.isForAllUsers ? "All Users" : "VIP Users",
  }));

  const columns = [
    {
      title: "Image",
      width: 150,
      dataIndex: "small_image",
      key: "small_image",
      ...alignCenter,
      render: (text) => (
        <div>
          <img src={text} alt="..." className="w-full h-auto" />
        </div>
      ),
    },
    {
      title: "Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      ...alignCenter,
    },
    {
      title: "Release Year",
      width: 150,
      dataIndex: "releaseYear",
      key: "releaseYear",
      ...alignCenter,
    },
    {
      title: "Kind",
      width: 150,
      dataIndex: "kind",
      key: "kind",
      ...alignCenter,
    },
    {
      title: "Genre",
      width: 150,
      dataIndex: "genre",
      key: "genre",
      ...alignCenter,
    },
    {
      title: "Rating",
      width: 150,
      dataIndex: "rating",
      key: "rating",
      ...alignCenter,
    },
    {
      title: "Views",
      width: 150,
      dataIndex: "views",
      key: "views",
      ...alignCenter,
    },
    {
      title: "Is Deleted",
      width: 175,
      dataIndex: "isDeleted",
      key: "isDeleted",
      ...alignCenter,
    },
    {
      title: "Range User",
      width: 175,
      dataIndex: "rangeUser",
      key: "rangeUser",
      ...alignCenter,
    },
    {
      title: "Action",
      key: "operation",
      width: 100,
      ...alignCenter,
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <button
            className="text-base bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-blue-600"
            onClick={() => handleEdit(record.key)}
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete the Product"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.key)}
            cancelText="No"
          >
            <button className="text-base bg-red-600 text-white px-3 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-red-600 ml-3">
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <AdminSideBar />
        <div
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "85vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: "16px" }}
            onClick={showModal}
          >
            Create Film
          </Button>

          {/* Container Flex cho 2 Select và Input */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <Select
              className="pl-2"
              mode="only"
              placeholder="Select type film"
              style={{ width: "16%" }}
              onChange={(value) => setKind(value)}
            >
              <Option value="all">All</Option>
              <Option value="Movie">Movie</Option>
              <Option value="TV Shows">TV Shows</Option>
            </Select>

            <Select
              className="pl-2"
              mode="only"
              placeholder="Filter"
              style={{ width: "16%" }}
              onChange={(value) => setFilter(value)}
            >
              <Option value="all">All</Option>
              <Option value="Newest">Newest</Option>
              <Option value="Popular">Popular</Option>
              <Option value="Top Rated">Top Rated</Option>
              <Option value="IsDeleted">Deleted</Option>
              <Option value="Active">Active</Option>
            </Select>

            <Input
              placeholder="Search..."
              variant="borderless"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                color: "black",
                flex: 1,
              }}
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Layout>

      {/* Modal Create Film */}
      <Modal
        open={isModalVisible}
        className="text-center "
        title={
          <h2 className="text-2xl font-bold text-[#f18966]  animate-slideIn">
            Create New Film
          </h2>
        }
        onCancel={handleCancel}
        footer={null}
      >
        <Formik
          initialValues={{
            name: "",
            description: "",
            cast: [],
            releaseYear: "",
            isForAllUser: false,
            genre: [],
            small_image: "",
            large_image: "",
            trailer: "",
            movie: [],
            isSeries: false,
            // Nếu filmType là TV Shows, sử dụng mảng videos chứa file video và title
            videos: [],
            director: "",
            age: "",
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // Prepare FormData
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              formData.append("cast", JSON.stringify(values.cast));
              formData.append("isForAll", values.isForAllUser);
              formData.append("releaseYear", values.releaseYear);
              formData.append("trailer", values.trailer);
              formData.append("director", values.director);
              formData.append("genre", JSON.stringify(values.genre));
              formData.append("small_image", values.small_image);
              formData.append("large_image", values.large_image);
              formData.append("age", values.age);
              if (filmType === "TV Shows") {
                // Lấy mảng title từ values.videos, chỉ lấy những title không rỗng
                const titles = values.videos
                  .map((v) => v.title)
                  .filter((t) => t.trim() !== "");
                if (titles.length > 0) {
                  // Append title nếu có giá trị
                  formData.append("title", JSON.stringify(titles));
                }
                // Append từng video file
                values.videos.forEach((videoObj) => {
                  if (videoObj.file) {
                    formData.append("movie", videoObj.file);
                  }
                });
              } else {
                // Với Movie thì gửi file từ values.movie
                values.movie.forEach((file) => formData.append("movie", file));
              }

              const response = await filmApi.postCreateFilm(formData);
              if (response.status === 200) {
                message.success("Film created successfully!");
                handleCancel();
                resetForm();
                fetchFilms();
              }
            } catch (error) {
              console.error("Error adding film:", error);
              message.error("An error occurred while adding the film.");
            } finally {
              setSubmitting(false); // Stop form submission spinner/loading
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="mt-5">
              <div className="grid grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Name:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="name" as={Input} className="w-full py-2" />
                    <div className="h-8 py-1">
                      {touched.name && errors.name && (
                        <div className="error text-red-500 ml-1">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Description:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field
                      name="description"
                      as={TextArea}
                      className="w-full py-2"
                    />
                    <div className="h-8 py-1">
                      {touched.description && errors.description && (
                        <div className="error text-red-500 ml-1">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Release Year Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Release Year:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field
                      name="releaseYear"
                      as={Input}
                      rows={4}
                      className="w-full py-1"
                    />
                    <div className="h-8 py-1">
                      {touched.releaseYear && errors.releaseYear && (
                        <div className="error text-red-500 ml-1">
                          {errors.releaseYear}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cast Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Cast:</label>
                  <div className="w-full flex flex-col items-start">
                    <FieldArray
                      name="cast"
                      render={(arrayHelpers) => (
                        <div className="w-full">
                          {values.cast && values.cast.length > 0 ? (
                            values.cast.map((castMember, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Field
                                  name={`cast[${index}]`}
                                  placeholder="Enter cast member"
                                  className="w-full py-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)} // Remove member
                                  className="text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          ) : (
                            <div>No cast members added.</div>
                          )}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push("")} // Add new member
                            className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                          >
                            Add Cast Member
                          </button>
                        </div>
                      )}
                    />
                    <div className="h-8 py-1">
                      <ErrorMessage
                        name="cast"
                        component="div"
                        className="error text-red-500 ml-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Trailer Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Trailer:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="trailer" as={Input} className="w-full py-2" />
                    <div className="h-8 py-1">
                      {touched.trailer && errors.trailer && (
                        <div className="error text-red-500 ml-1">
                          {errors.trailer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Director Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Director:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="director" as={Input} className="w-full py-2" />
                    <div className="h-8 py-1">
                      {touched.director && errors.director && (
                        <div className="error text-red-500 ml-1">
                          {errors.director}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Age Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Age:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="age" as={Input} className="w-full py-2" />
                    <div className="h-8 py-1">
                      {touched.age && errors.age && (
                        <div className="error text-red-500 ml-1">
                          {errors.age}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Range User Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">User Type:</label>
                  <div className="w-full flex flex-col items-start">
                    <Radio.Group
                      value={values.isForAllUser}
                      onChange={(e) =>
                        setFieldValue("isForAllUser", e.target.value)
                      }
                    >
                      <Radio value={true}>For All</Radio>
                      <Radio value={false}>For VIP</Radio>
                    </Radio.Group>
                  </div>
                </div>

                {/* Genre Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Genre:</label>
                  <div className="w-full flex flex-col items-start">
                    <Select
                      className="w-full"
                      mode="multiple"
                      value={values.genre}
                      placeholder="Select genres"
                      style={{ flex: 1 }}
                      onChange={(value) => setFieldValue("genre", value)}
                    >
                      <Select.Option value="Action">Action</Select.Option>
                      <Select.Option value="Animation">Animation</Select.Option>
                      <Select.Option value="Romance">Romance</Select.Option>
                      <Select.Option value="Horror">Horror</Select.Option>
                      <Select.Option value="Comedy">Comedy</Select.Option>
                      <Select.Option value="Adventure">Adventure</Select.Option>
                      <Select.Option value="Science Fiction">
                        Science Fiction
                      </Select.Option>
                      <Select.Option value="Drama">Drama</Select.Option>
                      <Select.Option value="Fantasy">Fantasy</Select.Option>
                      <Select.Option value="Crime">Crime</Select.Option>
                      <Select.Option value="Documentary">
                        Documentary
                      </Select.Option>
                      <Select.Option value="Historical">
                        Historical
                      </Select.Option>
                      <Select.Option value="Mystery">Mystery</Select.Option>
                      <Select.Option value="Education">Education</Select.Option>
                      <Select.Option value="Superhero">Superhero</Select.Option>
                    </Select>
                    <div className="h-8 py-1">
                      {touched.genre && errors.genre && (
                        <div className="error text-red-500 ml-1">
                          {errors.genre}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Small Image Upload */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd truncate">
                    Small Image:
                  </label>
                  <div className="w-full flex flex-col items-start">
                    <Upload
                      listType="picture-card"
                      onChange={(info) => {
                        if (info.fileList.length > 0) {
                          const file = info.fileList[0];
                          setFieldValue("small_image", file.originFileObj);
                        } else {
                          setFieldValue("small_image", "");
                        }
                      }}
                    >
                      <Button
                        type="button"
                        style={{ border: 0, background: "none" }}
                      >
                        <PlusOutlined />
                        <div>Upload</div>
                      </Button>
                    </Upload>
                    <div className="h-8 py-1">
                      {touched.small_image && errors.small_image && (
                        <div className="error text-red-500 ml-1">
                          {errors.small_image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Large Image Upload */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd truncate">
                    Large Image:
                  </label>
                  <div className="w-full flex flex-col items-start">
                    <Upload
                      listType="picture-card"
                      onChange={(info) => {
                        if (info.fileList.length > 0) {
                          const file = info.fileList[0];
                          setFieldValue("large_image", file.originFileObj);
                        } else {
                          setFieldValue("large_image", "");
                        }
                      }}
                    >
                      <Button
                        type="button"
                        style={{ border: 0, background: "none" }}
                      >
                        <PlusOutlined />
                        <div>Upload</div>
                      </Button>
                    </Upload>
                    <div className="h-8 py-1">
                      {touched.large_image && errors.large_image && (
                        <div className="error text-red-500 ml-1">
                          {errors.large_image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Select
                className="w-4/5"
                mode="only"
                placeholder="Select type film"
                style={{ flex: 1 }}
                onChange={(value) => handleTypeChange(value)}
              >
                <Select.Option value="Movie">Movie</Select.Option>
                <Select.Option value="TV Shows">TV Shows</Select.Option>
              </Select>
              {filmType === "Movie" ? (
                <div className="flex items-start justify-center">
                  <label className="label-input-tnvd truncate">Movie:</label>
                  <div className="w-2/3 flex flex-col items-start">
                    <Upload
                      onChange={(info) => {
                        setFieldValue(
                          "movie",
                          info.fileList.map((file) => file.originFileObj)
                        );
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                // FieldArray cho TV Shows
                <FieldArray name="videos">
                  {({ push, remove, form }) => (
                    <div className="flex flex-col space-y-4 items-start justify-center">
                      {form.values.videos && form.values.videos.length > 0 ? (
                        form.values.videos.map((video, index) => (
                          <div
                            key={index}
                            className="flex flex-col space-y-2 items-start justify-center border p-2 rounded"
                          >
                            {/* Video Upload Field */}
                            <div className="flex items-start justify-center">
                              <label className="label-input-tnvd truncate">
                                Video {index + 1}:
                              </label>
                              <div className="w-2/3 flex flex-col items-start">
                                <Upload
                                  fileList={video.fileList || []}
                                  onChange={(info) => {
                                    const newFileList = info.fileList;
                                    form.setFieldValue(
                                      `videos[${index}].fileList`,
                                      newFileList
                                    );
                                    if (newFileList.length > 0) {
                                      form.setFieldValue(
                                        `videos[${index}].file`,
                                        newFileList[0].originFileObj
                                      );
                                    } else {
                                      form.setFieldValue(
                                        `videos[${index}].file`,
                                        null
                                      );
                                    }
                                  }}
                                >
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </div>
                            </div>

                            {/* Title Field cho video */}
                            <div className="flex items-start justify-center">
                              <label className="label-input-tnvd truncate">
                                Title:
                              </label>
                              <div className="w-2/3 flex flex-col items-start">
                                <Field
                                  name={`videos[${index}].title`}
                                  placeholder={`Enter title for Video ${
                                    index + 1
                                  }`}
                                  className="input-field"
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Remove Video
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div>No videos added.</div>
                      )}
                      <Button
                        type="button"
                        onClick={() =>
                          push({ fileList: [], file: null, title: "" })
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Add More
                      </Button>
                    </div>
                  )}
                </FieldArray>
              )}
              <button
                className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                type="submit"
                disabled={isSubmitting}
              >
                Save Details
              </button>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Modal Update Film */}
      <Modal
        open={isModalEditVisible}
        className="text-center"
        title={
          <h2 className="text-2xl font-bold text-[#f18966] animate-slideIn">
            Edit Film
          </h2>
        }
        onCancel={handleCancelEdit}
        footer={null}
      >
        <Formik
          enableReinitialize
          initialValues={{
            name: film.name || "",
            description: film.description || "",
            cast: film.cast ? JSON.parse(film.cast) : [],
            releaseYear: film.releaseYear || "",
            isForAllUser: film.isForAllUsers,
            // Giả sử genre được lưu dưới dạng mảng, nếu không thì convert lại
            genre: film.genre ? JSON.parse(film.genre) : [],
            small_image: film.small_image || "",
            large_image: film.large_image || "",
            trailer: film.trailer || "",
            director: film.director || "",
            age: film.age || "",
            // Với TV Shows, chuyển mảng video thành mảng object chứa title và fileList
            videos:
              isSeries === true && film.video && film.video.length > 0
                ? film.video.map((episode) => ({
                    title: episode.title || "",
                    fileList: [
                      {
                        uid: "-1",
                        name: "Uploaded Video",
                        status: "done",
                        url: episode.urlVideo,
                      },
                    ],
                    // Giữ file ở đây nếu người dùng muốn upload file mới (ban đầu null)
                    file: null,
                  }))
                : [],
            // Với Movie, giả sử film.video có đúng 1 phần tử và lưu url video
            movie:
              isSeries !== true && film.video && film.video.length > 0
                ? film.video[0].urlVideo
                : "",
            isSeries: isSeries,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              // Nếu backend mong đợi chuỗi JSON, gọi stringify một lần:
              formData.append("cast", JSON.stringify(values.cast));
              formData.append("isForAll", values.isForAllUser);
              formData.append("releaseYear", values.releaseYear);
              formData.append("trailer", values.trailer);
              formData.append("director", values.director);
              // Với genre, nếu initialValues đã xử lý JSON.parse, thì values.genre đã là mảng, gọi stringify một lần:
              formData.append("genre", JSON.stringify(values.genre));
              formData.append("small_image", values.small_image);
              formData.append("large_image", values.large_image);
              formData.append("isSeries", isSeries);
              formData.append("age", values.age);
              if (isSeries === true) {
                const filteredVideos = values.videos.filter(
                  (vid) => vid.title && vid.title.trim() !== ""
                );
                const titles = filteredVideos.map((vid) => vid.title);
                formData.append("title", JSON.stringify(titles));
                filteredVideos.forEach((vid) => {
                  if (vid.file) {
                    formData.append("movie", vid.file);
                  } else if (vid.fileList && vid.fileList.length > 0) {
                    formData.append("movie", vid.fileList[0].url);
                  }
                });
              } else {
                if (typeof values.movie === "object") {
                  values.movie.forEach((file) =>
                    formData.append("movie", file.originFileObj)
                  );
                } else {
                  formData.append("movie", values.movie);
                }
              }

              const response = await filmApi.postUpdateFilm(film._id, formData);

              if (response.status === 200) {
                message.success("Film updated successfully!");
                handleCancelEdit();
                fetchFilms();
              }
            } catch (error) {
              console.error("Error update film:", error);
              message.error("An error occurred while updating the film.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="mt-5">
              {/* Các field cơ bản */}
              <div className="grid grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Name:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="name" as={Input} className="w-full py-2" />
                    {touched.name && errors.name && (
                      <div className="error text-red-500 ml-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Description:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field
                      name="description"
                      as={TextArea}
                      className="w-full py-2"
                    />
                    {touched.description && errors.description && (
                      <div className="error text-red-500 ml-1">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Release Year Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Release Year:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field
                      name="releaseYear"
                      as={Input}
                      className="w-full py-1"
                    />
                    {touched.releaseYear && errors.releaseYear && (
                      <div className="error text-red-500 ml-1">
                        {errors.releaseYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Cast:</label>
                  <div className="w-full flex flex-col items-start">
                    <FieldArray
                      name="cast"
                      render={(arrayHelpers) => (
                        <div className="w-full">
                          {values.cast && values.cast.length > 0 ? (
                            values.cast.map((castMember, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Field
                                  name={`cast[${index}]`}
                                  placeholder="Enter cast member"
                                  className="w-full py-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  className="text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          ) : (
                            <div>No cast members added.</div>
                          )}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                            className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                          >
                            Add Cast Member
                          </button>
                        </div>
                      )}
                    />
                    <ErrorMessage
                      name="cast"
                      component="div"
                      className="error text-red-500 ml-1"
                    />
                  </div>
                </div>

                {/* Trailer Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Trailer:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="trailer" as={Input} className="w-full py-2" />
                    {touched.trailer && errors.trailer && (
                      <div className="error text-red-500 ml-1">
                        {errors.trailer}
                      </div>
                    )}
                  </div>
                </div>

                {/* Director Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Director:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="director" as={Input} className="w-full py-2" />
                    {touched.director && errors.director && (
                      <div className="error text-red-500 ml-1">
                        {errors.director}
                      </div>
                    )}
                  </div>
                </div>
                {/* Age Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Age:</label>
                  <div className="w-full flex flex-col items-start">
                    <Field name="age" as={Input} className="w-full py-2" />
                    <div className="h-8 py-1">
                      {touched.age && errors.age && (
                        <div className="error text-red-500 ml-1">
                          {errors.age}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Range User Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">User Access:</label>
                  <div className="w-full flex flex-col items-start">
                    <Radio.Group
                      value={values.isForAllUser}
                      onChange={(e) =>
                        setFieldValue("isForAllUser", e.target.value)
                      }
                    >
                      <Radio value={true}>For All</Radio>
                      <Radio value={false}>For VIP</Radio>
                    </Radio.Group>
                  </div>
                </div>

                {/* Genre Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Genre:</label>
                  <div className="w-full flex flex-col items-start">
                    <Select
                      className="w-full"
                      mode="multiple"
                      placeholder="Select genres"
                      value={values.genre}
                      onChange={(value) => setFieldValue("genre", value)}
                    >
                      <Select.Option value="Action">Action</Select.Option>
                      <Select.Option value="Animation">Animation</Select.Option>
                      <Select.Option value="Romance">Romance</Select.Option>
                      <Select.Option value="Horror">Horror</Select.Option>
                      <Select.Option value="Comedy">Comedy</Select.Option>
                      <Select.Option value="Adventure">Adventure</Select.Option>
                      <Select.Option value="Science Fiction">
                        Science Fiction
                      </Select.Option>
                      <Select.Option value="Drama">Drama</Select.Option>
                      <Select.Option value="Fantasy">Fantasy</Select.Option>
                      <Select.Option value="Crime">Crime</Select.Option>
                      <Select.Option value="Documentary">
                        Documentary
                      </Select.Option>
                      <Select.Option value="Historical">
                        Historical
                      </Select.Option>
                      <Select.Option value="Mystery">Mystery</Select.Option>
                      <Select.Option value="Education">Education</Select.Option>
                      <Select.Option value="Superhero">Superhero</Select.Option>
                    </Select>
                    {touched.genre && errors.genre && (
                      <div className="error text-red-500 ml-1">
                        {errors.genre}
                      </div>
                    )}
                  </div>
                </div>

                {/* Small Image Upload */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd truncate">
                    Small Image:
                  </label>
                  <div className="w-full flex flex-col items-start">
                    <Upload
                      listType="picture-card"
                      fileList={
                        values.small_image
                          ? [
                              {
                                uid: "-1",
                                name: "Small Image",
                                status: "done",
                                url: values.small_image,
                              },
                            ]
                          : []
                      }
                      onChange={(info) => {
                        if (info.fileList.length > 0) {
                          const file = info.fileList[0];
                          setFieldValue(
                            "small_image",
                            file.originFileObj
                              ? URL.createObjectURL(file.originFileObj)
                              : file.url
                          );
                        } else {
                          setFieldValue("small_image", "");
                        }
                      }}
                      onPreview={() =>
                        window.open(values.small_image, "_blank")
                      }
                    >
                      <Button
                        type="button"
                        style={{ border: 0, background: "none" }}
                      >
                        <PlusOutlined />
                        <div>Upload</div>
                      </Button>
                    </Upload>
                    {touched.small_image && errors.small_image && (
                      <div className="error text-red-500 ml-1">
                        {errors.small_image}
                      </div>
                    )}
                  </div>
                </div>

                {/* Large Image Upload */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd truncate">
                    Large Image:
                  </label>
                  <div className="w-full flex flex-col items-start">
                    <Upload
                      listType="picture-card"
                      fileList={
                        values.large_image
                          ? [
                              {
                                uid: "-1",
                                name: "Large Image",
                                status: "done",
                                url: values.large_image,
                              },
                            ]
                          : []
                      }
                      onChange={(info) => {
                        if (info.fileList.length > 0) {
                          const file = info.fileList[0];
                          setFieldValue(
                            "large_image",
                            file.originFileObj
                              ? URL.createObjectURL(file.originFileObj)
                              : file.url
                          );
                        } else {
                          setFieldValue("large_image", "");
                        }
                      }}
                      onPreview={() =>
                        window.open(values.large_image, "_blank")
                      }
                    >
                      <Button
                        type="button"
                        style={{ border: 0, background: "none" }}
                      >
                        <PlusOutlined />
                        <div>Upload</div>
                      </Button>
                    </Upload>
                    {touched.large_image && errors.large_image && (
                      <div className="error text-red-500 ml-1">
                        {errors.large_image}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Film Type Selector (chỉ hiển thị thông tin, có thể disable nếu không muốn sửa đổi) */}
              <Select
                className="w-4/5"
                style={{ flex: 1 }}
                value={filmType}
                disabled
              >
                <Select.Option value="Movie">Movie</Select.Option>
                <Select.Option value="TV Shows">TV Shows</Select.Option>
              </Select>

              {/* Hiển thị Upload cho Movie hoặc FieldArray cho TV Shows */}
              {filmType === "Movie" ? (
                <div className="flex items-start justify-center mt-4">
                  <label className="label-input-tnvd truncate">Movie:</label>
                  <div className="w-2/3 flex flex-col items-start">
                    <Upload
                      fileList={
                        typeof values.movie === "string" && values.movie.trim()
                          ? [
                              {
                                uid: "-1",
                                name: "Uploaded File",
                                status: "done",
                                url: values.movie,
                              },
                            ]
                          : []
                      }
                      onChange={(info) => {
                        setFieldValue(
                          "movie",
                          info.fileList.map((file) => file.originFileObj)
                        );
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                // TV Shows: Sử dụng FieldArray để quản lý danh sách video và title
                <FieldArray name="videos">
                  {({ push, remove, form }) => (
                    <div className="flex flex-col space-y-4 items-start justify-center mt-4">
                      {form.values.videos && form.values.videos.length > 0 ? (
                        form.values.videos.map((vid, index) => (
                          <div
                            key={index}
                            className="flex flex-col space-y-2 items-start justify-center border p-2 rounded"
                          >
                            {/* Video Upload Field */}
                            <div className="flex items-start justify-center">
                              <label className="label-input-tnvd truncate">
                                Video {index + 1}:
                              </label>
                              <div className="w-2/3 flex flex-col items-start">
                                <Upload
                                  fileList={vid.fileList || []}
                                  onChange={(info) => {
                                    console.log(info.fileList);

                                    const newFileList = info.fileList;
                                    form.setFieldValue(
                                      `videos[${index}].fileList`,
                                      newFileList
                                    );
                                    if (newFileList.length > 0) {
                                      form.setFieldValue(
                                        `videos[${index}].file`,
                                        newFileList[0].originFileObj
                                      );
                                    } else {
                                      form.setFieldValue(
                                        `videos[${index}].file`,
                                        null
                                      );
                                    }
                                  }}
                                >
                                  <Button icon={<UploadOutlined />}>
                                    Upload
                                  </Button>
                                </Upload>
                              </div>
                            </div>

                            {/* Title Field */}
                            <div className="flex items-start justify-center">
                              <label className="label-input-tnvd truncate">
                                Title:
                              </label>
                              <div className="w-2/3 flex flex-col items-start">
                                <Field
                                  name={`videos[${index}].title`}
                                  placeholder={`Enter title for Video ${
                                    index + 1
                                  }`}
                                  className="input-field"
                                />
                              </div>
                            </div>

                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Remove Video
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div>No videos added.</div>
                      )}
                      <Button
                        type="button"
                        onClick={() =>
                          push({ fileList: [], file: null, title: "" })
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Add More
                      </Button>
                    </div>
                  )}
                </FieldArray>
              )}

              <button
                className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089] mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                Save Details
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

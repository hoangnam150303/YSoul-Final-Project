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
        type: kind,
      });
      setFilms(respone.data.data.data);
    } catch (error) {}
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
  }, [filmType]);

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
  });

  const data = films.map((film) => ({
    key: film._id,
    small_image: film.small_image,
    name: film.name,
    releaseYear: film.releaseYear,
    kind: film.movie ? "Movie" : "TV Shows",
    genre: film.genre.replace(/[\[\]]/g, "").split(","),
    isDeleted: film.isDeleted ? "Yes" : "No",
    rating: film.rating || "N/A",
    views: film.views || "N/A",
    rangeUser:
      film.rangeUser.length > 0
        ? film.rangeUser.join(", ").replace(/[\[\]]/g, "")
        : "N/A",
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
            rangeUser: [],
            genre: [],
            small_image: "",
            large_image: "",
            trailer: "",
            movie: [],
            isSeries: false,
            numberTitle: [],
            director: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            console.log(111111);
            
            try {
              // Prepare FormData
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              formData.append("cast", JSON.stringify(values.cast)); // Convert to JSON string if needed
              formData.append("rangeUser", JSON.stringify(values.rangeUser)); // Same here
              formData.append("releaseYear", values.releaseYear);
              formData.append("trailer", values.trailer);
              formData.append("director", values.director);
              formData.append("genre", JSON.stringify(values.genre)); // Convert to JSON string if needed
              formData.append("small_image", values.small_image);
              formData.append("large_image", values.large_image);
              formData.append("isSeries", isSeries);
              if (isSeries === true) {
                formData.append("title", JSON.stringify(title));
                video.forEach((fileArray) => {
                  // Vì mỗi fileArray là một mảng có một phần tử duy nhất, bạn có thể lấy phần tử đầu tiên
                  const file = fileArray[0];
                  formData.append("movie", file); // Thêm file vào formData
                });
                // Convert to JSON string if needed
              } else {
                values.movie.forEach((file) => formData.append("movie", file));
              }

              const response = await filmApi.postCreateFilm(formData);
              if (response.status === 200) {
                message.success("Film created successfully!");
                handleCancel(); // Close modal
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

                {/* Range User Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Range User:</label>
                  <div className="w-full flex flex-col items-start">
                    <Select
                      className="w-full"
                      mode="multiple"
                      placeholder="Select type user"
                      style={{ flex: 1 }}
                      onChange={(value) => setFieldValue("rangeUser", value)}
                    >
                      <Select.Option value="All">All User</Select.Option>
                      <Select.Option value="VIP">VIP User</Select.Option>
                    </Select>
                    <div className="h-8 py-1">
                      {touched.rangeUser && errors.rangeUser && (
                        <div className="error text-red-500 ml-1">
                          {errors.rangeUser}
                        </div>
                      )}
                    </div>
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
                      style={{ flex: 1 }}
                      onChange={(value) => setFieldValue("genre", value)}
                    >
                      <Select.Option value="Adventure">Adventure</Select.Option>
                      <Select.Option value="Fantasy">Fantasy</Select.Option>
                      <Select.Option value="Educational Curriculum">
                        Educational Curriculum
                      </Select.Option>
                      <Select.Option value="Science Fiction">
                        Science Fiction
                      </Select.Option>
                      <Select.Option value="Mystery & Thriller">
                        Mystery & Thriller
                      </Select.Option>
                      <Select.Option value="Romance">Romance</Select.Option>
                      <Select.Option value="Literary Fiction">
                        Literary Fiction
                      </Select.Option>
                      <Select.Option value="Biography/Autobiography">
                        Biography/Autobiography
                      </Select.Option>
                      <Select.Option value="Children Book">
                        Children Book
                      </Select.Option>
                      <Select.Option value="Self-help">Self-help</Select.Option>
                      <Select.Option value="Cookbooks">Cookbooks</Select.Option>
                      <Select.Option value="History">History</Select.Option>
                      <Select.Option value="Graphic Novels/Comic">
                        Graphic Novels/Comic
                      </Select.Option>
                      <Select.Option value="Poetry">Poetry</Select.Option>
                      <Select.Option value="Business">Business</Select.Option>
                      <Select.Option value="Philosophy">
                        Philosophy
                      </Select.Option>
                      <Select.Option value="Travel">Travel</Select.Option>
                      <Select.Option value="Novel/Light Novel">
                        Novel/Light Novel
                      </Select.Option>
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
                style={{
                  flex: 1,
                }}
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
                <div className="flex flex-col space-y-4 items-start justify-center">
                  {/* Additional Fields */}
                  {additionalFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex flex-col space-y-2 items-start justify-center"
                    >
                      {/* Video Upload Field */}
                      <div className="flex items-start justify-center">
                        <label className="label-input-tnvd truncate">
                          Video {index + 1}:
                        </label>
                        <div className="w-2/3 flex flex-col items-start">
                          <Upload
                            onChange={(info) => {
                              const updatedFields = [...additionalFields];
                              updatedFields[index].movieFiles =
                                info.fileList.map((file) => file.originFileObj);
                              setAdditionalFields(updatedFields);
                              handleVideoChange(
                                info.fileList.map((file) => file.originFileObj),
                                index
                              );
                            }}
                          >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                          </Upload>
                        </div>
                      </div>

                      {/* Number Title Field */}
                      <div className="flex items-start justify-center">
                        <label className="label-input-tnvd truncate">
                          Number Title:
                        </label>
                        <div className="w-2/3 flex flex-col items-start">
                          <input
                            type="text"
                            className="input-field"
                            value={field.numberTitle || ""}
                            onChange={(e) => {
                              const updatedFields = [...additionalFields];
                              updatedFields[index].numberTitle = e.target.value;
                              setAdditionalFields(updatedFields);
                              handleTitleChange(e.target.value, index);
                            }}
                            placeholder={`Enter number title for Video ${
                              index + 1
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button onClick={handleAddMore}>Add More</Button>
                </div>
              )}
              <button
                className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                type="submit"
                disabled={isSubmitting} // Disable button while submitting
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
        className="text-center "
        title={
          <h2 className="text-2xl font-bold text-[#f18966]  animate-slideIn">
            Edit Film
          </h2>
        }
        onCancel={handleCancelEdit}
        footer={null}
      >
        <Formik
          initialValues={{
            name: film.name || "",
            description: film.description || "",
            cast: film.cast || [],
            releaseYear: film.releaseYear || "",
            rangeUser: film.rangeUser || [],
            genre: film.genre || [],
            small_image: film.small_image || "",
            large_image: film.large_image || "",
            trailer: film.trailer || "",
            movie: film.movie,
            isSeries: isSeries,
            numberTitle: film.numberTitle || [],
            director: film.director || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting}) => {
            console.log(1111);
            try {
           
              
              // Prepare FormData
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              formData.append("cast", JSON.stringify(values.cast)); // Convert to JSON string if needed
              formData.append("rangeUser", JSON.stringify(values.rangeUser)); // Same here
              formData.append("releaseYear", values.releaseYear);
              formData.append("trailer", values.trailer);
              formData.append("director", values.director);
              formData.append("genre", JSON.stringify(values.genre)); // Convert to JSON string if needed
              formData.append("small_image", values.small_image);
              formData.append("large_image", values.large_image);
              formData.append("isSeries", isSeries);
              if (isSeries === true) {
                formData.append("title", JSON.stringify(title));
                video.forEach((fileArray) => {
                  // Vì mỗi fileArray là một mảng có một phần tử duy nhất, bạn có thể lấy phần tử đầu tiên
                  const file = fileArray[0];
                  formData.append("movie", file); // Thêm file vào formData
                });
                // Convert to JSON string if needed
              } else {
                values.movie.forEach((file) => formData.append("movie", file));
              }
              console.log(1111);
              
              const response = await filmApi.postCreateFilm(formData);
              console.log(response);
              
              if (response.status === 200) {
                message.success("Film created successfully!");
                handleCancel(); // Close modal
              }
            } catch (error) {
              console.error("Error update film:", error);
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

                {/* Range User Field */}
                <div className="flex-input-tnvd">
                  <label className="label-input-tnvd">Range User:</label>
                  <div className="w-full flex flex-col items-start">
                    <Select
                      className="w-full"
                      mode="multiple"
                      placeholder="Select type user"
                      value={values.rangeUser}
                      style={{ flex: 1 }}
                      onChange={(value) => setFieldValue("rangeUser", value)}
                    >
                      <Select.Option value="All">All User</Select.Option>
                      <Select.Option value="VIP">VIP User</Select.Option>
                    </Select>
                    <div className="h-8 py-1">
                      {touched.rangeUser && errors.rangeUser && (
                        <div className="error text-red-500 ml-1">
                          {errors.rangeUser}
                        </div>
                      )}
                    </div>
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
                      <Select.Option value="Adventure">Adventure</Select.Option>
                      <Select.Option value="Fantasy">Fantasy</Select.Option>
                      <Select.Option value="Educational Curriculum">
                        Educational Curriculum
                      </Select.Option>
                      <Select.Option value="Science Fiction">
                        Science Fiction
                      </Select.Option>
                      <Select.Option value="Mystery & Thriller">
                        Mystery & Thriller
                      </Select.Option>
                      <Select.Option value="Romance">Romance</Select.Option>
                      <Select.Option value="Literary Fiction">
                        Literary Fiction
                      </Select.Option>
                      <Select.Option value="Biography/Autobiography">
                        Biography/Autobiography
                      </Select.Option>
                      <Select.Option value="Children Book">
                        Children Book
                      </Select.Option>
                      <Select.Option value="Self-help">Self-help</Select.Option>
                      <Select.Option value="Cookbooks">Cookbooks</Select.Option>
                      <Select.Option value="History">History</Select.Option>
                      <Select.Option value="Graphic Novels/Comic">
                        Graphic Novels/Comic
                      </Select.Option>
                      <Select.Option value="Poetry">Poetry</Select.Option>
                      <Select.Option value="Business">Business</Select.Option>
                      <Select.Option value="Philosophy">
                        Philosophy
                      </Select.Option>
                      <Select.Option value="Travel">Travel</Select.Option>
                      <Select.Option value="Novel/Light Novel">
                        Novel/Light Novel
                      </Select.Option>
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
                      fileList={
                        values.small_image
                          ? [
                              {
                                uid: "-1", // UID tạm
                                name: "Small Image", // Tên mặc định
                                status: "done",
                                url: values.small_image, // URL của ảnh
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
                              ? URL.createObjectURL(file.originFileObj) // Tạo URL tạm cho file mới
                              : file.url // Giữ nguyên URL cũ nếu không đổi
                          );
                        } else {
                          setFieldValue("small_image", ""); // Reset nếu không có file nào
                        }
                      }}
                      onPreview={() => {
                        window.open(values.small_image, "_blank");
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
                      fileList={
                        values.large_image
                          ? [
                              {
                                uid: "-1", // UID tạm
                                name: "Large Image", // Tên mặc định
                                status: "done",
                                url: values.large_image, // URL của ảnh
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
                              ? URL.createObjectURL(file.originFileObj) // Tạo URL tạm cho file mới
                              : file.url // Giữ nguyên URL cũ nếu không đổi
                          );
                        } else {
                          setFieldValue("large_image", ""); // Reset nếu không có file nào
                        }
                      }}
                      onPreview={() => {
                        window.open(values.large_image, "_blank");
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
                style={{
                  flex: 1,
                }}
                value={filmType}
              ></Select>
              {filmType === "Movie" ? (
                <div className="flex items-start justify-center">
                  <label className="label-input-tnvd truncate">Movie:</label>
                  <div className="w-2/3 flex flex-col items-start">
                    <Upload
                      fileList={
                        typeof values.movie === "string" && values.movie.trim() // Kiểm tra nếu movie là chuỗi và không rỗng
                          ? [
                              {
                                uid: "-1", // UID tạm thời cho file duy nhất
                                name: "Uploaded File", // Tên hiển thị
                                status: "done", // Trạng thái tải lên
                                url: values.movie, // URL của file
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
                <div className="flex flex-col space-y-4 items-start justify-center">
                  {/* Additional Fields */}
                  {additionalFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex flex-col space-y-2 items-start justify-center"
                    >
                      {/* Video Upload Field */}
                      <div className="flex items-start justify-center">
                        <label className="label-input-tnvd truncate">
                          Video {index + 1}:
                        </label>
                        <div className="w-2/3 flex flex-col items-start">
                          <Upload
                            onChange={(info) => {
                              const updatedFields = [...additionalFields];
                              updatedFields[index].movieFiles =
                                info.fileList.map((file) => file.originFileObj);
                              setAdditionalFields(updatedFields);
                              handleVideoChange(
                                info.fileList.map((file) => file.originFileObj),
                                index
                              );
                            }}
                          >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                          </Upload>
                        </div>
                      </div>

                      {/* Number Title Field */}
                      <div className="flex items-start justify-center">
                        <label className="label-input-tnvd truncate">
                          Number Title:
                        </label>
                        <div className="w-2/3 flex flex-col items-start">
                          <input
                            type="text"
                            className="input-field"
                            value={field.numberTitle || ""}
                            onChange={(e) => {
                              const updatedFields = [...additionalFields];
                              updatedFields[index].numberTitle = e.target.value;
                              setAdditionalFields(updatedFields);
                              handleTitleChange(e.target.value, index);
                            }}
                            placeholder={`Enter number title for Video ${
                              index + 1
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button onClick={handleAddMore}>Add More</Button>
                </div>
              )}
              <button
                className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                type="submit"
                disabled={isSubmitting} // Disable button while submitting
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

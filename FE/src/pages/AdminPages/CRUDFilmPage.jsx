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
} from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
import filmApi from "../../hooks/filmApi";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";

const { TextArea } = Input;
const { Option } = Select;

// --- HELPER: Parse dữ liệu Cast từ DB ---
const parseCastData = (castData) => {
  if (!castData) return [];
  if (Array.isArray(castData)) {
    if (
      castData.length > 0 &&
      typeof castData[0] === "string" &&
      castData[0].trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(castData[0]);
        return Array.isArray(parsed) ? parsed : castData;
      } catch (e) {
        return castData;
      }
    }
    return castData;
  }
  if (typeof castData === "string") {
    try {
      const parsed = JSON.parse(castData);
      return Array.isArray(parsed) ? parsed : [castData];
    } catch (e) {
      return [castData];
    }
  }
  return [];
};

// --- COMPONENT FORM ---
const FilmForm = ({
  initialValues,
  isEditMode,
  onSubmit,
  handleCancel,
  filmType,
  setFilmType,
}) => {
  const getImageUrl = (file) => {
    if (!file) return "";
    if (typeof file === "string") return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return "";
  };

  // --- VALIDATION SCHEMA (ĐÃ CẬP NHẬT CHO CẢ TV SHOW & MOVIE) ---
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    cast: Yup.array()
      .min(1, "At least 1 cast is required")
      .required("Cast is required"),
    releaseYear: Yup.string().required("Release Year is required"),
    isForAllUser: Yup.string().required("User type is required"),
    genre: Yup.string().required("Genre is required"),
    trailer: Yup.string().required("Trailer URL is required"),
    director: Yup.string().required("Director is required"),
    age: Yup.string().required("Age is required"),
    small_image: isEditMode
      ? Yup.mixed()
      : Yup.mixed().required("Small image is required"),
    large_image: isEditMode
      ? Yup.mixed()
      : Yup.mixed().required("Large image is required"),

    // Validate cho Movie (Phim lẻ)
    movie: Yup.mixed().when("isSeries", {
      is: false, // Nếu là Movie
      then: (schema) =>
        schema.test(
          "required-movie",
          "Vui lòng tải video phim lẻ",
          (value) => !!value
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    // [NEW] Validate cho TV Shows (Phim bộ)
    videos: Yup.array().when("isSeries", {
      is: true, // Nếu là TV Show
      then: (schema) =>
        schema
          .of(
            Yup.object().shape({
              title: Yup.string().required("Tiêu đề tập là bắt buộc"),
              // File bắt buộc nếu chưa có URL (Create mode hoặc thêm tập mới)
              file: Yup.mixed().test(
                "file-required",
                "File video là bắt buộc",
                function (val) {
                  const { url } = this.parent;
                  if (url) return true; // Đã có url cũ -> OK
                  return !!val; // Chưa có url -> Phải có file upload
                }
              ),
            })
          )
          .min(1, "Phim bộ cần ít nhất 1 tập phim"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <Formik
      enableReinitialize // Quan trọng: Để reset form khi filmType thay đổi
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="mt-5 text-left">
          <div className="grid grid-cols-2 gap-6">
            {/* --- Các trường thông tin cơ bản (Giữ nguyên) --- */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Name:</label>
              <div>
                <Field
                  name="name"
                  as={Input}
                  className="w-full py-2"
                  status={touched.name && errors.name ? "error" : ""}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Director:</label>
              <div>
                <Field
                  name="director"
                  as={Input}
                  className="w-full py-2"
                  status={touched.director && errors.director ? "error" : ""}
                />
                <ErrorMessage
                  name="director"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full col-span-2 flex flex-col gap-2">
              <label className="font-semibold">Description:</label>
              <div>
                <Field
                  name="description"
                  as={TextArea}
                  rows={3}
                  className="w-full py-2"
                  status={
                    touched.description && errors.description ? "error" : ""
                  }
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Release Year:</label>
              <div>
                <Field
                  name="releaseYear"
                  as={Input}
                  className="w-full py-2"
                  status={
                    touched.releaseYear && errors.releaseYear ? "error" : ""
                  }
                />
                <ErrorMessage
                  name="releaseYear"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Age:</label>
              <div>
                <Field
                  name="age"
                  as={Input}
                  className="w-full py-2"
                  status={touched.age && errors.age ? "error" : ""}
                />
                <ErrorMessage
                  name="age"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full col-span-2 flex flex-col gap-2">
              <label className="font-semibold">Trailer URL:</label>
              <div>
                <Field
                  name="trailer"
                  as={Input}
                  className="w-full py-2"
                  status={touched.trailer && errors.trailer ? "error" : ""}
                />
                <ErrorMessage
                  name="trailer"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Access:</label>
              <Radio.Group
                onChange={(e) => setFieldValue("isForAllUser", e.target.value)}
                value={values.isForAllUser}
              >
                <Radio value={true}>For All</Radio>
                <Radio value={false}>VIP Only</Radio>
              </Radio.Group>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Genre:</label>
              <div>
                <Select
                  className="w-full"
                  value={values.genre || undefined}
                  onChange={(val) => setFieldValue("genre", val)}
                  placeholder="Select Genre"
                  status={touched.genre && errors.genre ? "error" : ""}
                >
                  {[
                    "Action",
                    "Animation",
                    "Romance",
                    "Horror",
                    "Comedy",
                    "Adventure",
                    "Science Fiction",
                    "Drama",
                    "Fantasy",
                    "Crime",
                    "Documentary",
                    "Historical",
                    "Mystery",
                    "Education",
                    "Superhero",
                  ].map((g) => (
                    <Option key={g} value={g}>
                      {g}
                    </Option>
                  ))}
                </Select>
                <ErrorMessage
                  name="genre"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Cast */}
            <div className="w-full col-span-2 flex flex-col gap-2">
              <label className="font-semibold">Cast:</label>
              <FieldArray
                name="cast"
                render={(arrayHelpers) => (
                  <div className="w-full">
                    {values.cast &&
                      values.cast.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Field
                            name={`cast[${index}]`}
                            as={Input}
                            placeholder="Actor Name"
                            className="w-full py-2"
                          />
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        </div>
                      ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => arrayHelpers.push("")}
                      className="w-full"
                    >
                      Add Cast Member
                    </Button>
                  </div>
                )}
              />
              <ErrorMessage
                name="cast"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Images */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Small Image:</label>
              <div>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={
                    values.small_image
                      ? [
                          {
                            uid: "-1",
                            name: "small",
                            status: "done",
                            url: getImageUrl(values.small_image),
                          },
                        ]
                      : []
                  }
                  onPreview={() =>
                    window.open(getImageUrl(values.small_image), "_blank")
                  }
                  onChange={(info) => {
                    if (info.fileList.length > 0)
                      setFieldValue(
                        "small_image",
                        info.fileList[0].originFileObj
                      );
                    else setFieldValue("small_image", null);
                  }}
                >
                  <button
                    type="button"
                    style={{ border: 0, background: "none" }}
                  >
                    <PlusOutlined />
                    <div>Upload</div>
                  </button>
                </Upload>
                <ErrorMessage
                  name="small_image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold">Large Image:</label>
              <div>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={
                    values.large_image
                      ? [
                          {
                            uid: "-1",
                            name: "large",
                            status: "done",
                            url: getImageUrl(values.large_image),
                          },
                        ]
                      : []
                  }
                  onPreview={() =>
                    window.open(getImageUrl(values.large_image), "_blank")
                  }
                  onChange={(info) => {
                    if (info.fileList.length > 0)
                      setFieldValue(
                        "large_image",
                        info.fileList[0].originFileObj
                      );
                    else setFieldValue("large_image", null);
                  }}
                >
                  <button
                    type="button"
                    style={{ border: 0, background: "none" }}
                  >
                    <PlusOutlined />
                    <div>Upload</div>
                  </button>
                </Upload>
                <ErrorMessage
                  name="large_image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* --- VIDEO SECTION (XỬ LÝ LOGIC Ở ĐÂY) --- */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-semibold text-lg">Format:</label>
              <Select
                value={filmType}
                style={{ width: 120 }}
                onChange={(value) => {
                  // Chỉ gọi setFilmType, để initialValues tự lo việc update isSeries
                  setFilmType(value);
                }}
                disabled={isEditMode} // Thường Edit mode nên khóa đổi type để tránh lỗi data
              >
                <Option value="Movie">Movie</Option>
                <Option value="TV Shows">TV Shows</Option>
              </Select>
            </div>

            {filmType === "Movie" ? (
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold">Movie File:</label>
                <div className="w-full">
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    fileList={
                      values.movie
                        ? [
                            {
                              uid: "-1",
                              name:
                                typeof values.movie === "string"
                                  ? "Current Video"
                                  : values.movie.name,
                              status: "done",
                              url:
                                typeof values.movie === "string"
                                  ? values.movie
                                  : undefined,
                            },
                          ]
                        : []
                    }
                    onChange={(info) => {
                      if (info.fileList.length > 0)
                        setFieldValue("movie", info.fileList[0].originFileObj);
                      else setFieldValue("movie", null);
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Movie</Button>
                  </Upload>
                  {typeof values.movie === "string" && values.movie && (
                    <div className="text-gray-500 text-xs mt-1 italic">
                      Current: {values.movie}
                    </div>
                  )}
                  <ErrorMessage
                    name="movie"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold">Episodes:</label>
                <FieldArray name="videos">
                  {({ push, remove, form }) => (
                    <div className="flex flex-col gap-4">
                      {form.values.videos.map((vid, index) => (
                        <div
                          key={index}
                          className="border p-3 rounded bg-gray-50 flex flex-col gap-2"
                        >
                          <div className="font-bold flex justify-between">
                            <span>Episode {index + 1}</span>
                            <Button
                              danger
                              size="small"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>

                          {/* Title Field */}
                          <div>
                            <Input
                              placeholder="Episode Title"
                              value={vid.title}
                              onChange={(e) =>
                                form.setFieldValue(
                                  `videos[${index}].title`,
                                  e.target.value
                                )
                              }
                              status={
                                form.errors.videos?.[index]?.title &&
                                form.touched.videos?.[index]?.title
                                  ? "error"
                                  : ""
                              }
                            />
                            <ErrorMessage
                              name={`videos[${index}].title`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>

                          {/* Video Upload Field */}
                          <div className="flex justify-between items-center">
                            <Upload
                              beforeUpload={() => false}
                              maxCount={1}
                              fileList={
                                vid.url
                                  ? [
                                      {
                                        uid: "-1",
                                        name: "Current",
                                        status: "done",
                                      },
                                    ]
                                  : vid.file
                                  ? [
                                      {
                                        uid: "-1",
                                        name: vid.file.name,
                                        status: "done",
                                      },
                                    ]
                                  : []
                              }
                              onChange={(info) => {
                                if (info.fileList.length > 0)
                                  form.setFieldValue(
                                    `videos[${index}].file`,
                                    info.fileList[0].originFileObj
                                  );
                              }}
                            >
                              <Button icon={<UploadOutlined />}>
                                Upload Video
                              </Button>
                            </Upload>
                          </div>
                          <ErrorMessage
                            name={`videos[${index}].file`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => push({ title: "", file: null, url: "" })}
                        icon={<PlusOutlined />}
                      >
                        Add Episode
                      </Button>
                      {/* Hiển thị lỗi chung cho mảng videos nếu rỗng */}
                      {typeof errors.videos === "string" && (
                        <div className="text-red-500 text-sm">
                          {errors.videos}
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>
            )}
          </div>

          <div className="text-right mt-6">
            <Button onClick={handleCancel} className="mr-3">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-[#679089]"
            >
              {isEditMode ? "Update Film" : "Create Film"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// --- MAIN PAGE ---
export const CRUDFilmPage = () => {
  const [films, setFilms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [film, setFilm] = useState({});
  const [filmType, setFilmType] = useState("Movie");

  const [kind, setKind] = useState("All");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleStatusChangeFilm = async (id) => {
    try {
      const res = await filmApi.postActiveOrDeactive(id);
      if (res.status === 200) {
        message.success("Success");
        fetchFilms();
      }
    } catch (e) {
      message.error("Fail");
    }
  };

  const fetchFilms = async () => {
    try {
      const respone = await filmApi.getAllFilm({
        typeFilm: kind,
        sort: filter,
        search: searchTerm,
        typeUser: "admin",
      });
      setFilms(respone.data?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, [kind, searchTerm, filter]);

  const showModal = () => {
    setFilm({});
    setFilmType("Movie");
    setIsModalVisible(true);
  };

  const handleEdit = (id) => {
    const selected = films.find((f) => f._id === id);
    if (selected) {
      const isSeries =
        selected.video.length > 1 ||
        (selected.video.length > 0 && selected.video[0].title);
      setFilmType(isSeries ? "TV Shows" : "Movie");
      setFilm(selected);
      setIsModalEditVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelEdit = () => {
    setIsModalEditVisible(false);
    setFilm({});
  };

  const handleFormSubmit = async (
    values,
    { setSubmitting, resetForm },
    mode
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("releaseYear", values.releaseYear);
      formData.append("isForAll", values.isForAllUser);
      formData.append("trailer", values.trailer);
      formData.append("director", values.director);
      formData.append("genre", values.genre);
      formData.append("age", values.age);
      formData.append("cast", JSON.stringify(values.cast));

      // Truyền đúng isSeries
      formData.append("isSeries", values.isSeries);

      if (values.small_image instanceof File)
        formData.append("small_image", values.small_image);
      if (values.large_image instanceof File)
        formData.append("large_image", values.large_image);

      if (values.isSeries) {
        // Logic TV Show: Chỉ lấy các tập có Title và (File hoặc URL cũ)
        const validVideos = values.videos.filter(
          (v) => v.title && (v.file || (mode === "UPDATE" && v.url))
        );
        const titles = validVideos.map((v) => v.title);

        if (titles.length > 0) formData.append("title", JSON.stringify(titles));

        validVideos.forEach((v) => {
          if (v.file instanceof File) formData.append("movie", v.file);
          else if (v.url && mode === "UPDATE") formData.append("movie", v.url);
        });
      } else {
        // Logic Movie
        if (values.movie instanceof File) {
          formData.append("movie", values.movie);
        } else if (typeof values.movie === "string" && mode === "UPDATE") {
          formData.append("movie", values.movie);
        }
      }

      const apiCall =
        mode === "CREATE"
          ? filmApi.postCreateFilm(formData)
          : filmApi.postUpdateFilm(film._id, formData);
      const response = await apiCall;

      if (response.status === 200) {
        message.success(`${mode === "CREATE" ? "Create" : "Update"} Success!`);
        mode === "CREATE" ? (resetForm(), handleCancel()) : handleCancelEdit();
        fetchFilms();
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const alignCenter = { align: "center" };
  const columns = [
    {
      title: "Image",
      dataIndex: "small_image",
      key: "small_image",
      ...alignCenter,
      render: (t) => (
        <img
          src={t}
          alt="film"
          className="w-20 h-auto rounded object-cover mx-auto"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...alignCenter,
      width: 150,
    },
    {
      title: "Release Year",
      dataIndex: "releaseYear",
      key: "releaseYear",
      ...alignCenter,
      width: 100,
    },
    {
      title: "Kind",
      key: "kind",
      ...alignCenter,
      width: 100,
      render: (_, r) =>
        r.video.length > 1 || (r.video.length > 0 && r.video[0].title)
          ? "TV Show"
          : "Movie",
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      ...alignCenter,
      width: 150,
      render: (t) => (t ? t.replace(/[\[\]"]/g, "") : ""),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      ...alignCenter,
      width: 100,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      ...alignCenter,
      width: 100,
    },
    {
      title: "Range User",
      dataIndex: "rangeUser",
      key: "rangeUser",
      ...alignCenter,
      width: 120,
      render: (t) =>
        t === "All Users" ? (
          <span className="text-green-600">All</span>
        ) : (
          <span className="text-orange-500">VIP</span>
        ),
    },
    {
      title: "Action",
      key: "op",
      ...alignCenter,
      width: 150,
      render: (_, r) => (
        <div className="flex gap-2 justify-center">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r.key)}
          />
          <Popconfirm
            title="Change Status?"
            onConfirm={() => handleStatusChangeFilm(r.key)}
          >
            <Button
              danger={!r.isDeleted}
              className={
                r.isDeleted
                  ? "bg-green-500 text-white border-none hover:bg-green-600"
                  : ""
              }
            >
              {r.isDeleted ? "Active" : "Inactive"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const dataTable = films.map((f) => ({
    key: f._id,
    small_image: f.small_image,
    name: f.name,
    releaseYear: f.releaseYear,
    video: f.video,
    genre: f.genre,
    rating: f.totalRating || "N/A",
    views: f.countClick || 0,
    rangeUser: f.isForAllUsers ? "All Users" : "VIP Users",
    isDeleted: f.isDeleted,
  }));

  return (
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
        <div className="flex justify-between mb-4 gap-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Create Film
          </Button>
          <div className="flex gap-2 flex-1 justify-end">
            <Select
              placeholder="Type"
              style={{ width: 120 }}
              onChange={setKind}
              value={kind}
            >
              <Option value="All">All</Option>
              <Option value="Movie">Movie</Option>
              <Option value="TV Shows">TV Shows</Option>
            </Select>
            <Select
              placeholder="Filter"
              style={{ width: 120 }}
              onChange={setFilter}
              value={filter}
            >
              <Option value="All">All</Option>
              <Option value="Newest">Newest</Option>
              <Option value="Popular">Popular</Option>
              <Option value="Top Rated">Top Rated</Option>
              <Option value="IsDeleted">Deleted</Option>
              <Option value="Active">Active</Option>
            </Select>
            <Input
              placeholder="Search"
              style={{ width: 250 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{ pageSize: 5 }}
        />

        <Modal
          open={isModalVisible}
          title={
            <h2 className="text-center text-2xl font-bold text-[#f18966]">
              Create Film
            </h2>
          }
          onCancel={handleCancel}
          footer={null}
          width={800}
          destroyOnClose
          centered
        >
          <FilmForm
            isEditMode={false}
            handleCancel={handleCancel}
            filmType={filmType}
            setFilmType={setFilmType}
            initialValues={{
              name: "",
              description: "",
              cast: [],
              releaseYear: "",
              isForAllUser: false,
              genre: "",
              small_image: null,
              large_image: null,
              trailer: "",
              director: "",
              age: "",
              movie: null,
              videos: [],
              isSeries: filmType === "TV Shows", // Tự động set dựa trên state filmType của cha
            }}
            onSubmit={(vals, helpers) =>
              handleFormSubmit(vals, helpers, "CREATE")
            }
          />
        </Modal>

        <Modal
          open={isModalEditVisible}
          title={
            <h2 className="text-center text-2xl font-bold text-[#f18966]">
              Edit Film
            </h2>
          }
          onCancel={handleCancelEdit}
          footer={null}
          width={800}
          destroyOnClose
          centered
        >
          <FilmForm
            isEditMode={true}
            handleCancel={handleCancelEdit}
            filmType={filmType}
            setFilmType={setFilmType}
            initialValues={{
              name: film.name || "",
              description: film.description || "",
              cast: parseCastData(film.cast),
              releaseYear: film.releaseYear || "",
              isForAllUser: film.isForAllUsers,
              genre: film.genre || "",
              small_image: film.small_image || "",
              large_image: film.large_image || "",
              trailer: film.trailer || "",
              director: film.director || "",
              age: film.age || "",
              isSeries: filmType === "TV Shows",
              movie:
                filmType !== "TV Shows" && film.video?.length > 0
                  ? film.video[0].urlVideo || film.video[0].url || film.video[0]
                  : null,
              videos:
                filmType === "TV Shows" && film.video
                  ? film.video.map((v) => ({
                      title: v.title,
                      url: v.urlVideo,
                      file: null,
                    }))
                  : [],
            }}
            onSubmit={(vals, helpers) =>
              handleFormSubmit(vals, helpers, "UPDATE")
            }
          />
        </Modal>
      </div>
    </Layout>
  );
};

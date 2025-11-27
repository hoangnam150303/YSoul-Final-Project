import React, { useEffect, useState } from "react";
import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import artistApi from "../../hooks/artistApi";
import albumApi from "../../hooks/albumApi";
import singleApi from "../../hooks/singleApi";

// --- QUAN TRỌNG: Lấy Option từ Select ---
const { Option } = Select;

export const CRUDMusicPage = () => {
  const [artist, setArtist] = useState([]);
  const [album, setAlbum] = useState([]);
  const [single, setSingle] = useState([]);
  const [type, setType] = useState("Artist");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({});
  const [selectedAlbum, setSelectedAlbum] = useState({});
  const [selectedSingle, setSelectedSingle] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    Artist: "All",
    Album: "All",
    Single: "All",
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // --- Functions Handle Modal ---
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const showModalEdit = () => setIsModalEditVisible(true);
  const handleCancelEdit = () => setIsModalEditVisible(false);

  const handleTypeFilter = (newType) => {
    setType(newType);
  };

  // --- API Functions ---
  const fetchArtist = async () => {
    try {
      const response = await artistApi.getAllArtist({
        filter: filters.Artist,
        search: searchTerm,
        typeUser: "admin",
      });
      setArtist(response.data.artists);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAlbum = async () => {
    try {
      const response = await albumApi.getAllAlbum({
        filter: filters.Album,
        search: searchTerm,
        typeUser: "admin",
      });
      setAlbum(response.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSingle = async () => {
    try {
      const response = await singleApi.getAllSingle({
        filter: filters.Single,
        search: searchTerm,
        typeUser: "admin",
      });
      setSingle(response.data.singles);
      // --- FIX: Load thêm dữ liệu liên quan để hiển thị tên ---
      fetchAlbum();
      fetchArtist();
    } catch (error) {
      console.log(error);
    }
  };

  // --- Handle Status Changes ---
  const handleStatusChangeArtist = async (id) => {
    try {
      const reponse = await artistApi.changeStatusArtist(id);
      if (reponse.status === 200) fetchArtist();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChangeAlbum = async (id) => {
    try {
      const reponse = await albumApi.changeStatusAlbum(id);
      if (reponse.status === 200) fetchAlbum();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChangeSingle = async (id) => {
    try {
      const reponse = await singleApi.changeStatusSingle(id);
      if (reponse.status === 200) fetchSingle();
    } catch (error) {
      console.log(error);
    }
  };

  // --- Handle Edit Setup ---
  const handleEditArtist = (id) => {
    const validArtist = artist.find((item) => item.id === id);
    setSelectedArtist(validArtist);
    showModalEdit();
  };

  const handleEditAlbum = (id) => {
    const validAlbum = album.find((item) => item.id === id);
    setSelectedAlbum(validAlbum);
    showModalEdit();
  };

  const handleEditSingle = (id) => {
    const validSingle = single.find((item) => item.id === id);
    setSelectedSingle(validSingle);
    showModalEdit();
  };

  // --- useEffect ---
  useEffect(() => {
    if (type === "Artist") fetchArtist();
    else if (type === "Album") fetchAlbum();
    else if (type === "Single") fetchSingle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filters, searchTerm]);

  // --- Validation Schemas ---
  const artistValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    avatar: Yup.mixed().required("Avatar is required"),
  });

  const albumValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    artist_id: Yup.string().required("Artist is required"),
    release_year: Yup.string().required("Release Year is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const singleValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    release_year: Yup.string().required("Release Year is required"),
    artist_id: Yup.string().required("Artist is required"),
    image: Yup.mixed().required("Image is required"),
    mp3: Yup.mixed().required("MP3 is required"),
  });

  // --- Prepare Table Data ---
  const alignCenter = { align: "center" };
  let data = [];

  if (type === "Artist") {
    data = artist.map((item) => ({
      key: item.id,
      image: item.avatar,
      follow: item.follows,
      like: item.likes,
      status: item.is_deleted,
      name: item.name,
    }));
  } else if (type === "Album") {
    data = album.map((item) => ({
      key: item.id,
      image: item.image,
      release_year: item.release_year,
      like: item.likes,
      status: item.is_deleted,
      artist: artist.find((a) => a.id === item.artist_id)?.name || "Unknown",
      name: item.title,
    }));
  } else if (type === "Single") {
    data = single.map((item) => ({
      key: item.id,
      image: item.image,
      release_year: item.release_year,
      like: item.likes,
      status: item.is_deleted,
      artist: artist.find((a) => a.id === item.artist_id)?.name || "Unknown",
      album: album.find((a) => a.id === item.album_id)?.title || "Unknown",
      count_listen: item.count_listen,
      name: item.title,
    }));
  }

  // --- Table Columns ---
  // (Giữ nguyên cấu trúc columns của bạn, chỉ rút gọn để code đỡ dài)
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 150,
      ...alignCenter,
      render: (src) => (
        <div className="flex justify-center">
          <img
            src={src}
            alt="img"
            className="w-16 h-16 object-cover rounded-md shadow-sm"
          />
        </div>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name", ...alignCenter },
    ...(type === "Artist"
      ? [
          {
            title: "Follow",
            dataIndex: "follow",
            key: "follow",
            ...alignCenter,
          },
        ]
      : []),
    { title: "Like", dataIndex: "like", key: "like", ...alignCenter },
    ...(type !== "Artist"
      ? [
          {
            title: "Release Year",
            dataIndex: "release_year",
            key: "release_year",
            ...alignCenter,
          },
          {
            title: "Artist",
            dataIndex: "artist",
            key: "artist",
            ...alignCenter,
          },
        ]
      : []),
    ...(type === "Single"
      ? [
          { title: "Album", dataIndex: "album", key: "album", ...alignCenter },
          {
            title: "Listen Count",
            dataIndex: "count_listen",
            key: "count_listen",
            ...alignCenter,
          },
        ]
      : []),
    {
      title: "Action",
      key: "operation",
      width: 150,
      ...alignCenter,
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            onClick={() =>
              type === "Artist"
                ? handleEditArtist(record.key)
                : type === "Album"
                ? handleEditAlbum(record.key)
                : handleEditSingle(record.key)
            }
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title={record.status ? "Active item?" : "Inactive item?"}
            onConfirm={() =>
              type === "Artist"
                ? handleStatusChangeArtist(record.key)
                : type === "Album"
                ? handleStatusChangeAlbum(record.key)
                : handleStatusChangeSingle(record.key)
            }
            okText="Yes"
            cancelText="No"
          >
            <Button
              className={`${
                record.status
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white border-none`}
            >
              {record.status ? "Activate" : "Inactivate"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // --- Shared Render for Artist/Album Select Options (FIX UI HERE) ---
  const renderArtistOptions = () =>
    artist.map((item) => (
      // label prop dùng để hiển thị text khi đã chọn (tránh hiện cả cục html ảnh)
      <Option key={item.id} value={item.id} label={item.name}>
        <div className="flex items-center gap-2">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-6 h-6 rounded-full object-cover border border-gray-200"
          />
          <span className="font-medium text-gray-700">{item.name}</span>
        </div>
      </Option>
    ));

  const renderAlbumOptions = () =>
    album.map((item) => (
      <Option key={item.id} value={item.id} label={item.title}>
        <div className="flex items-center gap-2">
          <img
            src={item.image}
            alt={item.title}
            className="w-6 h-6 rounded-full object-cover border border-gray-200"
          />
          <span className="font-medium text-gray-700">{item.title}</span>
        </div>
      </Option>
    ));

  // --- Initial Values Helper ---
  const getInitialValues = (isEdit) => {
    if (type === "Artist") {
      return isEdit
        ? { name: selectedArtist.name, avatar: selectedArtist.avatar }
        : { name: "", avatar: null };
    }
    if (type === "Album") {
      return isEdit
        ? {
            title: selectedAlbum.title,
            artist_id: selectedAlbum.artist_id,
            release_year: selectedAlbum.release_year,
            image: selectedAlbum.image,
          }
        : { title: "", artist_id: null, release_year: "", image: null };
    }
    // Single
    return isEdit
      ? {
          title: selectedSingle.title,
          release_year: selectedSingle.release_year,
          artist_id: selectedSingle.artist_id,
          album_id: selectedSingle.album_id,
          image: selectedSingle.image,
          mp3: selectedSingle.mp3,
        }
      : {
          title: "",
          release_year: "",
          artist_id: null,
          album_id: null,
          image: null,
          mp3: null,
        };
  };

  // --- Submit Handler (Create & Update combined logic) ---
  const handleSubmit = async (values, { setSubmitting, resetForm }, isEdit) => {
    try {
      const formData = new FormData();
      // Append text fields
      if (values.name) formData.append("name", values.name);
      if (values.title) formData.append("title", values.title);
      if (values.release_year)
        formData.append("release_year", values.release_year);
      if (values.artist_id) formData.append("artist_id", values.artist_id);
      if (values.album_id) formData.append("album_id", values.album_id);

      // Append Files (Chỉ append nếu là File object, không append URL string cũ)
      if (values.avatar && typeof values.avatar !== "string") {
        formData.append("avatar", values.avatar);
      }
      if (values.image && typeof values.image !== "string") {
        formData.append("image", values.image);
      }
      if (values.mp3 && typeof values.mp3 !== "string") {
        formData.append("mp3", values.mp3);
      }

      let response;
      if (!isEdit) {
        // --- CREATE ---
        if (type === "Artist")
          response = await artistApi.postCreateArtist(formData);
        else if (type === "Album")
          response = await albumApi.postCreateAlbum(formData);
        else response = await singleApi.postCreateSingle(formData);
      } else {
        // --- UPDATE ---
        if (type === "Artist")
          response = await artistApi.upateArtist(selectedArtist.id, formData);
        else if (type === "Album")
          response = await albumApi.updateAlbum(selectedAlbum.id, formData);
        else
          response = await singleApi.updateSingle(selectedSingle.id, formData);
      }

      if (response && response.status === 200) {
        message.success(
          `${type} ${isEdit ? "updated" : "created"} successfully!`
        );
        if (isEdit) handleCancelEdit();
        else handleCancel();

        // Refresh Data
        if (type === "Artist") fetchArtist();
        else if (type === "Album") fetchAlbum();
        else fetchSingle();

        resetForm();
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Common Form Content Render ---
  const renderFormContent = (values, setFieldValue, isEdit) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Cột Trái: Các trường nhập liệu text & select */}
      <div className="flex flex-col space-y-4">
        {type === "Artist" && (
          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">Name:</label>
            <Field name="name" as={Input} placeholder="Artist Name" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        )}

        {type !== "Artist" && (
          <>
            <div className="flex flex-col text-left">
              <label className="font-semibold mb-1">Title:</label>
              <Field name="title" as={Input} placeholder="Title" />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="font-semibold mb-1">Release Year:</label>
              <Field name="release_year" as={Input} placeholder="2025" />
              <ErrorMessage
                name="release_year"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* SELECT ARTIST - FIX UI HERE */}
            <div className="flex flex-col text-left">
              <label className="font-semibold mb-1">Artist:</label>
              <Select
                placeholder="Choose Artist"
                value={values.artist_id}
                onChange={(val) => setFieldValue("artist_id", val)}
                className="w-full"
                optionLabelProp="label" // Hiển thị text label thay vì html option
              >
                {renderArtistOptions()}
              </Select>
              <ErrorMessage
                name="artist_id"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </>
        )}

        {/* SELECT ALBUM (Cho Single) */}
        {type === "Single" && (
          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">Album:</label>
            <Select
              placeholder="Choose Album (Optional)"
              value={values.album_id}
              onChange={(val) => setFieldValue("album_id", val)}
              className="w-full"
              optionLabelProp="label"
              allowClear
            >
              {renderAlbumOptions()}
            </Select>
          </div>
        )}
      </div>

      {/* Cột Phải: Upload File */}
      <div className="flex flex-col space-y-4">
        {/* Upload Image/Avatar */}
        <div className="flex flex-col text-left">
          <label className="font-semibold mb-1">
            {type === "Artist" ? "Avatar:" : "Cover Image:"}
          </label>
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={
              values.avatar || values.image
                ? [
                    {
                      uid: "-1",
                      name: "image",
                      status: "done",
                      url:
                        typeof (values.avatar || values.image) === "string"
                          ? values.avatar || values.image
                          : URL.createObjectURL(values.avatar || values.image),
                    },
                  ]
                : []
            }
            beforeUpload={(file) => {
              setFieldValue(type === "Artist" ? "avatar" : "image", file);
              return false;
            }}
            onRemove={() =>
              setFieldValue(type === "Artist" ? "avatar" : "image", null)
            }
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            {!(values.avatar || values.image) && (
              <div className="flex flex-col items-center">
                <PlusOutlined />
                <div className="mt-2">Upload</div>
              </div>
            )}
          </Upload>
          <ErrorMessage
            name={type === "Artist" ? "avatar" : "image"}
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* Upload MP3 (Cho Single) */}
        {type === "Single" && (
          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">MP3 File:</label>
            <Upload
              accept=".mp3"
              maxCount={1}
              fileList={
                values.mp3
                  ? [
                      {
                        uid: "-2",
                        name: values.mp3.name || "audio.mp3",
                        status: "done",
                        url: typeof values.mp3 === "string" ? values.mp3 : "",
                      },
                    ]
                  : []
              }
              beforeUpload={(file) => {
                setFieldValue("mp3", file);
                return false;
              }}
              onRemove={() => setFieldValue("mp3", null)}
            >
              <Button icon={<UploadOutlined />}>Click to Upload MP3</Button>
            </Upload>
            <ErrorMessage
              name="mp3"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );

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
        {/* Header Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="bg-[#f18966] hover:bg-[#d97957] border-none"
          >
            Create {type}
          </Button>
          <Select
            value={type}
            onChange={handleTypeFilter}
            style={{ width: 120 }}
          >
            <Option value="Artist">Artist</Option>
            <Option value="Album">Album</Option>
            <Option value="Single">Single</Option>
          </Select>
          <Select
            value={filters[type]}
            onChange={(val) => setFilters({ ...filters, [type]: val })}
            style={{ width: 120 }}
          >
            <Option value="All">All</Option>
            <Option value="popular">Popular</Option>
            <Option value="newest">Newest</Option>
            <Option value="Active">Active</Option>
            <Option value="isDeleted">Deleted</Option>
          </Select>
          <Input
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          rowClassName="align-middle"
        />
      </div>

      {/* --- CREATE MODAL --- */}
      <Modal
        open={isModalVisible}
        title={
          <div className="text-center text-2xl font-bold text-[#f18966] mb-4">
            Create New {type}
          </div>
        }
        onCancel={handleCancel}
        footer={null}
        width={800} // Tăng độ rộng modal cho thoáng
      >
        <Formik
          enableReinitialize
          initialValues={getInitialValues(false)}
          validationSchema={
            type === "Artist"
              ? artistValidationSchema
              : type === "Album"
              ? albumValidationSchema
              : singleValidationSchema
          }
          onSubmit={(values, helpers) => handleSubmit(values, helpers, false)}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {renderFormContent(values, setFieldValue, false)}
              <div className="flex justify-end mt-6">
                <Button
                  htmlType="submit"
                  loading={isSubmitting}
                  className="bg-[#679089] text-white hover:bg-[#557a73] px-8 h-10 rounded-full"
                >
                  Create {type}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* --- EDIT MODAL --- */}
      <Modal
        open={isModalEditVisible}
        title={
          <div className="text-center text-2xl font-bold text-[#f18966] mb-4">
            Update {type}
          </div>
        }
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Formik
          enableReinitialize
          initialValues={getInitialValues(true)}
          validationSchema={
            type === "Artist"
              ? artistValidationSchema
              : type === "Album"
              ? albumValidationSchema
              : singleValidationSchema
          }
          onSubmit={(values, helpers) => handleSubmit(values, helpers, true)}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {renderFormContent(values, setFieldValue, true)}
              <div className="flex justify-end mt-6">
                <Button
                  htmlType="submit"
                  loading={isSubmitting}
                  className="bg-[#679089] text-white hover:bg-[#557a73] px-8 h-10 rounded-full"
                >
                  Update {type}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </Layout>
  );
};

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
import artistApi from "../../hooks/artistApi";
import albumApi from "../../hooks/albumApi";
import singleApi from "../../hooks/singleApi";
export const CRUDMusicPage = () => {
  const [artist, setArtist] = useState([]);
  const [album, setAlbum] = useState([]);
  const [single, setSingle] = useState([]);
  const [type, setType] = useState("Artist");
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
  const handleTypeFilter = (newType) => {
    setType(newType);
  };
  const handleCancelEdit = () => {
    setIsModalEditVisible(false);
    setFilm({});
  };

  const fetchArtist = async () => {
    try {
      const response = await artistApi.getAllArtist({
        filter: "",
        search: "",
        typeUser: "admin",
      });
      setArtist(response.data.artists);
    } catch (error) {}
  };

  const fetchAlbum = async () => {
    try {
      const response = await albumApi.getAllAlbum({
        filter: "",
        search: "",
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
        filter: "",
        search: "",
        typeUser: "admin",
      });
      setSingle(response.data.singles);
      fetchAlbum();
    } catch (error) {}
  };
  const handleDelete = async (id) => {
    try {
      await filmApi.postDeleteFilm(id);
      fetchArtist();
    } catch (error) {}
  };
  useEffect(() => {
    if (type === "Artist") {
      fetchArtist();
    } else if (type === "Album") {
      fetchAlbum();
    } else if (type === "Single") {
      fetchSingle();
    }
  }, [type]);

  const alignCenter = {
    align: "center",
  };
  const artistValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    avatar: Yup.mixed().required("Avatar is required"),
  });

  // Schema dành cho Album
  const albumValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    artist_id: Yup.string().required("Artist is required"),
    release_year: Yup.string().required("Release Year is required"),
    image: Yup.mixed().required("Image is required"),
  });

  // Schema dành cho Single
  const singleValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    release_year: Yup.string().required("Release Year is required"),
    artist_id: Yup.string().required("Artist is required"),
    album_id: Yup.string().required("Album is required"),
    image: Yup.mixed().required("Image is required"),
    mp3: Yup.mixed().required("MP3 is required"),
  });

  let data;
  if (type === "Artist") {
    data = artist.map((artist) => ({
      key: artist.id,
      image: artist.avatar,
      follow: artist.follows,
      like: artist.likes,
      name: artist.name,
    }));
  } else if (type === "Album") {
    data = album.map((album) => ({
      key: album.id,
      image: album.image,
      release_year: album.release_year,
      like: album.likes,
      artist: artist.find((a) => a.id === album.artist_id).name || "Unknown",
      name: album.title,
    }));
  } else if (type === "Single") {
    data = single.map((singleItem) => ({
      key: singleItem.id,
      image: singleItem.image,
      release_year: singleItem.release_year,
      like: singleItem.likes,
      // Lấy tên nghệ sĩ từ mảng artist dựa trên singleItem.artist_id
      artist:
        artist.find((a) => a.id === singleItem.artist_id)?.name || "Unknown",
      // Lấy tên album từ mảng album dựa trên singleItem.album_id
      album:
        album.find((a) => a.id === singleItem.album_id)?.title || "Unknown",
      count_listen: singleItem.count_listen,
      name: singleItem.title,
    }));
  }

  // Giả sử alignCenter được định nghĩa sẵn

  const columns =
    type === "Artist"
      ? [
          {
            title: "Image",
            dataIndex: "image", // sử dụng artist.avatar
            key: "image",
            width: 150,
            ...alignCenter,
            render: (avatar) => (
              <div>
                <img src={avatar} alt="Artist" className="w-full h-auto" />
              </div>
            ),
          },
          {
            title: "Name",
            dataIndex: "name", // sử dụng artist.name
            key: "name",
            width: 150,
            ...alignCenter,
          },
          {
            title: "Follow",
            dataIndex: "follow", // sử dụng artist.follows
            key: "follow",
            width: 150,
            ...alignCenter,
          },
          {
            title: "Like",
            dataIndex: "like", // sử dụng artist.likes
            key: "like",
            width: 150,
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
                  onClick={() => handleEdit(record.id)}
                >
                  <EditOutlined />
                </button>
                <Popconfirm
                  title="Delete the Artist"
                  description="Are you sure to delete this artist?"
                  onConfirm={() => handleDelete(record.id)}
                  cancelText="No"
                >
                  <button className="text-base bg-red-600 text-white px-3 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-red-600 ml-3">
                    <DeleteOutlined />
                  </button>
                </Popconfirm>
              </div>
            ),
          },
        ]
      : type === "Album"
      ? [
          {
            title: "Image",
            dataIndex: "image", // sử dụng album.image
            key: "image",
            width: 150,
            ...alignCenter,
            render: (text) => (
              <div>
                <img src={text} alt="Album" className="w-full h-auto" />
              </div>
            ),
          },
          {
            title: "Name",
            dataIndex: "name", // sử dụng album.title
            key: "name",
            width: 150,
            ...alignCenter,
          },
          {
            title: "Release Year",
            dataIndex: "release_year", // sử dụng album.release_year
            key: "release_year",
            width: 150,
            ...alignCenter,
          },
          {
            title: "Artist Name",
            dataIndex: "artist", // sử dụng album.release_year
            key: "artist",
            width: 150,
            ...alignCenter,
          },
          {
            title: "Like",
            dataIndex: "like", // sử dụng album.likes
            key: "like",
            width: 150,
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
                  title="Delete the Album"
                  description="Are you sure to delete this album?"
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
        ]
      : [
          {
            title: "Image",
            width: 150,
            dataIndex: "image",
            key: "image",
            ...alignCenter,
            render: (text) => (
              <div>
                <img src={text} alt="Single" className="w-full h-auto" />
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
            dataIndex: "release_year", // Lưu ý: Sử dụng release_year theo mapping
            key: "release_year",
            ...alignCenter,
          },
          {
            title: "Like",
            width: 150,
            dataIndex: "like",
            key: "like",
            ...alignCenter,
          },
          {
            title: "Artist",
            width: 150,
            dataIndex: "artist",
            key: "artist",
            ...alignCenter,
          },
          {
            title: "Album",
            width: 150,
            dataIndex: "album",
            key: "album",
            ...alignCenter,
          },
          {
            title: "Listen Count",
            width: 150,
            dataIndex: "count_listen",
            key: "count_listen",
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
                  title="Delete the Single"
                  description="Are you sure to delete this single?"
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
            {type === "Artist"
              ? "Create Artist"
              : type === "Album"
              ? "Create Album"
              : "Create Single"}
          </Button>

          <Select
            value={type}
            className="ml-10"
            onChange={handleTypeFilter}
            style={{ width: 150 }}
          >
            <Option value="Artist">Artist</Option>
            <Option value="Album">Album</Option>
            <Option value="Single">Single</Option>
          </Select>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Layout>

      {/* Modal Create Album, Artist, Single */}
      <Modal
        open={isModalVisible}
        className="text-center"
        title={
          <h2 className="text-2xl font-bold text-[#f18966] animate-slideIn">
            {type === "Artist"
              ? "Create New Artist"
              : type === "Album"
              ? "Create New Album"
              : "Create New Single"}
          </h2>
        }
        onCancel={handleCancel}
        footer={null}
      >
        <Formik
          // Đặt initialValues dựa theo type
          initialValues={
            type === "Artist"
              ? { name: "", avatar: null }
              : type === "Album"
              ? { title: "", artist_id: null, release_year: "", image: null }
              : {
                  title: "",
                  release_year: "",
                  artist_id: null,
                  album_id: null,
                  image: null,
                  mp3: null,
                }
          }
          // Lưu ý: validationSchema cũng nên được cấu hình lại theo từng type nếu cần
          validationSchema={
            type === "Artist"
              ? artistValidationSchema
              : type === "Album"
              ? albumValidationSchema
              : singleValidationSchema
          }
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              if (type === "Artist") {
                // Dữ liệu của Artist: name và avatar
                formData.append("name", values.name);
                formData.append("avatar", values.avatar);
                const response = await artistApi.postCreateArtist(formData);
                if (response.status === 200) {
                  message.success("Artist created successfully!");
                  handleCancel(); // Đóng modal
                }
              } else if (type === "Album") {
                // Dữ liệu của Album: title, artist_id, release_year và image
                formData.append("title", values.title);
                formData.append("artist_id", values.artist_id);
                formData.append("release_year", values.release_year);
                formData.append("image", values.image);
                const response = await albumApi.postCreateAlbum(formData);
                if (response.status === 200) {
                  message.success("Album created successfully!");
                  handleCancel(); // Đóng modal
                }
              } else {
                // Single: giữ nguyên code cũ
                formData.append("title", values.title);
                formData.append("release_year", values.release_year);
                formData.append("artist_id", values.artist_id);
                formData.append("album_id", values.album_id);
                formData.append("image", values.image);
                formData.append("mp3", values.mp3);
                const response = await singleApi.postCreateSingle(formData);
                if (response.status === 200) {
                  message.success("Single created successfully!");
                  handleCancel(); // Đóng modal
                }
              }
            } catch (error) {
              console.error("Error creating entity:", error);
              message.error("An error occurred while adding the entity.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="mt-5">
              {type === "Artist" ? (
                // Form của Artist: chỉ có Name và Avatar Upload
                <>
                  <div className="flex flex-col space-y-4">
                    <div className="flex-input-tnvd">
                      <label className="label-input-tnvd">Name:</label>
                      <Field name="name" as={Input} className="w-full py-2" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error text-red-500 ml-1"
                      />
                    </div>
                    <div className="flex-input-tnvd">
                      <label className="label-input-tnvd">Avatar:</label>
                      <Upload
                        name="avatar"
                        listType="picture"
                        beforeUpload={(file) => {
                          setFieldValue("avatar", file);
                          return false; // Ngăn chặn upload tự động
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click to upload
                        </Button>
                      </Upload>
                      <ErrorMessage
                        name="avatar"
                        component="div"
                        className="error text-red-500 ml-1"
                      />
                    </div>
                  </div>
                  <button
                    className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create Artist
                  </button>
                </>
              ) : type === "Album" ? (
                // Form của Album: Title, Release Year, Artist và Image Upload
                <>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Title:</label>
                        <Field
                          name="title"
                          as={Input}
                          className="w-full py-2"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">
                          Release Year:
                        </label>
                        <Field
                          name="release_year"
                          as={Input}
                          className="w-full py-2"
                        />
                        <ErrorMessage
                          name="release_year"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Artist:</label>
                        <Select
                          className="w-full"
                          placeholder="Choose Artist"
                          onChange={(value) =>
                            setFieldValue("artist_id", value)
                          }
                        >
                          {artist.map((artist) => (
                            <Option key={artist.id} value={artist.id}>
                              <img
                                src={artist.avatar}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              {artist.name}
                            </Option>
                          ))}
                        </Select>
                        <ErrorMessage
                          name="artist_id"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Image:</label>
                        <Upload
                          name="image"
                          listType="picture"
                          beforeUpload={(file) => {
                            setFieldValue("image", file);
                            return false; // Ngăn chặn upload tự động
                          }}
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to upload
                          </Button>
                        </Upload>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create Album
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Title:</label>
                        <Field
                          name="title"
                          as={Input}
                          className="w-full py-2"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">
                          Release Year:
                        </label>
                        <Field
                          name="release_year"
                          as={Input}
                          className="w-full py-2"
                        />
                        <ErrorMessage
                          name="release_year"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Image:</label>
                        <Upload
                          name="image"
                          listType="picture"
                          beforeUpload={(file) => {
                            setFieldValue("image", file);
                            return false; // Ngăn chặn upload tự động
                          }}
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to upload
                          </Button>
                        </Upload>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Artist:</label>
                        <Select
                          className="w-full"
                          placeholder="Choose Artist"
                          onChange={(value) =>
                            setFieldValue("artist_id", value)
                          }
                        >
                          {artist.map((artist) => (
                            <Option key={artist.id} value={artist.id}>
                              <img
                                src={artist.avatar}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              {artist.name}
                            </Option>
                          ))}
                        </Select>
                        <ErrorMessage
                          name="artist_id"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">Album:</label>
                        <Select
                          className="w-full"
                          placeholder="Choose Album"
                          onChange={(value) => setFieldValue("album_id", value)}
                        >
                          {album.map((album) => (
                            <Option key={album.id} value={album.id}>
                              <img
                                src={album.image}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              {album.title}
                            </Option>
                          ))}
                        </Select>
                        <ErrorMessage
                          name="album_id"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                      <div className="flex-input-tnvd">
                        <label className="label-input-tnvd">MP3:</label>
                        <Upload
                          accept=".mp3"
                          onChange={(info) => {
                            if (info.fileList.length > 0) {
                              const file = info.fileList[0];
                              setFieldValue("mp3", file.originFileObj);
                            } else {
                              setFieldValue("mp3", null);
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
                        <ErrorMessage
                          name="mp3"
                          component="div"
                          className="error text-red-500 ml-1"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-end text-base bg-[#679089] text-white px-6 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-[#679089]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create Single
                  </button>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

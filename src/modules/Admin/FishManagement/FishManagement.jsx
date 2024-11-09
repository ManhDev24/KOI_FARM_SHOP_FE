import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Search from "antd/es/input/Search";
import {
  Button,
  Col,
  Modal,
  Pagination,
  Row,
  Table,
  Tag,
  Space,
  Select,
  Input,
  Upload,
  message,
  Image,
  Typography,
  Divider,
} from "antd";
import {
  StopOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FishApi from "../../../apis/Fish.api";
import LoadingModal from "../../Modal/LoadingModal";
const { Title, Text } = Typography;
import { Link } from "react-router-dom";
import _ from "lodash";

const validationSchema = yup.object().shape({
  category: yup.string().required("Danh mục là bắt buộc"),
  age: yup.number().typeError("Tuổi phải là số").required("Tuổi là bắt buộc").min(0, "Tuổi không thể âm"),
  size: yup.number().typeError("Kích thước phải là số").required("Kích thước là bắt buộc").min(0, "Kích thước không thể âm"),
  personality: yup.string().required("Tính cách là bắt buộc"),
  origin: yup.string().required("Nguồn gốc là bắt buộc"),
  price: yup.number().typeError("Giá phải là số").required("Giá là bắt buộc").min(0, "Giá không thể âm"),
  gender: yup.boolean().required("Giới tính là bắt buộc"),
  purebred: yup.number().typeError("Độ Thuần chủng phải là Thuần chủng hoặc F1").required("Thuần chủng là bắt buộc"),
  food: yup.string().required("Đồ ăn là bắt buộc"),
  name: yup.string().required("Tên của chứng chỉ là bắt buộc"),
  water: yup.string().required("Nước là bắt buộc"),
  health: yup.string().required("Sức khỏe là bắt buộc"),
  temperature: yup.string().required("Nhiệt độ nước là bắt buộc"),
  ph: yup.string().required("pH nước là bắt buộc"),
});

const FishManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isModalDetailFishOpen, setIsModalDetailFishOpen] = useState(false);
  const [dataDetailFish, setDataDetailFish] = useState(null);

  const [dataEdit, setDataEdit] = useState(null);
  const [dataView, setDataView] = useState(null);
  const [image, setImage] = useState(undefined);
  const [imageCertificate, setImageCertificate] = useState(undefined);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState(1);

  const queryClient = useQueryClient();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên cá",
      key: "fishName",
      render: (record) => {
        return `${record.origin} - Tuổi: ${record.age} - Kích thước: ${record.size} cm`;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "koiImage",
      key: "koiImage",
      render: (image) => {
        return image ? (
          <Image src={image} alt="koi" style={{ width: 100, height: 100 }} />
        ) : (
          "No Image"
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Kích thước (cm)",
      dataIndex: "size",
      key: "size",
    },
    // {
    //   title: "Tính cách",
    //   dataIndex: "personality",
    //   key: "personality",
    // },
    {
      title: "Nguồn gốc",
      dataIndex: "origin",
      key: "origin",
    },
    // {
    //   title: "Chế độ ăn",
    //   dataIndex: "food",
    //   key: "food",
    // },
    // {
    //   title: "Độ cứng nước",
    //   dataIndex: "water",
    //   key: "water",
    // },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Thuần chủng",
      dataIndex: "purebred",
      key: "purebred",
      render: (purebred) => {
        return purebred ? "Thuần chủng" : "F1";
      },
    },
    // {
    //   title: "Sức khỏe",
    //   dataIndex: "health",
    //   key: "health",
    // },
    // {
    //   title: "Nhiệt độ nước",
    //   dataIndex: "temperature",
    //   key: "temperature",
    // },
    // {
    //   title: "pH nước",
    //   dataIndex: "ph",
    //   key: "ph",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Còn Hàng", value: 1 },
        { text: "Đã Bán", value: 2 },
        { text: "Ký Gửi", value: 3 },
        { text: "Chờ Duyệt Đơn Ký Gửi", value: 4 },
        { text: "Ký gửi chăm sóc", value: 5 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        switch (status) {
          case 1:
            return <Tag color="lime">Còn Hàng</Tag>;
          case 2:
            return <Tag color="blue">Đã Bán</Tag>;
          case 3:
            return <Tag color="orange">Ký Gửi</Tag>;
          case 4:
            return <Tag color="purple">Chờ Duyệt Đơn Ký Gửi</Tag>;
          case 5:
            return <Tag color="red">Ký gửi chăm sóc</Tag>;
          default:
            return <Tag color="default">Không xác định</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              showModalView();
              setDataView(record);
            }}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => onEditFish(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => showModalDetailView(record)}
            style={{
              backgroundColor: "#d9d9d9",
              color: "#000",
            }}
          >
            Thông số chi tiết
          </Button>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          onChange={(value) => {
            onStatusChange(record.id);
            setStatus(value);
          }}
          style={{ width: 150 }}
          options={[
            { value: 1, label: "Còn Hàng" },
            { value: 2, label: "Đã Bán" },
            { value: 3, label: "Ký Gửi" },
            { value: 4, label: "Chờ Duyệt Đơn Ký Gửi" },
            { value: 5, label: "Ký gửi chăm sóc" },
          ]}
        />
      ),
    },
  ];

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    setValue("koiImage", null);
    setImage(undefined);
  };
  const onStatusChange = (id, status) => {

    handleChangeStatusFish(id);
  };

  const showModal = () => {
    setIsModalOpen(true);
    reset({
      category: "",
      age: "",
      size: "",
      personality: "",
      price: "",
      origin: "",
      gender: true,
      name: "",
      food: "",
      water: "",
      status: 1,
      purebred: true,
      health: "",
      temperature: "",
      ph: "",
      certificate: "",
      koiImage: "",
    });
    setDataEdit(null);
    setImage(undefined);
    setImageCertificate(undefined);
  };
  const showModalView = () => {
    setIsModalViewOpen(true);
  };
  const showModalDetailView = (record) => {
    setIsModalDetailFishOpen(true);
    setDataDetailFish(record);
  };

  const cancelModalView = () => {
    setIsModalViewOpen(false);
  };
  const cancelModalDetailView = () => {
    setIsModalDetailFishOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
    setDataEdit(null);
    setImage(undefined);
    setImageCertificate(undefined);
  };

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: "",
      age: "",
      size: "",
      personality: "",
      price: "",
      origin: "",
      gender: true,
      name: "",
      food: "",
      water: "",
      status: 1,
      purebred: 1,
      health: "",
      temperature: "",
      ph: "",
      image: null,
      koiImage: null,
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  // const watchhinhAnh = watch("koiImage");
  // const watchCertificate = watch("certificate");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchFish = async ({ queryKey }) => {
    const [_key, page, search] = queryKey;
    if (search) {
      return await FishApi.searchFish(search, page);
    } else {
      return await FishApi.getListFish(page);
    }
  };
  const {
    data: ListKoi,
    isLoading: isLoadingListKoi,
    isError: isErrorListKoi,
  } = useQuery({
    queryKey: ["ListKoi", currentPage, debouncedQuery],
    queryFn: fetchFish,
  });

  const {
    mutate: handleAddFish,
    isLoading: isLoadingAddFish,
    isError: isErrorAddFish,
  } = useMutation({
    mutationFn: (data) => FishApi.addFish(data),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries(["ListKoi"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Có lỗi xảy ra, vui lòng thử lại";
      message.error(errorMessage);
    },
  });
  const {
    mutate: handleUpdateFish,
    isLoading: isLoadingUpdateFish,
    isError: isErrorUpdateFish,
  } = useMutation({
    mutationFn: (data) => FishApi.updateFish(data, dataEdit?.id),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries(["ListKoi"]);
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Có lỗi xảy ra, vui bạn thử được thuật toán";
      message.error(errorMessage);
    },
  });
  const {
    mutate: handleChangeStatusFish,
    isLoading: isLoadingChangeStatusFish,
    isError: isErrorChangeStatusFish,
  } = useMutation({
    mutationFn: (id) => FishApi.changeStatus(id, status),
    onSuccess: () => {
      message.success("Chỉnh sửa trạng thái thành công");
      queryClient.invalidateQueries(["ListKoi"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Lỗi rồi!";
      message.error(errorMessage);
    },
  });

  const onSubmit = (payload) => {
    const data = { ...payload, pH: payload?.ph };

    const formData = new FormData();

    const file = data.koiImage;
    const fileCertificate = data?.image || "";
    if (fileCertificate) {
      formData.append("image", fileCertificate);
    }
    formData.append("koiImage", file);
    formData.append("categoryId", data.category);
    formData.append("age", data.age);
    formData.append("size", data.size);
    formData.append("origin", data.origin);
    formData.append("personality", data.personality);
    formData.append("price", data.price);
    formData.append("gender", data.gender);
    formData.append("status", data.status);
    formData.append("purebred", data.purebred);
    formData.append("health", data.health);
    formData.append("food", data.food);
    formData.append("water", data.water);
    formData.append("temperature", data.temperature);
    formData.append("pH", data.ph);
    formData.append("name", "");
    formData.append("createdDate", new Date().toISOString());
    formData.append("name", data.name);
    if (dataEdit) {
      if (!image) {
        const { koiImage, ...rest } = data;

        const dataToEdit = {
          status,
          ...rest,
          categoryId: data?.category,
          createdDate: new Date().toISOString(),
        };

        handleUpdateFish(dataToEdit);
      } else {
        const dataToEdit = { ...data, Status: 1, categoryId: data?.category };

        handleUpdateFish(dataToEdit);
      }
    } else {
      handleAddFish(formData);
    }
  };
  const onDetailFish = (record) => {
    showModalView();
    setDataView(record);
  };
  const fetchImageAsBinary = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const onEditFish = async (record) => {
    console.log('record: ', record);
    showModal();
    setDataEdit(record);
    reset({
      category: record?.categoryId,
      age: record.age,
      size: record.size,
      origin: record.origin,
      gender: record.gender,
      personality: record.personality,
      price: record.price,
      status: record.status,
      purebred: record.purebred,
      health: record.health,
      food: record.food,
      name: record?.certificate?.name,
      water: record.water,
      temperature: record.temperature,
      ph: record.ph,
      certificate: record.certificate,
      koiImage: record?.koiImage,
    });
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
      if (imageCertificate) URL.revokeObjectURL(imageCertificate);
    };
  }, [image, imageCertificate]);

  const onSubmitBanFish = async (id, currentStatus) => {
    try {
      await FishApi.toggleFishStatus(id, !currentStatus);
      message.success(
        currentStatus ? "Đã ban cá thành công" : "Đã unban cá thành công"
      );
      queryClient.invalidateQueries(["ListKoi"]);
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  const {
    data: ListCategory,
    isLoading: isLoadingListCategory,
    isError: isErrorListCategory,
  } = useQuery({
    queryKey: ["ListCategory"],
    queryFn: () => FishApi.getCategories(),
  });
  console.log('ListCategory: ', ListCategory);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    e.stopPropagation();
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);
      setValue("koiImage", file);
    }
  };

  if (
    isLoadingListKoi ||
    isLoadingListCategory ||
    isLoadingAddFish ||
    isLoadingChangeStatusFish
  ) {
    return <LoadingModal />;
  }

  if (
    isErrorListKoi ||
    isErrorListCategory ||
    isErrorAddFish ||
    isErrorChangeStatusFish
  ) {
    return <div>Error</div>;
  }

  const totalElements = ListKoi?.totalElements;
  const totalPages = ListKoi?.totalPages;

  return (
    <div className="flex flex-col justify-center items-center  ">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập tên nguồn gốc , kích thước hoặc tuổi ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <div className="flex flex-col mt-2 w-full">
        <div className="w-full flex justify-start">
          <Button
            onClick={showModal}
            danger
            className="flex justify-center items-center"
            icon={<PlusOutlined />}
          >
            Thêm Cá
          </Button>
        </div>
        <div className="mt-3">
          <div className="overflow-x-auto scrollbar-custom">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={
                ListKoi?.koiFishReponseList || ListKoi?.data?.koiFishReponseList
              }
              pagination={false}
              loading={isLoadingListKoi}
            />
          </div>
          <div className="flex justify-end mt-2 mb-2">
            <Pagination
              current={currentPage}
              total={totalElements}
              pageSize={9}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <Modal
        title={dataEdit ? "Chỉnh sửa cá" : "Thêm cá"}
        visible={isModalOpen}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit(onSubmit)}>
            {dataEdit ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Ảnh Cá</label>
              <Controller
                name="koiImage"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Upload
                    {...field}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={(info) => {
                      const file = info.file.originFileObj || info.file;
                      if (file) {
                        onChange(file);
                        setImage(URL.createObjectURL(file));
                      }
                    }}
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      {(value && value instanceof File) ||
                        image ||
                        dataEdit?.koiImage ? (
                        <>
                          <img
                            className="w-[60px] h-[80px] object-cover"
                            src={
                              value && value instanceof File
                                ? URL.createObjectURL(value)
                                : image || dataEdit?.koiImage
                            }
                            alt="koiImage"
                          />
                          <div
                            style={{
                              top: 30,
                              right: "140px",
                            }}
                            className="absolute "
                          >
                            <DeleteOutlined
                              onClick={() => {
                                onChange(null);
                                setImage(null);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </>
                      )}
                    </button>
                  </Upload>
                )}
              />
              {errors.koiImage && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.koiImage.message}
                </p>
              )}
            </Col>

            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Ảnh chứng nhận</label>
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Upload
                    {...field}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={(info) => {
                      const file = info.file.originFileObj || info.file;
                      if (file) {
                        onChange(file);
                        setImageCertificate(URL.createObjectURL(file));
                      }
                    }}
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      {(value && value instanceof File) ||
                        imageCertificate ||
                        dataEdit?.certificate?.image ? (
                        <>
                          <img
                            className="w-[60px] h-[80px] object-cover"
                            src={
                              value && value instanceof File
                                ? URL.createObjectURL(value)
                                : imageCertificate ||
                                dataEdit?.certificate?.image
                            }
                            alt="imageCertificate"
                          />
                          <div
                            style={{
                              top: 30,
                              right: "140px",
                            }}
                            className="absolute"
                          >
                            <DeleteOutlined
                              onClick={() => {
                                onChange(null);
                                setImageCertificate(null);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </>
                      )}
                    </button>
                  </Upload>
                )}
              />
              {errors.image && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.image.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Danh mục</label>
              <Controller
                name="category"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value === "" ? undefined : field.value} 
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder="--Danh mục--"
                    options={ListCategory?.map((item) => ({
                      value: item.id,
                      label: item.categoryName, 
                    }))}
                    allowClear 
                  />
                )}
              />
              {errors.category && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.category.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Giới tính</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder="Chọn danh mục"
                    options={[
                      { value: true, label: "Koi Đực" },
                      { value: false, label: "Koi cái" },
                    ]}
                  />
                )}
              />
              {errors.gender && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.gender.message}
                </p>
              )}
            </Col>

            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Tuổi (năm)</label>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Nhập tuổi cá"
                    className="mt-1"
                    status={errors.age ? "error" : ""}
                  />
                )}
              />
              {errors.age && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.age.message}
                </p>
              )}
            </Col>

            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Kích thước (cm)</label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Nhập kích thước cá"
                    className="mt-1"
                    status={errors.size ? "error" : ""}
                  />
                )}
              />
              {errors.size && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.size.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Nguồn gốc của cá</label>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập nguồn gốc của cá"
                    className="mt-1"
                    status={errors.origin ? "error" : ""}
                  />
                )}
              />
              {errors.origin && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.origin.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Tính cách</label>
              <Controller
                name="personality"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập tính cách"
                    className="mt-1"
                    status={errors.personality ? "error" : ""}
                  />
                )}
              />
              {errors.personality && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.personality.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Chứng chỉ của cá</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập Tên chứng chỉ của cá nếu có"
                    className="mt-1"
                    status={errors.name ? "error" : ""}
                  />
                )}
              />
              {errors.name && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.name.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Chế độ ăn</label>
              <Controller
                name="food"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập chế độ ăn cho cá"
                    className="mt-1"
                    status={errors.food ? "error" : ""}
                  />
                )}
              />
              {errors.food && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.food.message}
                </p>
              )}
            </Col>
            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Độ cứng nước</label>
              <Controller
                name="water"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập độ cứng nước cho cá"
                    className="mt-1"
                    status={errors.water ? "error" : ""}
                  />
                )}
              />
              {errors.water && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.water.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Giá</label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Nhập giá cá"
                    className="mt-1"
                    status={errors.price ? "error" : ""}
                  />
                )}
              />
              {errors.price && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.price.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Thuần chủng</label>
              <Controller
                name="purebred"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder="Chọn trạng thái"
                  >
                    <Select.Option value={0}>Thuần chủng</Select.Option>
                    <Select.Option value={1}>F1</Select.Option>
                  </Select>
                )}
              />
              {errors.purebred && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.purebred.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Sức khỏe</label>
              <Controller
                name="health"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: [khỏe, bình thường, tốt]"
                    className="mt-1"
                    status={errors.health ? "error" : ""}
                  />
                )}
              />
              {errors.health && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.health.message}
                </p>
              )}
            </Col>

            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Nhiệt độ nước</label>
              <Controller
                name="temperature"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: 22°C - 28°C"
                    className="mt-1"
                    status={errors.temperature ? "error" : ""}
                  />
                )}
              />
              {errors.temperature && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.temperature.message}
                </p>
              )}
            </Col>

            <Col span={12}>
              <label style={{ fontSize: "16px" }}>pH nước</label>
              <Controller
                name="ph"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: 7.0 - 7.5"
                    className="mt-1"
                    status={errors.ph ? "error" : ""}
                  />
                )}
              />
              {errors.ph && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.ph.message}
                </p>
              )}
            </Col>
          </Row>
        </form>
      </Modal>

      <Modal
        visible={isModalViewOpen}
        footer={null}
        onCancel={cancelModalView}
        className="flex justify-center items-center"
      >
        <Col key={dataView?.id} className="w-[250px] h-[645px] mx-10 mb-10">
          <div className="relative w-[250px]">
            <div
              className="absolute border-[1px] border-[#FA4444] w-[86px] 
                                                bg-[#FFFFFF] rounded-ee-[10px] 
                                                rounded-tl-[5px] text-center 
                                                text-[#FA4444]"
            >
              {dataView?.status === 1
                ? "Đang bán"
                : dataView?.status === 2
                  ? "Đã bán"
                  : null}
            </div>
            <div className="rounded-[10px]">
              <img
                src={dataView?.koiImage}
                className="w-[250px] h-[354px] rounded-t-[8px] box-border"
                alt={dataView?.category}
                style={{ width: "250px" }}
              />
            </div>
          </div>
          <div className="flex flex-col w-[250px] h-[300px] bg-[#FFFFFF] border border-t-0 border-x-2 border-b-2 border-[#FA4444] rounded-b-[10px]">
            <h1 className="my-0 mx-auto text-[#FA4444] font-bold text-[20px]">
              {dataView?.categoryName}
            </h1>
            <div className="my-[10px] mx-[10px]  ">
              <div className="flex flex-col ">
                <div className="h-8 text-lg font-bold flex justify-center text-[#FA4444] mb-4 ">
                  {dataView?.category} {dataView?.size} cm {dataView?.age} tuổi
                </div>
                <div className="h-7">Người bán: {dataView?.origin}</div>
                <div className="h-6">
                  Giới tính: {dataView?.gender ? "Koi Đực" : "Koi Cái"}
                </div>
                <div className="h-6">Tuổi: {dataView?.age}</div>
                <div className="h-6">Kích thước: {dataView?.size} cm</div>
                <div className="h-6">Nguồn gốc: {dataView?.origin}</div>
                <div className="h-6">Giống: {dataView?.category}</div>
              </div>
              <div className="text-center">
                <div className="my-[10px] text-[20px] font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dataView?.price)}
                </div>
                {dataView?.status !== 2 ? (
                  <Link>
                    <Button
                      // onClick={() => {
                      //   handleAddToCart(card);
                      // }}
                      className="w-[138px] h-[40px] text-[#FFFFFF] bg-[#FA4444] rounded-[10px]"
                    >
                      Đặt Mua
                    </Button>
                    <Link>
                      <div
                        className="absolute  top-[3px] right-[-5px] z-50" // Adjusted position: top right of the card
                      // onClick={(e) => {
                      //   handleAddToCompare(card);
                      // }}
                      >
                        <Button
                          onClick={(e) => {
                            handleAddToCompare(card);
                          }}
                          className="!p-0 !py-1 w-[100px] !border-0 h-fit hover:!border-[#FA4444] hover:!text-[#FA4444] flex justify-around"
                        >
                          <div className="flex justify-center items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              className="flex"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none" fillRule="evenodd">
                                <path
                                  d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z"
                                  fill="currentColor"
                                />
                              </g>
                            </svg>
                            <h5 className="mx-1 my-0 !text-center">So sánh</h5>
                          </div>
                        </Button>
                      </div>
                    </Link>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Col>
      </Modal>
      <Modal
        visible={isModalDetailFishOpen}
        footer={null}
        onCancel={cancelModalDetailView}
        style={{ borderRadius: "10px", overflow: "hidden" }}
        bodyStyle={{
          padding: "20px",
          borderRadius: "10px",
          background: "#f0f2f5",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
          Thông Tin Chi Tiết Cá Koi
        </Title>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Nhiệt độ của nước:</Text>{" "}
          <Text>{dataDetailFish?.temperature}°C</Text>
        </div>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Độ cứng của nước:</Text>{" "}
          <Text>{dataDetailFish?.water}</Text>
        </div>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Chế độ ăn của cá:</Text>{" "}
          <Text>{dataDetailFish?.food}</Text>
        </div>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Sức khỏe của cá:</Text>{" "}
          <Text>{dataDetailFish?.health}</Text>
        </div>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Tính cách của cá:</Text>{" "}
          <Text>{dataDetailFish?.personality}</Text>
        </div>
        <Divider />

        <div style={{ padding: "10px 0" }}>
          <Text strong>Độ ph của nước:</Text> <Text>{dataDetailFish?.ph}</Text>
        </div>
      </Modal>
    </div>
  );
};

export default FishManagement;

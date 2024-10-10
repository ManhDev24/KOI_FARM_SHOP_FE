import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Link } from "react-router-dom";

const validationSchema = yup.object().shape({
  // fishName: yup.string().required("Tên cá là bắt buộc"),
  category: yup.string().required("Danh mục là bắt buộc"),
  age: yup
    .number()
    .typeError("Tuổi phải là số")
    .required("Tuổi là bắt buộc")
    .min(0, "Tuổi không thể âm"),
  size: yup
    .number()
    .typeError("Kích thước phải là số")
    .required("Kích thước là bắt buộc")
    .min(0, "Kích thước không thể âm"),
  personality: yup.string().required("Tính cách là bắt buộc"),
  price: yup
    .number()
    .typeError("Giá phải là số")
    .required("Giá là bắt buộc")
    .min(0, "Giá không thể âm"),
  purebred: yup.boolean().required("Thuần chủng là bắt buộc"),
  health: yup.string().required("Sức khỏe là bắt buộc"),
  temperature: yup.string().required("Nhiệt độ nước là bắt buộc"),
  ph: yup.string().required("pH nước là bắt buộc"),
});

const FishManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [dataView, setDataView] = useState(null);
  console.log("dataView: ", dataView);
  const [image, setImage] = useState(undefined);

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
          <img src={image} alt="koi" style={{ width: 100, height: 100 }} />
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
    {
      title: "Tính cách",
      dataIndex: "personality",
      key: "personality",
    },
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
    {
      title: "Sức khỏe",
      dataIndex: "health",
      key: "health",
    },
    {
      title: "Nhiệt độ nước",
      dataIndex: "temperature",
      key: "temperature",
    },
    {
      title: "pH nước",
      dataIndex: "ph",
      key: "ph",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status ? (
          <Tag color="lime">Bình thường</Tag>
        ) : (
          <Tag color="red">Bị chặn</Tag>
        );
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
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => onEditFish(record)}
          >
            Edit
          </Button>
          <Button
            style={{
              backgroundColor: record.status ? "#ff4d4f" : "#52c41a",
              color: "white",
            }}
            icon={<StopOutlined />}
            onClick={() => onSubmitBanFish(record.id, record.status)}
          >
            {record.status ? "Ban" : "Unban"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    setValue("koiImage", null);
    setImage(undefined);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalView = () => {
    setIsModalViewOpen(true);
  };
  const cancelModalView = () => {
    setIsModalViewOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
    setDataEdit(null);
    setImage(undefined);
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
      category: 1,
      age: "",
      size: "",
      personality: "",
      price: "",
      status: true,
      purebred: true,
      health: "",
      temperature: "",
      ph: "",
      koiImage: null,
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const watchhinhAnh = watch("koiImage");

  const {
    data: ListKoi,
    isLoading: isLoadingListKoi,
    isError: isErrorListKoi,
  } = useQuery({
    queryKey: ["ListKoi", currentPage],
    queryFn: () => FishApi.getListFish(currentPage, 4),
  });

  useEffect(() => {
    if (dataEdit) {
      reset({
        fishName: dataEdit.fishName,
        category: dataEdit.category,
        age: dataEdit.age,
        size: dataEdit.size,
        personality: dataEdit.personality,
        price: dataEdit.price,
        purebred: dataEdit.purebred,
        health: dataEdit.health,
        temperature: dataEdit.temperature,
        ph: dataEdit.ph,
        koiImage: dataEdit.koiImage ? [dataEdit.koiImage] : null,
      });
      setImage(dataEdit.koiImage);
    }
  }, [dataEdit, reset]);

  const onSubmit = (data) => {
    console.log("data: ", data);
  };

  const onEditFish = (record) => {
    showModal();
    setDataEdit(record);
  };

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
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    e.stopPropagation();
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);
      setValue("koiImage", file);
    }
  };

  if (isLoadingListKoi || isLoadingListCategory) {
    return <LoadingModal />;
  }

  if (isErrorListKoi || isErrorListCategory) {
    return <div>Error</div>;
  }

  const totalElements = ListKoi?.totalElements;
  const totalPages = ListKoi?.totalPages;

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập tên hoặc email..."
          style={{ width: 300 }}
          allowClear
          onSearch={(value) => {
            // Implement search functionality if needed
            console.log("Search:", value);
          }}
        />
      </div>
      <div className="flex flex-col mt-2 w-full">
        <div className="w-full flex justify-start">
          <Button
            type="primary"
            onClick={showModal}
            danger
            className="flex justify-center items-center"
            icon={<PlusOutlined />}
          >
            Thêm Cá
          </Button>
        </div>
        <div className="mt-3">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={ListKoi?.koiFishReponseList}
            pagination={false}
          />
          <div className="flex justify-end mt-2">
            <Pagination
              current={currentPage}
              total={totalElements}
              pageSize={4}
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
            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Ảnh Cá</label>
              <Controller
                name="koiImage"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Upload
                    {...field}
                    name="koiImage"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={(infor) => {
                      onChange(infor.file);
                    }}
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      {watchhinhAnh || dataEdit ? (
                        <div>
                          <img
                            className="w-[60px] h-[80px] object-cover"
                            src={
                              image ||
                              (watchhinhAnh
                                ? URL.createObjectURL(new Blob([watchhinhAnh]))
                                : "https://via.placeholder.com/150")
                            }
                            alt=""
                          />
                          <div
                            //URL.createObjectURL(new Blob([watchhinhAnh])
                            className="absolute top-1 right-1"
                            onChange={handleChangeImage}
                          >
                            <DeleteOutlined
                              onClick={handleRemoveImage}
                            ></DeleteOutlined>
                          </div>
                        </div>
                      ) : (
                        <>
                          <PlusOutlined></PlusOutlined>
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

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Danh mục</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder="Chọn danh mục"
                  >
                    {ListCategory?.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.category && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.category.message}
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
                    <Select.Option value={true}>Thuần chủng</Select.Option>
                    <Select.Option value={false}>
                      Không thuần chủng
                    </Select.Option>
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
                <div className="h-7 text-lg font-bold flex justify-center text-[#FA4444] ">
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
    </div>
  );
};

export default FishManagement;

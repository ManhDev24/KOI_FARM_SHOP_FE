import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Col,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import {
  StopOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import { Controller, useForm } from "react-hook-form";
import FishApi from "../../../apis/Fish.api";
import { Link } from "react-router-dom";

const validationSchema = yup.object().shape({
  categoryID: yup.string().required("Danh mục là bắt buộc"),
  age: yup
    .number()
    .typeError("Tuổi phải là số")
    .required("Tuổi là bắt buộc")
    .min(0, "Tuổi không thể âm"),
  avgSize: yup.string().required("Kích thước là bắt buộc"),
  origin: yup.string().required("Nguồn gốc là bắt buộc"),
  price: yup
    .number()
    .typeError("Giá phải là số")
    .required("Giá là bắt buộc")
    .min(0, "Giá không thể âm"),
  purebred: yup
    .number()
    .typeError("Thuần chủng phải là số 0 hoặc 1")
    .oneOf([0, 1], "Thuần chủng phải là Thuẩn chủng hoặc F1")
    .required("Thuần chủng là bắt buộc"),

  food: yup.string().required("Đồ ăn là bắt buộc"),
  water: yup.string().required("Nước là bắt buộc"),
  health: yup.string().required("Sức khỏe là bắt buộc"),
  temperature: yup.string().required("Nhiệt độ nước là bắt buộc"),
  ph: yup.string().required("pH nước là bắt buộc"),
  quantity: yup
    .number()
    .typeError("Số lượng cá phải là số")
    .required("Số lượng cá là bắt buộc"),
});

const BathManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [dataView, setDataView] = useState(null);
  const [image, setImage] = useState(undefined);
  const [isModalDetailBatchOpen, setIsModalDetailBatchOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [dataDetailBatch, setDataDetailBatch] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState(1);

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryID: 1,
      origin: "",
      quantity: "",
      age: "",
      avgSize: "",
      price: "",
      purebred: true,
      status: 1,
      food: "",
      water: "",
      health: "",
      temperature: "",
      ph: "",
      batchImg: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchBatch = async ({ queryKey }) => {
    const [_key, page, search] = queryKey;
    if (search) {
      return await FishApi.searchBatch(search, page);
    } else {
      return await FishApi.getAllBatch(page, 4);
    }
  };

  const {
    data: listOfBatch,
    isLoading: isLoadingListOfBatch,
    isError: isErrorListOfBatch,
  } = useQuery({
    queryKey: ["listOfBatch", currentPage, debouncedQuery],
    queryFn: fetchBatch,
  });
  const total = listOfBatch?.data?.totalElements;

  const showModal = () => {
    setIsModalOpen(true);
  };
  const cancelModalView = () => {
    setIsModalViewOpen(false);
  };
  const showModalView = () => {
    setIsModalViewOpen(true);
  };
  const showModalDetailView = (record) => {
    setIsModalDetailBatchOpen(true);
    setDataDetailBatch(record);
  };
  const cancelModalDetailView = () => {
    setIsModalDetailBatchOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
    setDataEdit(null);
    setImage(undefined);
  };
  const onStatusChange = (id, status) => {
    handleChangeStatusBatch(id);
  };
  const {
    mutate: handleCreateBatch,
    isLoading: isLoadingCreateBatch,
    isError: isErrorCreateBatch,
  } = useMutation({
    mutationFn: (data) => FishApi.createBatch(data),
    onSuccess: (data) => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries(["listOfBatch"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Có lỗi xảy ra, vui lòng thử lại";
      message.error(errorMessage);
    },
  });
  const onSubmit = (payload) => {
    const data = { ...payload };
    const formData = new FormData();
    const file = data?.batchImg;
    formData.append("categoryId", data?.categoryID);
    formData.append("quantity", data?.quantity);
    formData.append("age", data?.age);
    formData.append("avgSize", data?.avgSize);
    formData.append("price", data?.price);
    formData.append("purebred", data?.purebred);
    formData.append("status", data?.status);
    formData.append("food", data?.food);
    formData.append("water", data?.water);
    formData.append("health", data?.health);
    formData.append("temperature", data?.temperature);
    formData.append("pH", data?.ph);
    formData.append("batchImg", file);
    formData.append("origin", data?.origin);
    formData.append("categoryID", data?.categoryID);
    if (dataEdit) {
      if (!image) {
        const { batchImg, ph, ...rest } = data;
        const dataEdit = { ...rest, pH: data.ph };
        handleUpdateBatchFish(dataEdit);
      } else {
        const dataToEdit = { ...data };
        handleUpdateBatchFish(dataToEdit);
      }
    } else {
      handleCreateBatch(formData);
    }
  };

  const onEditBatch = (record) => {
    showModal();
    setDataEdit(record);
    reset({
      categoryID: record?.categoryID,
      origin: record?.origin,
      quantity: record?.quantity,
      age: record?.age,
      avgSize: record?.avgSize,
      price: record?.price,
      purebred: record?.purebred,
      status: record?.status,
      food: record?.food,
      water: record?.water,
      health: record?.health,
      temperature: record?.temperature,
      ph: record?.ph,
      batchImg: record?.batchImg, // Đã sửa
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "batchID",
      key: "batchID",
    },
    {
      title: "Tên Lô cá",
      key: "fishName",
      render: (record) => {
        return `${record?.origin} - Tuổi: ${record?.age} - Kích thước: ${record?.avgSize} cm`;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "batchImg",
      key: "batchImg",

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
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Kích thước (cm)",
      dataIndex: "avgSize",
      key: "avgSize",
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
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        switch (status) {
          case 1:
            return <Tag color="lime">Còn Hàng</Tag>;
          case 2:
            return <Tag color="blue">Đã Bán</Tag>;
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
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => onEditBatch(record)}
          >
            Edit
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
            onStatusChange(record.batchID);
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
  const {
    mutate: handleUpdateBatchFish,
    isLoading: isLoadingUpdateBatchFish,
    isError: isErrorUpdateBatchFish,
  } = useMutation({
    mutationFn: (data) => FishApi.updateBatch(data, dataEdit?.batchID),
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
    data: ListCategory,
    isLoading: isLoadingListCategory,
    isError: isErrorListCategory,
  } = useQuery({
    queryKey: ["ListCategory"],
    queryFn: () => FishApi.getCategories(),
  });
  const {
    mutate: handleChangeStatusBatch,
    isLoading: isLoadingChangeStatusBatch,
    isError: isErrorChangeStatusBatch,
  } = useMutation({
    mutationFn: (id) => FishApi.changeStatusBatch(id, status),
    onSuccess: () => {
      message.success("Chỉnh sửa trạng thái thành công");
      queryClient.invalidateQueries(["ListKoi"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Lỗi rồi!";
      message.error(errorMessage);
    },
  });
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-[450px]">
        <Search
          placeholder="Nhập email để tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <div className="flex flex-col mt-2 w-full">
        <div className="w-full">
          <Button
            onClick={showModal}
            danger
            className="flex justify-center items-center"
          >
            <span>+</span>
            Thêm Lô
          </Button>
        </div>
        <div className="mt-3">
          <Table
            rowKey="batchID"
            columns={columns}
            dataSource={listOfBatch?.data?.batchReponses}
            pagination={false}
            isLoading={isLoadingListOfBatch}
          />
          <div className="flex justify-end mt-2">
            <Pagination
              defaultCurrent={currentPage}
              total={total}
              pageSize={4}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      <Modal
        title={dataEdit ? "Chỉnh sửa  Lô cá" : "Thêm Lô cá"}
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
              <label style={{ fontSize: "16px" }}>Ảnh Lô Cá</label>
              <Controller
                name="batchImg"
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
                      dataEdit?.batchImg ? (
                        <>
                          <img
                            className="w-[60px] h-[80px] object-cover"
                            src={
                              value && value instanceof File
                                ? URL.createObjectURL(value)
                                : image || dataEdit?.batchImg
                            }
                            alt="batchImg"
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
              {errors.batchImg && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.batchImg.message}
                </p>
              )}
            </Col>

            <Col span={24}>
              <label style={{ fontSize: "16px" }}>Danh mục</label>
              <Controller
                name="categoryID"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder="Chọn danh mục"
                    options={ListCategory?.map((item) => ({
                      value: item.id,
                      label: `${item.categoryName}`,
                    }))}
                  />
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
                name="avgSize"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập kích thước cá"
                    className="mt-1"
                    status={errors.avgSize ? "error" : ""}
                  />
                )}
              />
              {errors.avgSize && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.avgSize.message}
                </p>
              )}
            </Col>

            <Col span={12}>
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
            <Col span={12}>
              <label style={{ fontSize: "16px" }}>Số lượng cá trong lô</label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập nguồn gốc của cá"
                    className="mt-1"
                    status={errors.quantity ? "error" : ""}
                  />
                )}
              />
              {errors.quantity && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.quantity.message}
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
                src={dataView?.batchImg}
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
      <Modal
        visible={isModalDetailBatchOpen}
        footer={null}
        onCancel={cancelModalDetailView}
      >
        <h1>Nhiệt độ của nước :{dataDetailBatch?.temperature}</h1>
        <h1>Độ cứng của nước: {dataDetailBatch?.water}</h1>
        <h1>Chế độ ăn của cá: {dataDetailBatch?.food}</h1>
        <h1>Sức khỏe của cá: {dataDetailBatch?.health}</h1>
        <h1>Độ ph của nước: {dataDetailBatch?.ph}</h1>
      </Modal>
    </div>
  );
};

export default BathManagement;
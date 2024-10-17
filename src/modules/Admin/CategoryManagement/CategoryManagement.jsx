import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import Search from "antd/es/transfer/search";
import React, { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingModal from "../../Modal/LoadingModal";
import {
  StopOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import CategoryApi from "../../../apis/Category.api";
import { Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
const { Paragraph } = Typography;
const validationSchema = yup.object().shape({
  cateName: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .min(3, "Tên danh mục phải có ít nhất 3 ký tự"),
  description: yup
    .string()
    .required("Mô tả là bắt buộc")
    .max(500, "Mô tả không được quá 500 ký tự"),
  status: yup.boolean(),
});
const CategoryManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [dataEdit, setDataEdit] = useState(null);
  const [image, setImage] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [idFish, setIdFish] = useState();
  const queryClient = useQueryClient();

  const showModal = () => {
    setIsModalOpen(true);
    reset({
      cateName: "",
      description: "",
      cateImg: "",
      status: true,
    });
    setImage(undefined);
    setImageUrl(undefined);
    setDataEdit(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    reset({
      cateName: "",
      description: "",
      cateImg: "",
      status: true,
    });
    setImage(undefined);
    setIsChangeImage(false);
    setDataEdit(null);
  };
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cateName: "",
      description: "",
      cateImg: "",
      status: true,
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  const {
    data: ListCategory,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
  } = useQuery({
    queryKey: ["ListCategory", currentPage],
    queryFn: () => CategoryApi.getAllCategory(currentPage, 4),
  });

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      // Sau khi upload thành công, hiển thị hình ảnh
      setImageUrl(
        info.file.response?.url || URL.createObjectURL(info.file.originFileObj)
      );
    }
  };
  const watchCateogryImg = watch("cateImg");
  const totalElements = ListCategory?.data?.totalElements;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Giống cá",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Ảnh",
      dataIndex: "cateImg",
      key: "cateImg",
      render: (cateImg) => {
        return cateImg ? (
          <Image
            width={200}
            src={cateImg}
            fallback="data:image/png;base64,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"
          />
        ) : (
          "No Image"
        );
      },
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 550,
      render: (description) => (
        <Paragraph
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: "Xem thêm",
          }}
          style={{ width: "100%" }}
        >
          {description}
        </Paragraph>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status ? (
          <Tag color="lime">Bình thường</Tag>
        ) : (
          <Tag color="red">Ẩn</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            style={{
              backgroundColor: record.status ? "#ff4d4f" : "#52c41a",
              color: "white",
            }}
            icon={<StopOutlined />}
            onClick={() => handleUpdateStatusCategory(record.id)}
          >
            {record.status ? "Ẩn" : "Hiển thị"}
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              onEditFish(record);
              setIdFish(record.id);
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];
  const {
    mutate: handleCreateCategory,
    isLoading: isLoadingCreateCategory,
    isError: isErrorCreateCategory,
  } = useMutation({
    mutationFn: (data) => CategoryApi.addCategory(data),
    onSuccess: (data) => {
      message.success("Thêm danh mục thành công");
      queryClient.invalidateQueries(["ListCategory"]);
    },
  });
  const {
    mutate: handleUpdateStatusCategory,
    isLoading: isLoadingUpdateStatusCategory,
    isError: isErrorUpdateStatusCategory,
  } = useMutation({
    mutationFn: (id) => CategoryApi.deleteCategory(id),
    onSuccess: (data) => {
      message.success("Cập nhập trạng thái thành công");
      queryClient.invalidateQueries(["ListCategory"]);
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xử lý vui thúy được thuật toán";
      message.error(errorMessage);
    },
  });
  const {
    mutate: handleUpdateCategory,
    isLoading: isLoadingUpdateCategory,
    isError: isErrorUpdateCategory,
  } = useMutation({
    mutationFn: (data) => CategoryApi.updateCategory(data, dataEdit?.id),
    onSuccess: (data) => {
      message.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries(["ListCategory"]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã  xảy ra lỗi";
      message.error(errorMessage);
    },
  });
  if (
    isErrorCreateCategory ||
    isErrorUpdateCategory ||
    isErrorUpdateStatusCategory
  ) {
    return <div>Lỗi</div>;
  }
  if (
    isLoadingCreateCategory ||
    isLoadingUpdateCategory ||
    isLoadingUpdateStatusCategory
  ) {
    return <LoadingModal />;
  }

  const onSubmit = (data) => {
    console.log("data: ", data);
    const formData = new FormData();
    let file = data?.cateImg;
    if (!dataEdit) {
      formData.append("file", file);
    }

    formData.append("cateName", data?.cateName);
    formData.append("description", data?.description);
    if (!dataEdit) {
      formData.append("status", data?.status);
    }

    if (dataEdit) {
      formData.append("categoryName", data?.cateName);
      formData.append("categoryDescription", data?.description)
      formData.append("status", true);
      formData.append("imgFile",file)
      handleUpdateCategory(formData);
    } else {
      console.log("Tạo mới category với dữ liệu: ", data);
      handleCreateCategory(formData);
    }
  };

  const onEditFish = (data) => {
    console.log("data: ", data);
    showModal();
    setDataEdit(data);
    reset({
      cateName: data?.categoryName,
      description: data?.description,
      cateImg: data?.cateImg,
    });
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center ">
        <div className="w-[450px]">
          <Search placeholder="Nhập tên danh mục..." style={{ width: 300 }} />
        </div>
        <div className="flex flex-col mt-2 w-full">
          <div className="w-full">
            <Button
              onClick={showModal}
              danger
              className="flex justify-center items-center"
            >
              <span>+</span>
              Thêm danh mục
            </Button>
          </div>
          <div className="mt-3">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={ListCategory?.data?.categoryReponses}
              pagination={false}
              showSizeChanger={false}
              loading={isLoadingCategory}
            />
            <div className="flex justify-end mt-2">
              <Pagination
                defaultCurrent={currentPage}
                total={totalElements}
                pageSize={4}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
        <Modal
          title={dataEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[48, 15]} className="mt-6">
              <Col span={24}>
                <label style={{ fontSize: "16px" }}>Ảnh Cá</label>
                <Controller
                  name="cateImg"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Upload
                      {...field}
                      listType="picture-card"
                      className="avatar-uploader relative w-fit"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith("image/");
                        if (!isImage) {
                          message.error("Chỉ được phép tải lên tệp hình ảnh!");
                          return Upload.LIST_IGNORE;
                        }

                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                          message.error("Ảnh phải có kích thước nhỏ hơn 2MB!");
                          return Upload.LIST_IGNORE;
                        }

                        onChange(file);
                        setImage(URL.createObjectURL(file));

                        return false;
                      }}
                      onChange={(info) => {
                        setIsChangeImage(true);
                        const file = info.file.originFileObj || info.file;
                        if (file) {
                          onChange(file); // Lưu hình ảnh mới
                          setImage(URL.createObjectURL(file)); // Hiển thị ảnh mới
                        }
                      }}
                    >
                      <button
                        style={{ border: 0, background: "none" }}
                        type="button"
                      >
                        {(value && value instanceof File) ||
                        image ||
                        dataEdit?.cateImg ? (
                          <>
                            <img
                              className="w-[60px] h-[80px] object-cover"
                              src={
                                value && value instanceof File
                                  ? URL.createObjectURL(value) 
                                  : image || dataEdit?.cateImg 
                              }
                              alt="koiImage"
                            />
                            <div className="absolute top-0 right-0">
                              <DeleteOutlined
                                onClick={() => {
                                  onChange(null); // Xóa ảnh nếu cần
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

                {errors.cateImg && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.cateImg.message}
                  </p>
                )}
              </Col>
              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Tên danh mục
                </label>
                <Controller
                  name="cateName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nhập Tên danh mục"
                      className="mt-1"
                      status={errors.cateName ? "error" : ""}
                    />
                  )}
                />
                {errors.cateName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cateName.message}
                  </p>
                )}
              </Col>
              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Mô tả của danh mục
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      status={errors.description ? "error" : ""}
                      placeholder="Nhập mô tả"
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </Col>
              <Col span={24} className="flex justify-end">
                <Button htmlType="submit" type="primary" className="me-2">
                  {dataEdit ? "Cập nhật" : "Tạo danh mục"}
                </Button>
                <Button onClick={handleCancel}>Hủy</Button>
              </Col>
            </Row>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;

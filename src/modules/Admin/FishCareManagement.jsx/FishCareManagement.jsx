import React, { useState } from "react";
import {
  Button,
  Col,
  Modal,
  Pagination,
  Table,
  Tag,
  Space,
  Image,
  Input,
  Tooltip,
  Spin,
  Row,
  message,
} from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConsignmentApi } from "../../../apis/Consignment.api";
import { Controller, useForm } from "react-hook-form";

const validationSchema = yup.object().shape({
  healthStatus: yup
    .string()
    .required("Tình trạng sức khỏe không được để trống"),
  growthStatus: yup
    .number()
    .typeError("Độ dài của cá phải là số")
    .required("Độ dài của cá khi nuôi không được để trống"),
  careEnvironment: yup
    .string()
    .required("Nôi trường chăm sóc không được để trống"),
  note: yup.string().required("Ghi chú không được để trống"),
});

const FishCareManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalDetailFishOpen, setIsModalDetailFishOpen] = useState(false);
  const [isModalAddHealthOpen, setIsModalAddHealthOpen] = useState(false);
  const [dataDetailFish, setDataDetailFish] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: ListFishCare,
    isPending: isLoadingListFishCare,
    isError: isErrorListFishCare,
  } = useQuery({
    queryKey: ["ListFishCare", currentPage],
    queryFn: () => ConsignmentApi.getAllFishCare(currentPage, 7),
  });
  console.log('ListFishCare: ', ListFishCare);

  const { mutate: addHeathForKoi, isPending: isAddingHealth } = useMutation({
    mutationFn: (data) => ConsignmentApi.addHeathForKoi(data),
    onSuccess: () => {
      setIsModalAddHealthOpen(false);
      message.success("Thêm tinh trạng sức khỏe thành công");
      queryClient.invalidateQueries({ queryKey: ["ListFishCare"] });
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
      message.error(errorMessage);
    },
  });
  const { mutate: updateHealthForKoi, isPending: isUpdatingHealth } =
    useMutation({
      mutationFn: (data) => ConsignmentApi.editHeathForKoi(data),
      onSuccess: () => {
        setIsModalAddHealthOpen(false);
        message.success("Cập nhật tinh trạng sức khỏe thành công");
        queryClient.invalidateQueries({ queryKey: ["ListFishCare"] });
      },
      onError: (error) => {
        const errorMessage = error?.message || "Đã có lỗi xảy ra vui bạn !!!";
        message.error(errorMessage);
      },
    });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      healthStatus: "",
      growthStatus: "",
      careEnvironment: "",
      note: "",
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });
  if (isLoadingListFishCare || isAddingHealth || isUpdatingHealth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <Spin size="large" />
      </div>
    );
  }

  const cancelModalDetailView = () => {
    setIsModalDetailFishOpen(false);
  };

  const onSubmitHealth = (data) => {
    const payload = {
      koiCareId: dataDetailFish.id,
      ...data,
    };
    if (isEditMode) {
      updateHealthForKoi(payload); 
    } else {
      addHeathForKoi(payload); 
    }
  };
  const handleAddHealth = (record) => {
    setDataDetailFish(record);
    setIsModalAddHealthOpen(true);
  };
  const handleEditHealth = (record) => {
    setIsEditMode(true);
    reset({
      healthStatus: record?.healthcare?.healthStatus || "",
      growthStatus: record?.healthcare?.growthStatus || "",
      careEnvironment: record?.healthcare?.careEnvironment || "",
      note: record?.healthcare?.note || "",
    });
    setDataDetailFish(record);
    setIsModalAddHealthOpen(true);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Tên cá",
      key: "fishName",
      render: (record) => (
        <Tooltip title={`Nguồn gốc: ${record.origin}`}>
          {`${record.origin} - Tuổi: ${record.age} - Kích thước: ${record.size} cm`}
        </Tooltip>
      ),
      width: 250,
    },
    {
      title: "Ảnh",
      dataIndex: "koiImage",
      key: "koiImage",
      render: (image) => (
        <Image src={image} alt="koi" style={{ width: 80, height: 80 }} />
      ),
      width: 100,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
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
      width: 120,
    },
    {
      title: "Thuần chủng",
      dataIndex: "purebred",
      key: "purebred",
      render: (purebred) => {
        return purebred ? (
          <Tag color="green">Thuần chủng</Tag>
        ) : (
          <Tag color="orange">F1</Tag>
        );
      },
      width: 120,
    },
    {
      title: "Sức khỏe",
      dataIndex: ["healthcare", "healthStatus"],
      key: "healthStatus",
      render: (healthStatus) => {
        return healthStatus ? (
          <p>{healthStatus}</p>
        ) : (
          <p>Chưa thêm tình trạng</p>
        );
      },
      width: 150,
    },
    {
      title: "Phát triển",
      dataIndex: ["healthcare", "growthStatus"],
      key: "growthStatus",
      render: (growthStatus) => {
        return growthStatus ? (
          <p>{growthStatus}</p>
        ) : (
          <p>Chưa thêm tình trạng</p>
        );
      },
      width: 150,
    },
    {
      title: "Môi trường",
      dataIndex: ["healthcare", "careEnvironment"],
      key: "careEnvironment",
      render: (careEnvironment) => {
        return careEnvironment ? (
          <Tooltip title={careEnvironment}>
            {careEnvironment.length > 20
              ? `${careEnvironment.slice(0, 20)}...`
              : careEnvironment}
          </Tooltip>
        ) : (
          <p>Chưa thêm tình trạng</p>
        );
      },
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: ["healthcare", "note"],
      key: "note",
      render: (note) => {
        return note ? (
          <Tooltip title={note}>
            {note.length > 20 ? `${note.slice(0, 20)}...` : note}
          </Tooltip>
        ) : (
          "Chưa thêm tình trạng"
        );
      },
      width: 200,
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
              setIsModalDetailFishOpen(true);
              setDataDetailFish(record);
            }}
          >
            Xem
          </Button>

          {!record.healthcare.checked ? (
            <Button type="default" onClick={() => handleAddHealth(record)}>
              Thêm tình trạng
            </Button>
          ) : (
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditHealth(record)}
            >
              Cập nhật tình trạng cá
            </Button>
          )}
        </Space>
      ),
      width: 200,
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-[450px]">
          <Input.Search
            placeholder="Nhập tên hoặc email..."
            style={{ width: 300 }}
            allowClear
            onSearch={(value) => {
              console.log("Search:", value);
            }}
          />
        </div>
        <div className="flex flex-col mt-2 w-full">
          <div className="w-full flex justify-start">
            <Button
              onClick={() => setIsModalOpen(true)}
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
                dataSource={ListFishCare?.data?.koiFishReponseList || []} // Use data from API
                pagination={false}
                loading={isLoadingListFishCare}
              />
            </div>
            <div className="flex justify-end mt-2 mb-2">
              <Pagination
                current={currentPage}
                total={ListFishCare?.data?.totalElements || 0}
                pageSize={7}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
        <Modal
          visible={isModalDetailFishOpen}
          footer={null}
          onCancel={cancelModalDetailView}
        >
          <h1>Nguồn gốc: {dataDetailFish?.origin}</h1>
          <h1>Chế độ ăn: {dataDetailFish?.food}</h1>
          <h1>Nhiệt độ nước: {dataDetailFish?.temperature}</h1>
          <h1>Độ pH nước: {dataDetailFish?.ph}</h1>
          <h1>Tính cách: {dataDetailFish?.personality}</h1>
        </Modal>
        <Modal
          title="Thêm tình trạng sức khỏe cho cá"
          visible={isModalAddHealthOpen}
          footer={null}
          onCancel={() => setIsModalAddHealthOpen(false)}
        >
          <form onSubmit={handleSubmit(onSubmitHealth)}>
            <Row gutter={[24, 15]}>
              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Tình trạng sức khỏe
                </label>
                <Controller
                  name="healthStatus"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nhập tình trạng sức khỏe"
                      className="mt-1"
                      status={errors.healthStatus ? "error" : ""}
                    />
                  )}
                />
                {errors.healthStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.healthStatus.message}
                  </p>
                )}
              </Col>

              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Tình trạng phát triển (độ dài)
                </label>
                <Controller
                  name="growthStatus"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Nhập tình trạng phát triển"
                      className="mt-1"
                      status={errors.growthStatus ? "error" : ""}
                    />
                  )}
                />
                {errors.growthStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.growthStatus.message}
                  </p>
                )}
              </Col>

              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Môi trường chăm sóc
                </label>
                <Controller
                  name="careEnvironment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nhập môi trường chăm sóc"
                      className="mt-1"
                      status={errors.careEnvironment ? "error" : ""}
                    />
                  )}
                />
                {errors.careEnvironment && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.careEnvironment.message}
                  </p>
                )}
              </Col>

              <Col span={24}>
                <label style={{ fontSize: "20px", marginLeft: "8px" }}>
                  Ghi chú
                </label>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder="Nhập ghi chú "
                      className="mt-1"
                      status={errors.note ? "error" : ""}
                    />
                  )}
                />
                {errors.note && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.note.message}
                  </p>
                )}
              </Col>

              <Col span={24} className="flex justify-end">
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={isAddingHealth}
                >
                  Thêm
                </Button>
                <Button onClick={() => setIsModalAddHealthOpen(false)}>
                  Hủy
                </Button>
              </Col>
            </Row>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default FishCareManagement;
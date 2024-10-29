import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ConsignmentApi } from "../../../apis/Consignment.api";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
  InputNumber,
  Switch,
  Typography,
  message,
} from "antd";

const { Title } = Typography;

// Define the validation schema with default values using yup
const schema = yup.object().shape({
  duration: yup.number().required("Duration is required").default(0),
  rate: yup
    .number()
    .required("Rate is required")
    .min(0, "Rate cannot be negative")
    .max(100, "Rate cannot exceed 100%")
    .default(0),
  sale: yup.boolean().default(false),
  status: yup.boolean().default(true),
});

const ConsignmentFeeManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const pageSize = 7;

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    data: consignmentFees,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["listConsignmentFee", currentPage],
    queryFn: () => ConsignmentApi.getAllConsignmentFee(currentPage, pageSize),
    keepPreviousData: true,
  });

  const { mutate: updateConsignmentFee, isLoading: isUpdating } = useMutation({
    mutationFn: (data) => ConsignmentApi.updateConsignmentFee(data),
    onSuccess: () => {
      message.success("Cập nhật phí kí gửi thành công");
      setIsModalOpen(false);
      refetch();
    },
    onError: () => {
      message.error("Update failed");
    },
  });
  const { mutate: createConsignmentFee, isLoading: isCreating, isError: isCreateError } = useMutation({
    mutationFn: (data) => ConsignmentApi.createConsignmentFee(data),
    onSuccess: () => {
      message.success("Tạo phí kí gữi này");
      setIsModalOpen(false);
      refetch();
    },
    onError: () => {
      message.error("Create failed");
    },
  });


  const columns = [
    {
      title: "ID",
      dataIndex: "consignmentFeeId",
      key: "consignmentFeeId",
    },
    {
      title: "Gói (tháng)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "tỉ lệ (%)",
      dataIndex: "rate",
      key: "rate",
      render: (rate) => `${rate * 100}%`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Loại phí",
      dataIndex: "sale",
      key: "sale",
      render: (sale) => (sale ? "Bán" : "Chăm sóc"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Đang hoạt động" : "Ngưng hoạt động"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  const handleEdit = (record) => {
    const data = { ...record, rate: record?.rate * 100 };
    setEditingRecord(data);
    setIsModalOpen(true);
    reset(data);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingRecord) {
      updateConsignmentFee({
        ...data,
        consignmentFeeId: editingRecord.consignmentFeeId,
      });
    } else {
      createConsignmentFee(data);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-between mb-4">
          <Title level={3}>Quản lý chi phí ký gửi</Title>
          <Button onClick={() => setIsModalOpen(true)} type="primary">
            + Thêm phí ký gửi
          </Button>
        </div>
        <Table
          className="w-full"
          loading={isLoading}
          rowKey="consignmentFeeId"
          columns={columns}
          dataSource={consignmentFees?.data?.content || []}
          pagination={false}
        />
        <div className="mt-3 w-full flex justify-end ">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={consignmentFees?.data?.totalElements}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Chính sửa phí ký gửi": "Thêm phí ký gửi"}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        centered
        width={500}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={[24, 15]}>
            <Col span={24}>
              <Form.Item label="Gói (theo tháng)">
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Nhập gói"
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Tỉ lệ (%)">
                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Nhập tỉ lệ"
                      min={0}
                      max={100}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Loại ký gửi">
                <Controller
                  name="sale"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      checkedChildren="ký gửi bán "
                      unCheckedChildren="Ký gửi chăm sóc"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Status">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24} className="flex justify-end">
              <Button
                htmlType="submit"
                type="primary"
                loading={isUpdating}
                disabled={isUpdating}
              >
                {editingRecord ? "Update" : "Create"}
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsignmentFeeManagement;

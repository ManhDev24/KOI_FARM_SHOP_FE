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
  console.log("editingRecord: ", editingRecord);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "consignmentFeeId",
      key: "consignmentFeeId",
    },
    {
      title: "Duration (months)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      key: "rate",
      render: (rate) => `${rate * 100}%`,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "On Sale",
      dataIndex: "sale",
      key: "sale",
      render: (sale) => (sale ? "Sale" : "Care"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
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
      console.log("Create new feature not implemented");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-between mb-4">
          <Title level={3}>Consignment Fee Management</Title>
          <Button onClick={() => setIsModalOpen(true)} type="primary">
            + Add Consignment Fee
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
        <div className="flex justify-end  mt-2">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={consignmentFees?.data?.totalElements}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Consignment Fee" : "Add Consignment Fee"}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        centered
        width={500}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={[24, 15]}>
            <Col span={24}>
              <Form.Item label="Duration (months)">
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Enter duration"
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Rate (%)">
                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="Enter rate"
                      min={0}
                      max={100}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="On Sale">
                <Controller
                  name="sale"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      checkedChildren="Sale"
                      unCheckedChildren="Care"
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

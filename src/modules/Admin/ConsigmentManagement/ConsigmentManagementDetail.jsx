import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ConsignmentApi } from "../../../apis/Consignment.api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import LoadingModal from "../../Modal/LoadingModal";
import {
  Image,
  Descriptions,
  Alert,
  Card,
  Row,
  Col,
  Typography,
  Button,
  message,
  Modal,
  Input,
  Spin,
} from "antd";
import { Controller, useForm } from "react-hook-form";

const { Title, Text } = Typography;

const validationSchema = yup.object().shape({
  rejectionReason: yup.string().required("Cần phải có lý do hủy đơn kí gửi"),
});

const ConsignmentManagementDetail = () => {
  const { consignmentId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consignmentIdData, setConsignmentIdData] = useState(null);

  const {
    mutate: approvalConsignment,
    isPending: isLoadingApproval,
    isError: isErrorApproval,
  } = useMutation({
    mutationFn: (id) => ConsignmentApi.approvalConsignment(id),
    onSuccess: () => {
      message.success("Phê duyệt đơn ký gửi thành công");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui lòng thử lại!";
      message.error(errorMessage);
    },
  });
  const {
    mutate: rejectConsignment,
    isPending: isLoadingReject,
    isError: isErrorReject,
  } = useMutation({
    mutationFn: (data) => ConsignmentApi.rejectConsignment(consignmentId, data),
    onSuccess: () => {
      message.success("Hủy đơn ký gữi thành cảnh");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Đã có lỗi xảy ra, vui là thử được!";
      message.error(errorMessage);
    },
  });
  const {
    data: consignmentDetail,
    isLoading: isLoadingConsignmentDetail,
    isError: isErrorConsignmentDetail,
    error,
} = useQuery({
    queryKey: ["consignmentDetail", consignmentId],
    queryFn: ({ queryKey }) => {
        const [_key, consignmentId] = queryKey;
        return ConsignmentApi.getConsignmentDetail(consignmentId);
    },
    enabled: !!consignmentId,
  });

  const cancelModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rejectionReason: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  if (isLoadingConsignmentDetail || isLoadingApproval || isLoadingReject) {
    return <Spin size="large" />;
  }

  if (isErrorConsignmentDetail || isErrorApproval || isErrorReject) {
    return (
      <Alert
        message="Lỗi"
        description="Có lỗi xảy ra khi lấy thông tin đơn ký gửi."
        type="error"
        showIcon
      />
    );
  }

  const data = consignmentDetail?.data;

  const onSubmit = (data) => {
    console.log("data: ", data);
    rejectConsignment(data?.rejectionReason);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/consignment-management")}
              className="text-base"
            />
            <Title level={4} className="mb-0 ml-2">
              Chi tiết đơn ký gửi
            </Title>
          </div>
        }
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card
              type="inner"
              title={<Text strong>Ảnh cá Koi</Text>}
              bordered={false}
            >
              <Image
                width="100%"
                src={data?.koiFish?.koiImage}
                alt="Ảnh Koi"
                placeholder={<LoadingModal />}
                style={{ borderRadius: "8px" }}
              />
            </Card>
            <Card
              type="inner"
              title={<Text strong>Ảnh Chứng chỉ</Text>}
              bordered={false}
              className="mt-2"
            >
              <Image
                width="100%"
                src={
                  data?.certificateImage ||
                  "https://cdn.vatgia.com/pictures/thumb/0x0/2022/03/1647487090-asu.jpg"
                }
                alt="Ảnh Chứng chỉ"
                placeholder={<LoadingModal />}
                style={{ borderRadius: "8px" }}
              />
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Descriptions
              title={<Text strong>Thông tin đơn ký gửi</Text>}
              bordered
              column={1}
              layout="vertical"
              size="small"
            >
              <Descriptions.Item label={<Text strong>Mã đơn ký gửi</Text>}>
                {data?.consignmentID}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Ngày ký gửi</Text>}>
                {new Date(data?.consignmentDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Loại ký gửi</Text>}>
                {data?.consignmentType ? "Ký gửi để bán" : "Ký gửi để chăm sóc"}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Giá thỏa thuận</Text>}>
                {data?.agreedPrice?.toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Phí dịch vụ</Text>}>
                {data?.serviceFee?.toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Thời gian</Text>}>
                {data?.duration} tháng
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Trạng thái</Text>}>
                {data?.status === 1 ? "Hoạt động" : "Không hoạt động"}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Hình thức ký gửi </Text>}>
                {data?.online ? "Online" : "Offline"}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Ghi chú</Text>}>
                {data?.notes}
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Thông tin người gửi</Text>}
              >
                <div>
                  <Text>Tên: {data?.fullname}</Text>
                  <br />
                  <Text>Email: {data?.email}</Text>
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Card
              title={<Text strong>Thông tin cá Koi</Text>}
              bordered={false}
              className="mt-2"
            >
              <Descriptions column={1} layout="vertical" bordered size="small">
                <Descriptions.Item label={<Text strong>Nguồn gốc</Text>}>
                  {data?.koiFish?.origin}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Giới tính</Text>}>
                  {data?.koiFish?.gender ? "Nữ" : "Nam"}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Tuổi</Text>}>
                  {data?.koiFish?.age} tuổi
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Kích thước</Text>}>
                  {data?.koiFish?.size} cm
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Tính cách</Text>}>
                  {data?.koiFish?.personality}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Giá</Text>}>
                  {data?.koiFish?.price?.toLocaleString()} VND
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Danh mục</Text>}>
                  {data?.koiFish?.category}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Thuần chủng</Text>}>
                  {data?.koiFish?.purebred ? "Có" : "Không"}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Sức khỏe</Text>}>
                  {data?.koiFish?.health}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Nhiệt độ</Text>}>
                  {data?.koiFish?.temperature}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Mực nước</Text>}>
                  {data?.koiFish?.water}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Thức ăn</Text>}>
                  {data?.koiFish?.food}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>pH nước</Text>}>
                  {data?.koiFish?.ph}
                </Descriptions.Item>
              </Descriptions>
              <div className="flex gap-3 mt-5">
                <Button
                  style={{
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                    color: "#fff",
                  }}
                  onClick={() => approvalConsignment(data?.consignmentID)}
                  icon={<CheckOutlined />}
                >
                  Đồng ý ký gửi
                </Button>
                <Button
                  style={{
                    backgroundColor: "#f5222d",
                    borderColor: "#f5222d",
                    color: "#fff",
                  }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setConsignmentIdData(data?.consignmentID);
                  }}
                  icon={<CloseOutlined />}
                >
                  Từ chối ký gửi
                </Button>
                <Button
                  style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    color: "#fff",
                  }}
                  icon={<EyeOutlined />}
                >
                  Yêu cầu xem chi tiết
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title={"Từ chối ký gửi"}
        visible={isModalOpen}
        footer={null}
        onCancel={cancelModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <label> Lý do từ chối ký gửi </label>
              <Controller
                name="rejectionReason"
                control={control}
                render={({ field }) => <Input.TextArea {...field} />}
              />
              {errors.rejectionReason && (
                <Text type="danger">{errors.rejectionReason.message}</Text>
              )}
            </Col>
            <Col span={24}>
              <Button type="primary" htmlType="submit">
                Gửi
              </Button>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default ConsignmentManagementDetail;

import React, { useRef, useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Upload, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BlogApi from "../../../../apis/Blog.api";
import { Editor } from "@tinymce/tinymce-react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import LoadingModal from "../../../Modal/LoadingModal";

const { Option } = Select;

const BlogEdit = () => {
  const { blogId } = useParams("blogId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [contentPreview, setContentPreview] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch blog data by blogId
  const { data: blogData, isLoading: isFetchingBlog } = useQuery({
    queryKey: ["Blog", blogId],
    queryFn: () => BlogApi.getDetailBlog(blogId),
    onSuccess: (data) => {
      if (data) {
        form.setFieldsValue({
          title: data.title,
          subTitle: data.subTitle,
          status: data.status ? "1" : "0",
        });

        if (editorRef.current) {
          editorRef.current.setContent(data.content || "");
        }

        setImageUrl(data.blogImg);
      }
    },
  });

  useEffect(() => {
    if (blogData) {
      console.log('blogData: ', blogData);
      form.setFieldsValue({
        title: blogData?.data?.title,
        subTitle: blogData?.data?.subTitle,
        status: blogData?.data?.status ? "1" : "0",
      });

      if (editorRef.current) {
        editorRef.current.setContent(blogData?.data?.content || "");
      }

      setImageUrl(blogData?.data?.blogImg || "");
    }
  }, [blogData, form]);

  const { mutate: updateBlog, isLoading: isUpdatingBlog } = useMutation({
    mutationFn: (updatedBlog) => BlogApi.updateBlog(updatedBlog, blogId),
    onSuccess: () => {
      message.success("Blog đã được cập nhật thành công!");
      queryClient.invalidateQueries(["Blog", blogId]);
      navigate("/admin/manage-blog");
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã có lỗi xảy ra!";
      message.error(errorMessage);
    },
  });

  const onFinish = async (values) => {
    const content = editorRef.current.getContent();
    if (!content || content.trim() === "") {
      message.error("Vui lòng nhập nội dung trong editor!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values?.title);
    formData.append("subTitle", values?.subTitle);
    formData.append("status", values.status);
    formData.append("content", content);
    formData.append("postDate", moment().format());
    formData.append("accountId", blogData?.accountId);

    if (selectedFile) {
      formData.append("blogImg", selectedFile);
    }

    updateBlog(formData);
  };

  const handleUploadChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImageUrl("");
  };

  const handlePreview = () => {
    const content = editorRef.current.getContent();
    setContentPreview(content);
    setIsPreviewVisible(true);
  };

  if (isFetchingBlog || isUpdatingBlog) {
    return <LoadingModal />;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài viết</h2>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="subTitle"
            rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}
          >
            <Input placeholder="Nhập mô tả ngắn" />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUploadChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" style={{ width: "100%" }} />
              ) : (
                <PlusOutlined />
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="1">Xuất bản</Option>
              <Option value="0">Nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Editor
              apiKey="d1hhsqhz397l5oqghrrrv35au6tvrqy79t6wyfri9h3czwnl"
              onInit={(_, editor) => (editorRef.current = editor)}
              init={{
                height: 500,
                menubar: true,
                plugins: ["advlist autolink lists link image charmap preview anchor"],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button onClick={() => navigate("/admin/manage-blog")} className="ml-2">
              Hủy
            </Button>
            <Button type="default" onClick={handlePreview} className="ml-2">
              Xem trước
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="Xem trước Blog"
          visible={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
        >
          <h2>{blogData?.title}</h2>
          <p>{blogData?.subTitle}</p>
          {imageUrl && <img src={imageUrl} alt="Blog Preview" />}
          <div dangerouslySetInnerHTML={{ __html: contentPreview }} />
        </Modal>
      </div>
    </div>
  );
};

export default BlogEdit;

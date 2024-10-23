import React, { useRef, useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Upload, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BlogApi from "../../../../apis/Blog.api";
import { Editor } from "@tinymce/tinymce-react";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LoadingModal from "../../../Modal/LoadingModal";
import moment from "moment";

const { Option } = Select;

const BlogEdit = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null); // Reference to TinyMCE editor
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [contentPreview, setContentPreview] = useState(""); // State for previewing content
  const [form] = Form.useForm(); // Ant Design form instance

  // Fetch blog data by blogId
  const { data: blogData, isLoading: isFetchingBlog } = useQuery({
    queryKey: ["Blog", blogId],
    queryFn: () => BlogApi.getDetailBlog(blogId),
    staleTime: 300000, // 5 minutes
    onSuccess: (data) => {
      form.setFieldsValue({
        title: data?.title,
        subTitle: data?.subTitle,
        status: data?.status ? "1" : "0",
        content: data?.content,
        image: data?.blogImg,
      });

      setImageUrl(data?.blogImg);
    },
  });

  // Use useEffect to set content when blogData is fetched
  useEffect(() => {
    if (editorRef.current && blogData?.content) {
      editorRef.current.setContent(blogData.content);
    }
  }, [blogData]); // Runs when blogData changes

  const { mutate: updateBlog, isLoading: isUpdatingBlog } = useMutation({
    mutationFn: (updatedBlog) => BlogApi.updateBlog(blogId, updatedBlog),
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

  // Handle form submission
  const onFinish = (values) => {
    const content = editorRef.current.getContent();
    if (!content || content.trim() === "") {
      message.error("Vui lòng nhập nội dung trong editor!");
      return;
    }

    const updatedBlog = {
      ...values,
      status: values.status === "1", // Convert string "1"/"0" to boolean
      image: imageUrl, // Using the uploaded image URL
      content,
      postDate: moment().format(), // You can keep or modify this
    };
    updateBlog(updatedBlog);
  };

  // Handle image upload
  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url);
    }
  };

  // Handle preview button click
  const handlePreview = () => {
    const content = editorRef.current.getContent();
    setContentPreview(content); // Set content for modal preview
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
          form={form} // Use the form instance
          onFinish={onFinish}
          initialValues={{
            title: blogData?.data?.title,
            subTitle: blogData?.data?.subTitle,
            status: blogData?.data?.status ? "1" : "0",
            image: blogData?.data?.blogImg,
            content: blogData?.data?.content,
          }}
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
              onChange={handleUploadChange}
              action="/upload" // Replace with your API endpoint for uploading images
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-32 object-cover"
                  />
                  <DeleteOutlined
                    onClick={() => setImageUrl("")}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                    }}
                  />
                </>
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
              initialValue="" // Leave empty as we set content dynamically
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button
              onClick={() => navigate("/admin/manage-blog")}
              className="ml-2"
            >
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

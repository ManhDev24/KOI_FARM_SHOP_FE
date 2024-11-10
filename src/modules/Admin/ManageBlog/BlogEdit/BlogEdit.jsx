import React, { useRef, useState, useEffect } from "react";
import { Button, message, Select, Upload, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import BlogApi from "../../../../apis/Blog.api";
import { Editor } from "@tinymce/tinymce-react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingModal from "../../../Modal/LoadingModal";
import moment from "moment";
import { apikey } from '/src/constant/constant.jsx';
const { Option } = Select;

const BlogEdit = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [contentPreview, setContentPreview] = useState("");
  const { handleSubmit, control, setValue, getValues, reset } = useForm();
  const [isEditorReady, setIsEditorReady] = useState(false);

  if (!blogId) {
    console.error("blogId is undefined. Make sure it's initialized.");
  }

  // Fetch blog data by blogId
  const { data: blogData, isLoading: isFetchingBlog, error } = useQuery({
    queryKey: ["Blog", blogId],
    queryFn: () => {
      return BlogApi.getDetailBlog(blogId);
    },
    enabled: !!blogId,
    onError: (error) => {
      console.error("Fetching failed, error:", error);
    },
  });

  // Populate form values when blogData and editor are ready
  useEffect(() => {
    if (blogData && isEditorReady) {

      // Reset all form fields at once
      reset({
        title: blogData.data?.title || "",
        subTitle: blogData.data?.subTitle || "",
        status: blogData.data?.status ? "1" : "0",
      });

      setImageUrl(blogData.data?.blogImg || "");

      // Set content in the editor
      editorRef.current.setContent(blogData.data?.content || "");
    }
  }, [blogData, isEditorReady, reset]);

  // Mutation for updating the blog
  const { mutate: updateBlog, isLoading: isUpdatingBlog } = useMutation({
    mutationFn: async (updatedBlog) => BlogApi.updateBlog(updatedBlog, blogId),
    onSuccess: () => {
      message.success("Blog đã được cập nhật thành công!");
      queryClient.invalidateQueries(["Blog", blogId]);
      navigate("/admin/blog-management");
    },
    onError: (error) => {
      const errorMessage = error?.message || "Đã có lỗi xảy ra!";
      message.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = (values) => {
    if (!editorRef.current) {
      message.error("Trình soạn thảo chưa sẵn sàng, vui lòng thử lại!");
      return;
    }

    const content = editorRef.current.getContent();
    if (!content || content.trim() === "") {
      message.error("Vui lòng nhập nội dung trong editor!");
      return;
    }

    if (!imageUrl) {
      message.error("Vui lòng tải lên hình ảnh cho bài viết!");
      return;
    }

    // Prepare the FormData
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subTitle", values.subTitle);
    formData.append("status", values.status === "1");
    formData.append("content", content);
    formData.append("postDate", moment().format());

    // If imageUrl is a File object, add it to FormData
    if (typeof imageUrl === "object") {
      formData.append("blogImg", imageUrl);
    }

    // Call the mutation to update the blog
    updateBlog(formData);
  };

  // Handle image upload
  const handleUploadChange = ({ file }) => {
    if (file.status === "done" && file.response) {
      setImageUrl(file.response.url);
    } else if (file.originFileObj) {
      // If it's a new file being uploaded, set the file object
      setImageUrl(file.originFileObj);
    }
  };

  // Handle preview button click
  const handlePreview = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.getContent() || "";
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Tiêu đề</label>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "Vui lòng nhập tiêu đề!" }}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập tiêu đề bài viết"
                />
              )}
            />
          </div>

          {/* Sub Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Mô tả ngắn</label>
            <Controller
              name="subTitle"
              control={control}
              defaultValue=""
              rules={{ required: "Vui lòng nhập mô tả ngắn!" }}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập mô tả ngắn"
                />
              )}
            />
          </div>

          {/* Image Upload Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Hình ảnh</label>
            <Upload
              listType="picture-card"
              showUploadList={false}
              onChange={handleUploadChange}
              action="/upload" // Replace with your actual API endpoint
            >
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={typeof imageUrl === "string" ? imageUrl : URL.createObjectURL(imageUrl)}
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
                      cursor: "pointer",
                    }}
                  />
                </div>
              ) : (
                <PlusOutlined />
              )}
            </Upload>
          </div>

          {/* Status Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Trạng thái</label>
            <Controller
              name="status"
              control={control}
              defaultValue=""
              rules={{ required: "Vui lòng chọn trạng thái!" }}
              render={({ field }) => (
                <Select {...field} placeholder="Chọn trạng thái" className="w-full">
                  <Option value="1">Xuất bản</Option>
                  <Option value="0">Nháp</Option>
                </Select>
              )}
            />
          </div>

          {/* Content Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Nội dung</label>
            <Editor
              apiKey={apikey}
            onInit={(evt, editor) => {
              editorRef.current = editor;
              setIsEditorReady(true);

              // If blogData is already available, set the content
              if (blogData) {
                editor.setContent(blogData.data?.content || "");
              }
            }}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "autosave",
                "spellchecker",
                "emoticons",
                "codesample",
              ],
              toolbar:
                "undo redo | fontselect fontsizeselect styleselect | bold italic forecolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help | " +
                "image media codesample | spellchecker emoticons",
            }}
            />
          </div>

          {/* Form Buttons */}
          <div className="flex space-x-2">
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button onClick={() => navigate("/admin/blog-management")}>Hủy</Button>
            <Button type="default" onClick={handlePreview}>
              Xem trước
            </Button>
          </div>
        </form>

        {/* Preview Modal */}
        <Modal
          title="Xem trước Blog"
          visible={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
        >
          <h2>{getValues("title")}</h2>
          <p>{getValues("subTitle")}</p>
          {imageUrl && (
            <img
              src={typeof imageUrl === "string" ? imageUrl : URL.createObjectURL(imageUrl)}
              alt="Blog Preview"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: contentPreview }} />
        </Modal>
      </div>
    </div>
  );
};

export default BlogEdit;

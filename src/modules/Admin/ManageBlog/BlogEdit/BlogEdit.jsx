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

const { Option } = Select;

const BlogEdit = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  console.log('editorRef: ', editorRef);
  const [imageUrl, setImageUrl] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [contentPreview, setContentPreview] = useState("");
  const { handleSubmit, control, setValue, getValues } = useForm();

  // Fetch blog data by blogId
  const { data: blogData, isLoading: isFetchingBlog } = useQuery({
    queryKey: ["Blog", blogId],
    queryFn: () => BlogApi.getDetailBlog(blogId),
    onError: (error) => {
      console.error("Fetching failed, error: ", error);
    },
  });

  useEffect(() => {
    if (blogData) {
      console.log('blogData: ', blogData); 
      setValue("title", blogData.data?.title || "");
      setValue("subTitle", blogData.data?.subTitle || "");
      setValue("status", blogData.data?.status ? "1" : "0");
      setImageUrl(blogData.data?.blogImg || "");
      
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.setContent(blogData.data?.content || "");
      }
    }
  }, [blogData, setValue]);

  // Mutation for updating the blog
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
  const onSubmit = (values) => {
    const content = editorRef.current?.editor?.getContent();
    if (!content || content.trim() === "") {
      message.error("Vui lòng nhập nội dung trong editor!");
      return;
    }

    const updatedBlog = {
      ...values,
      status: values.status === "1",
      blogImg: imageUrl,
      content,
      postDate: moment().format(),
    };
    updateBlog(updatedBlog);
  };

  // Handle image upload
  const handleUploadChange = ({ file }) => {
    if (file.status === "done" && file.response) {
      setImageUrl(file.response.url);
    }
  };

  // Handle preview button click
  const handlePreview = () => {
    const content = editorRef.current?.editor?.getContent() || "";
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
                      cursor: "pointer",
                    }}
                  />
                </div>
              ) : (
                <PlusOutlined />
              )}
            </Upload>
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium">Nội dung</label>
            <Editor
              apiKey="d1hhsqhz397l5oqghrrrv35au6tvrqy79t6wyfri9h3czwnl"
              onInit={(evt, editor) => (editorRef.current = { editor })}
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
          </div>

          <div className="flex space-x-2">
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button onClick={() => navigate("/admin/manage-blog")}>Hủy</Button>
            <Button type="default" onClick={handlePreview}>
              Xem trước
            </Button>
          </div>
        </form>

        <Modal
          title="Xem trước Blog"
          visible={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
        >
          <h2>{getValues("title")}</h2>
          <p>{getValues("subTitle")}</p>
          {imageUrl && <img src={imageUrl} alt="Blog Preview" />}
          <div dangerouslySetInnerHTML={{ __html: contentPreview }} />
        </Modal>
      </div>
    </div>
  );
};

export default BlogEdit;

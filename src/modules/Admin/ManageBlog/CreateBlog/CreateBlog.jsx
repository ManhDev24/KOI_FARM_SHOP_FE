import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import LoadingModal from "../../../Modal/LoadingModal";
import BlogApi from "../../../../apis/Blog.api";
import { Input, message, Select, Upload, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getLocalStorage } from "../../../../utils/LocalStorage";

const CreateBlog = () => {
  const editorRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); // Modal state
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
      status: false,
      content: "",
      date: new Date().toLocaleDateString(),
    },
  });

  const { mutate: handleCreateBlog, isLoading: isLoadingCreateBlog } =
    useMutation({
      mutationFn: (data) => BlogApi.createBlog(data),
      onSuccess: () => {
        message.success("Blog created successfully!");
        reset(); // Reset form after successful publish
      },
      onError: (error) => {
        message.error(error?.message || "An error occurred, please try again!");
      },
    });

  if (isLoadingCreateBlog) {
    return <LoadingModal />;
  }

  // Function to handle publishing the blog
  const handlePublish = (data) => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      if (!content || content.trim() === "") {
        message.error("Please enter content in the editor!");
        return;
      }

      const newContent = {
        title: data.title,
        subTitle: data.subtitle,
        blogImg: data.image,
        status: data.status,
        content,
        accountId: getLocalStorage("user")?.id,
      };

      handleCreateBlog(newContent);
    }
  };

  // Function to handle Preview
  const handlePreview = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      if (!content || content.trim() === "") {
        message.error("Please enter content in the editor!");
        return;
      }
      setIsPreviewVisible(true);
    }
  };

  return (
    <div>
      <div className="container mx-auto py-4">
        <h1 className="text-center text-red-600 text-3xl mb-4">Create Blog</h1>
        <form onSubmit={handleSubmit(handlePublish)}>
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Tiều đề:</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Tiều đề không được bỏ trống" }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nhập tiêu đề"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Subtitle Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Tiều đề phụ:</label>
            <Controller
              name="subtitle"
              control={control}
              rules={{ required: "Tiêu đề phụ không được bỏ trống" }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nhập tiêu đề phụ"
                />
              )}
            />
            {errors.subtitle && (
              <p className="text-red-500">{errors.subtitle.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Ảnh:</label>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
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
                  {value ? (
                    <>
                      <img
                        className="w-[60px] h-[80px] object-cover"
                        src={URL.createObjectURL(value)}
                        alt="Uploaded"
                      />
                      <DeleteOutlined
                        onClick={() => {
                          onChange(null);
                          setImage(null);
                        }}
                        className="absolute top-2 right-2"
                      />
                    </>
                  ) : (
                    <PlusOutlined />
                  )}
                </Upload>
              )}
            />
          </div>

          {/* Status Select */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Trạng thái của bài viết:</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                  placeholder="Select status"
                >
                  <Select.Option value={false}>Nháp</Select.Option>
                  <Select.Option value={true}>Xuất bản</Select.Option>
                </Select>
              )}
            />
          </div>

          {/* Date Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Ngày viết:</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  disabled
                />
              )}
            />
          </div>

          {/* Content Editor */}
          <div className="mb-4">
            <label className="block text-gray-700">Nội dung:</label>
            <Editor
              apiKey="d1hhsqhz397l5oqghrrrv35au6tvrqy79t6wyfri9h3czwnl"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue="<p>This is the initial content of the editor.</p>"
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="bg-gray-500 text-white rounded px-4 py-2 ml-2"
            >
              Preview
            </button>
          </div>
        </form>

        {/* Preview Modal */}
        <Modal
          title="Blog Preview"
          visible={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={null}
          width={800}
        >
          <h2>{watch("title")}</h2>
          <h4>{watch("subtitle")}</h4>
          {image && <img src={image} alt="Blog" className="my-4" />}
          <div dangerouslySetInnerHTML={{ __html: editorRef.current?.getContent() }} />
        </Modal>
      </div>
    </div>
  );
};

export default CreateBlog;

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";

const CreateBlog = () => {
  const editorRef = useRef(null);
  const [savedContents, setSavedContents] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(""); 
  const [viewedPost, setViewedPost] = useState(null); 
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
      status: "Draft",
      content: "",
      date: new Date().toLocaleDateString(),
    },
  });

  const saveContent = (data, publish = false) => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      if (!content || content.trim() === "") {
        alert("Please enter content in the editor!");
        return;
      }

      const existingContents =
        JSON.parse(localStorage.getItem("savedContents")) || [];

      const contentIndex = existingContents.findIndex(
        (content) => content.title === selectedTitle
      );

      const newContent = {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image ? URL.createObjectURL(data.image[0]) : "",
        status: publish ? "Published" : data.status,
        content: content,
        date: new Date().toLocaleDateString(),
      };

      if (contentIndex !== -1) {
        existingContents[contentIndex] = newContent;
      } else {
        existingContents.push(newContent);
      }

      localStorage.setItem("savedContents", JSON.stringify(existingContents));
      setSavedContents(existingContents);

      if (publish) {
        console.log("Published Blog Data: ", newContent);
        alert("Blog published!");
      } else {
        alert("Content saved!");
      }

      reset(); 
      setSelectedTitle(""); 
    }
  };

  const viewCurrentBlog = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getContent();
      const currentTitle = watch("title");
      const currentSubtitle = watch("subtitle");
      const currentImage = watch("image");
      const currentStatus = watch("status");
      const currentDate = new Date().toLocaleDateString();

      const viewedCurrentBlog = {
        title: currentTitle,
        subtitle: currentSubtitle,
        image: currentImage && currentImage[0] ? URL.createObjectURL(currentImage[0]) : "",
        content: currentContent,
        status: currentStatus,
        date: currentDate,
      };

      setViewedPost(viewedCurrentBlog);
    }
  };

  const deleteContent = (title) => {
    const existingContents =
      JSON.parse(localStorage.getItem("savedContents")) || [];
    const updatedContents = existingContents.filter(
      (content) => content.title !== title
    );
    localStorage.setItem("savedContents", JSON.stringify(updatedContents));
    setSavedContents(updatedContents);
    if (selectedTitle === title) {
      editorRef.current.setContent("");
      setSelectedTitle("");
    }
    window.location.reload();
  };

  const loadContent = (title) => {
    const existingContents =
      JSON.parse(localStorage.getItem("savedContents")) || [];
    const selectedContent = existingContents.find(
      (content) => content.title === title
    );
    if (selectedContent) {
      setSelectedTitle(title);
      editorRef.current.setContent(selectedContent.content);
      setValue("title", selectedContent.title);
      setValue("subtitle", selectedContent.subtitle);
      setValue("status", selectedContent.status);
      setValue("date", selectedContent.date);
    }
  };

  const viewPost = (title) => {
    const existingContents =
      JSON.parse(localStorage.getItem("savedContents")) || [];
    const selectedContent = existingContents.find(
      (content) => content.title === title
    );
    if (selectedContent) {
      setViewedPost(selectedContent);
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedContents")) || [];
    setSavedContents(saved);
  }, []);

  return (
    <div>
      <div className="container mx-auto py-4">
        <h1 className="text-center text-red-600 text-3xl mb-4">Tạo bài blog</h1>
        <form onSubmit={handleSubmit((data) => saveContent(data, false))}>
          <div className="mb-4">
            <label className="block text-gray-700">Title:</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Subtitle:</label>
            <input
              {...register("subtitle", { required: "Subtitle is required" })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter subtitle"
            />
            {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image:</label>
            <input
              type="file"
              {...register("image", { required: "Image is required" })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date:</label>
            <input
              {...register("date")}
              type="text"
              className="w-full px-3 py-2 border rounded"
              disabled
            />
          </div>

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
              file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === "image") {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function () {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      callback(e.target.result, { alt: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
              autosave_interval: "30s",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />

          <div className="flex justify-center mt-4">
            <button
              className="mx-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              type="submit"
            >
              Save Draft
            </button>

            <button
              className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              type="button"
              onClick={handleSubmit((data) => saveContent(data, true))}
            >
              Publish Blog
            </button>

            <button
              className="mx-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              type="button"
              onClick={viewCurrentBlog}
            >
              View Blog
            </button>

            <button
              className="mx-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              type="button"
              onClick={() => reset()}
            >
              Create New Blog
            </button>
          </div>
        </form>

        {/* Render lại các blog đã lưu */}
        {savedContents.length > 0 && (
          <div className="mt-8 p-4 bg-gray-100 border rounded">
            <h2 className="text-xl font-bold mb-4">Saved Articles:</h2>
            <ul>
              {savedContents.map((content, index) => (
                <li key={index} className="flex justify-between items-center bg-white p-3 rounded shadow-md mb-2">
                  <span
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => loadContent(content.title)}
                  >
                    {content.title}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => loadContent(content.title)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteContent(content.title)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => viewPost(content.title)}
                    >
                      View Post
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hiển thị bài post sau khi nhấn nút View Post */}
        {viewedPost && (
          <div className="mt-8 p-4 bg-white border rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{viewedPost.title}</h2>
            <h4 className="text-gray-600 mb-4">{viewedPost.subtitle}</h4>
            {viewedPost.image && (
              <img
                src={viewedPost.image}
                alt={viewedPost.title}
                className="mb-4"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: viewedPost.content }} />
            <p className="mt-4 text-sm text-gray-500">Date: {viewedPost.date}</p>
            <p className="text-sm text-gray-500">Status: {viewedPost.status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";

const CreateBlog = () => {
  const editorRef = useRef(null);
  const [savedContents, setSavedContents] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(""); 
  const [viewedPost, setViewedPost] = useState(null); // State để lưu bài post đang xem
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      image: null,
      status: "Draft",
      content: "",
      date: new Date().toLocaleDateString(),
    },
  });

  const saveContent = (data) => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const existingContents =
        JSON.parse(localStorage.getItem("savedContents")) || [];

      const contentIndex = existingContents.findIndex(
        (content) => content.title === selectedTitle
      );

      const newContent = {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image ? URL.createObjectURL(data.image[0]) : "",
        status: data.status,
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
      alert("Content saved!");
      reset(); 
      setSelectedTitle(""); 
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
      setViewedPost(selectedContent); // Lưu bài post vào state để hiển thị
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
        <form onSubmit={handleSubmit(saveContent)}>
          <div className="mb-4">
            <label className="block text-gray-700">Title:</label>
            <input
              {...register("title")}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Subtitle:</label>
            <input
              {...register("subtitle")}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter subtitle"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image:</label>
            <input
              type="file"
              {...register("image")}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
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
              Save Content
            </button>
          </div>
        </form>

        {savedContents.length > 0 && (
          <div className="mt-8 p-4 bg-gray-100 border rounded">
            <h2 className="text-xl font-bold mb-4">Saved Articles:</h2>
            <ul>
              {savedContents.map((content, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => loadContent(content.title)}
                  >
                    {content.title}
                  </span>
                  <button
                    className="text-red-600 hover:underline ml-4"
                    onClick={() => deleteContent(content.title)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-600 hover:underline ml-4"
                    onClick={() => viewPost(content.title)}
                  >
                    View Post
                  </button>
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

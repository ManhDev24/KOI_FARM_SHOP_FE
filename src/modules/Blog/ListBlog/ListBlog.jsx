import React, { useState } from "react";
import moment from "moment";
import LoadingModal from "../../Modal/LoadingModal";
import { useQuery } from "@tanstack/react-query";
import BlogApi from "../../../apis/Blog.api";
import { useNavigate } from "react-router-dom";

const ListBlog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: ListBlog,
    isLoading: ListBlogLoading,
    isError: ListBlogError,
  } = useQuery({
    queryKey: ["ListBlog", currentPage],
    queryFn: () => BlogApi.getAllBlog(currentPage, 5),
  });

  if (ListBlogLoading) {
    return <LoadingModal isLoading={ListBlogLoading} />;
  }

  if (ListBlogError) {
    return (
      <div className="text-center text-red-500">
        Error loading blogs. Please try again later.
      </div>
    );
  }

  const blogs = ListBlog?.data?.content || [];
  const mainBlog = blogs[0];

  // Fake data for smaller blogs
  const smallerBlogs = [
    {
      blogId: "2",
      blogImg: "https://via.placeholder.com/400x200",
      title: "Smaller Blog Post 1",
      postDate: "2023-10-14",
      content:
        "This is a smaller blog post that provides some useful information related to the main topic.",
    },
    {
      blogId: "3",
      blogImg: "https://via.placeholder.com/400x200",
      title: "Smaller Blog Post 2",
      postDate: "2023-10-13",
      content:
        "This is another smaller blog post that provides additional insights on the subject.",
    },
    {
      blogId: "4",
      blogImg: "https://via.placeholder.com/400x200",
      title: "Smaller Blog Post 3",
      postDate: "2023-10-12",
      content:
        "This is yet another smaller blog post with valuable information to support the topic.",
    },
    {
      blogId: "5",
      blogImg: "https://via.placeholder.com/400x200",
      title: "Smaller Blog Post 4",
      postDate: "2023-10-11",
      content:
        "This is the last smaller blog post providing related content to the main topic discussed.",
    },
  ];

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 lg:px-0">
      <div className="text-center text-3xl font-bold text-[#196b49] mb-10">
        Tin Hữu ích
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Main Blog Post */}
        {mainBlog && (
          <div
            className="cursor-pointer flex flex-col shadow-md rounded-lg overflow-hidden"
            onClick={() => handleBlogClick(mainBlog.blogId)}
          >
            <img
              className="w-full h-[500px] object-cover"
              src={mainBlog.blogImg}
              alt={mainBlog.title || "Blog image"}
            />
            <div className="p-4 bg-white flex flex-col w-full h-[180px] flex-grow">
              <h2 className="font-bold text-[#1A8358] text-2xl mb-2">
                {mainBlog.title}
              </h2>
              <h3 className="text-gray-500 mb-2">
                {moment(mainBlog.postDate).format("DD [tháng] M [năm], YYYY")}
              </h3>
              <div className="text-gray-700 overflow-hidden">
                <p
                  dangerouslySetInnerHTML={{
                    __html: mainBlog.content
                      ? mainBlog.content.substring(0, 210) + "..."
                      : "",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Smaller Blog Posts - 2x2 Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {smallerBlogs.map((blog) => (
            <div
              key={blog.blogId}
              className="cursor-pointer flex flex-col shadow-md rounded-lg overflow-hidden"
              onClick={() => handleBlogClick(blog.blogId)}
            >
              <img
                className="w-full h-40 object-cover"
                src={blog.blogImg}
                alt={blog.title || "Blog image"}
              />
              <div className="p-4 bg-white flex flex-col h-[180px]">
                <h2 className="font-bold text-[#1A8358] text-xl mb-2">
                  {blog.title}
                </h2>
                <h3 className="text-gray-500 mb-2">
                  {moment(blog.postDate).format("DD [tháng] M [năm], YYYY")}
                </h3>
                <div className="text-gray-700 overflow-hidden">
                  <p>{blog.content.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListBlog;

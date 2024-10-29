import React, { useState } from "react";
import "./ListBlog.css";
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
    queryFn: () => BlogApi.getAllBlog(currentPage, 4),
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

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div>
      <div className="text-center text-2xl text-[#196b49]">Tin Hữu ích</div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-10 mb-20 px-10 lg:px-0">
        {blogs.length > 0 && (
          <div
            className="lg:col-span-2 lg:row-span-8 cursor-pointer"
            onClick={() => handleBlogClick(blogs[0].blogId)}
          >
            <img
              className="h-[630px] w-full object-cover"
              src={blogs[0].blogImg}
              alt={blogs[0].title || "Blog image"}
            />
            <h1 className="mt-4 text-[#1A8358] text-xl font-bold">
              {blogs[0].title}
            </h1>
            <h1>
              {moment(blogs[0].postDate).format("DD [tháng] M [năm], YYYY")}
            </h1>
          </div>
        )}

        {blogs.slice(1, 4).map((blog) => (
          <div
            key={blog.blogId}
            className="lg:col-span-2 row-span-2 cursor-pointer"
            onClick={() => handleBlogClick(blog.blogId)}
          >
            <div className="flex mb-4">
              <div className="img w-1/2">
                <img
                  className="object-cover h-[200px] w-full"
                  src={blog.blogImg}
                  alt={blog.title || "Blog image"}
                />
              </div>
              <div className="ms-2 w-1/2">
                <div className="title font-bold text-[#1A8358] text-lg ">
                  {blog.title}
                </div>
                <div className="content">
                  <p>{stripHtmlTags(blog.content).substring(0, 193)}...</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-5">
        <button
          className="bg-[#1A8358] text-white py-2 px-4 rounded-md mx-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg mx-4">Page {currentPage}</span>
        <button
          className="bg-[#1A8358] text-white py-2 px-4 rounded-md mx-2"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListBlog;

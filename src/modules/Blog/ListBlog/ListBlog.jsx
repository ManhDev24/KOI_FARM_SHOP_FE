import React, { useState } from "react";
import moment from "moment";
import LoadingModal from "../../Modal/LoadingModal";
import { useQuery } from "@tanstack/react-query";
import BlogApi from "../../../apis/Blog.api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ListBlog = () => {
  const [currentPage] = useState(1);
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

  const blogs = ListBlog?.data?.content.filter(blog => blog.status === true) || [];
  
  const mainBlog = blogs[0];
  const smallerBlogs = blogs.slice(1);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto my-10 px-4 lg:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center text-3xl font-bold text-primary mb-10">
        Tin Hữu ích
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Main Blog Post */}
        {mainBlog && (
          <motion.div
            role="button"
            tabIndex={0}
            className="cursor-pointer flex flex-col shadow-md rounded-lg overflow-hidden"
            onClick={() => handleBlogClick(mainBlog.blogId)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleBlogClick(mainBlog.blogId);
            }}
            variants={itemVariants}
          >
            <img
              className="w-full h-[500px] object-cover"
              src={mainBlog.blogImg}
              alt={mainBlog.title || "Blog image"}
            />
            <div className="p-4 bg-white flex flex-col w-full min-h-[180px] flex-grow">
              <h2 className="font-bold text-secondary text-2xl mb-2">
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
          </motion.div>
        )}

        {/* Smaller Blog Posts */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          variants={containerVariants}
        >
          {smallerBlogs
            .map((blog) => (
              <motion.div
                key={blog.blogId}
                role="button"
                tabIndex={0}
                className="cursor-pointer flex flex-col shadow-md rounded-lg overflow-hidden min-h-[350px]"
                onClick={() => handleBlogClick(blog.blogId)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleBlogClick(blog.blogId);
                }}
                variants={itemVariants}
              >
                <img
                  className="w-full sm:h-48 md:h-56 lg:h-64 object-cover"
                  src={blog.blogImg}
                  alt={blog.title || "Blog image"}
                />
                <div className="p-4 bg-white flex flex-col h-full">
                  <h2 className="font-bold text-secondary text-xl mb-2">
                    {blog.title}
                  </h2>
                  <h3 className="text-gray-500 mb-2">
                    {moment(blog.postDate).format("DD [tháng] M [năm], YYYY")}
                  </h3>
                  <div className="text-gray-700 overflow-hidden">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: blog.content
                          ? blog.content.substring(0, 210) + "..."
                          : "",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ListBlog;

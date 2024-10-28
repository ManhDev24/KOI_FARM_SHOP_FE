import React, { useState } from "react";
import "./ListBlog.css";
import moment from "moment";
import LoadingModal from "../../Modal/LoadingModal";
import { useQuery } from "@tanstack/react-query";
import BlogApi from "../../../apis/Blog.api";

const ListBlog = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  console.log("ListBlog: ", ListBlog);
  if (ListBlogError) {
    return (
      <div className="text-center text-red-500">
        Error loading blogs. Please try again later.
      </div>
    );
  }

  // Access the fetched data
  const blogs = ListBlog?.data?.content || [];

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div>
      <div className="text-center text-2xl text-[#196b49]">Tin Hữu ích</div>
      <div className="grid grid-cols-5 grid-rows-8 gap-4 mt-10 mb-20 me-[200px]">
        {blogs.length > 0 && (
          <div className="col-span-2 row-span-8 col-start-2">
            <img
              className="h-[630px] w-[95%]"
              src={blogs[0].blogImg}
              alt={blogs[0].title}
            />
            <h1 className="mt-4 text-[#1A8358] text-xl font-bold">
              {blogs[0].title}
            </h1>
            <h1>
              {moment(blogs[0].postDate).format("DD [tháng] M [năm], YYYY")}
            </h1>
          </div>
        )}

        {blogs.slice(1, 4).map((blog, index) => (
          <div key={blog.blogId} className="col-span-2 row-span-2 col-start-4">
            <div className="flex">
              <div className="img">
                <img
                  className="object-fill h-[200px] w-[300px]"
                  src={blog.blogImg}
                  alt={blog.title}
                />
              </div>
              <div className="ms-2 w-[300px]">
                <div className="title font-bold text-[#1A8358] text-lg ">
                  {blog.title}
                </div>
                <div className="content">
                  <p>{stripHtmlTags(blog.content).substring(0, 193)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBlog;

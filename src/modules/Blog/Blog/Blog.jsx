import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogApi from "../../../apis/Blog.api";
import LoadingModal from "../../Modal/LoadingModal";
import { useParams } from "react-router-dom";

const Blog = () => {
  const { id } = useParams("id");
  console.log("id: ", id);

  const {
    data: blogDetail,
    isLoading: isLoadingBlogDetail,
    isError: isErrorBlogDetail,
  } = useQuery({
    queryKey: ["blogDetail", id],
    queryFn: () => BlogApi.getDetailBlog(id),
  });

  if (isLoadingBlogDetail) {
    return <LoadingModal isLoading={isLoadingBlogDetail} />;
  }

  if (isErrorBlogDetail) {
    return <div className="text-center text-red-500">Error loading blog. Please try again later.</div>;
  }

  const blog = blogDetail?.data;

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="mb-10 me-20 ms-20">
      <div className="flex flex-col justify-center items-center mx-auto w-1/2">
        <h1 className="text-start mb-5 text-3xl w-full ">
          {blog?.title}
        </h1>
        <img className="mb-5 w-full" src={blog?.blogImg} alt={blog?.title} />
        {stripHtmlTags(blog?.content || "").split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-xl mb-4">
            {paragraph}
          </p>
        ))}
        {blog?.accountName && (
          <div className="mt-10 text-right w-full">
            <p className="text-lg text-gray-600">Written by: {blog.accountName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

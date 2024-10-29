import { useQuery } from "@tanstack/react-query";
import React, { memo } from "react";
import BlogApi from "../../../apis/Blog.api";
import LoadingModal from "../../Modal/LoadingModal";
import { useParams } from "react-router-dom";

const Blog = memo(() => {
  const { id } = useParams();

  const {
    data: blogDetail,
    isLoading: isLoadingBlogDetail,
    isError: isErrorBlogDetail,
  } = useQuery({
    queryKey: ["blogDetail", id],
    queryFn: () => BlogApi.getDetailBlog(id),
    enabled: !!id, // Ensures query runs only if id is defined
  });

  if (isLoadingBlogDetail) {
    return <LoadingModal isLoading={isLoadingBlogDetail} text="Loading blog details..." />;
  }

  if (isErrorBlogDetail) {
    return (
      <div className="text-center text-red-500">
        Error loading blog. Please try again later.
      </div>
    );
  }

  const blog = blogDetail?.data;

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 lg:px-0">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-start mb-6 text-3xl font-bold text-[#196b49] w-full">
          {blog?.title}
        </h1>
        {blog?.blogImg ? (
          <img
            className="mb-8  rounded-lg object-cover shadow-md"
            src={blog.blogImg}
            width={300}
            height={500}
            alt={blog.title}
          />
        ) : (
          <img
            className="mb-8 w-full rounded-lg object-cover shadow-md"
            src="/placeholder.jpg"
            alt="Placeholder Image"
          />
        )}
        <div className="text-lg leading-relaxed text-gray-800 w-full">
          <div dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />
        </div>
        {blog?.accountName && (
          <div className="mt-10 text-right w-full">
            <p className="text-lg text-gray-600">
              Written by: {blog.accountName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Blog;

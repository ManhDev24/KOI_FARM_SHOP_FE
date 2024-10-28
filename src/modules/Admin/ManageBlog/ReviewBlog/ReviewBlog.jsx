import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import BlogApi from "../../../../apis/Blog.api";

const ReviewBlog = () => {
  const { id } = useParams("id");
  const {
    data: reviewBlog,
    isPending: isLoadingReviewBlog,
    isError: isErrorReviewBlog,
  } = useQuery({
    queryKey: ["reviewBlog", id],
    queryFn: () => BlogApi.getDetailBlog(id),
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">{reviewBlog?.data?.title}</h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: reviewBlog?.data?.content }}
      />
    </div>
  );
};

export default ReviewBlog;

import fetcher from "./Fetcher";

export const BlogApi = {
  getAllBlog: async (currentPage, pageSize) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/blog/getAllBlog/${currentPage}/${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createBlog: async (payload) => {
    try {
      const response = await fetcher.post(
        `http://localhost:8080/koifarm/blog/createBlog`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getDetailBlog: async (id) => {
    try {
      const response = await fetcher.get(
        `http://localhost:8080/koifarm/blog/getBlogDetail/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  changeStatus: async (id, status) => {
    try {
      const response = await fetcher.put(
        `http://localhost:8080/koifarm/blog/changeStatus/${id}?status=${status}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateBlog: async (payload, blogId) => {
    try {
      const response = await fetcher.put(
        `http://localhost:8080/koifarm/blog/updateBlog/${blogId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteBlog: async (id) => {
    try {
      const response = await fetcher.delete(
        `http://localhost:8080/koifarm/blog/deleteBlog/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default BlogApi;

import { userAxiosInstance } from "../axios";
import type {
  CreateArticlePayload,
  UploadImageResponse,
  ArticleResponse,
} from "../../types/article.types";

function extractErrorMessage(error: any) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export const articleService = {
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await userAxiosInstance.post(
        "/articles/upload-image",
        formData
      );
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  createArticle: async (data: CreateArticlePayload) => {
    try {
      const res = await userAxiosInstance.post("/articles/create", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getFeed: async (): Promise<ArticleResponse> => {
    try {
      const res = await userAxiosInstance.get("/articles/feed");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getArticle: async (id: string): Promise<ArticleResponse> => {
    try {
      const res = await userAxiosInstance.get(`/articles/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  deleteArticle: async (id: string) => {
    try {
      const res = await userAxiosInstance.delete(`/articles/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

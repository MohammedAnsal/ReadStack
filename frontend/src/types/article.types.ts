export interface CreateArticlePayload {
  title: string;
  category: string;
  content: unknown;
  featuredImage: string | null;
  featuredImageId: string | null;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  url: string;
  publicId: string;
}

export interface Article {
  _id: string;
  title: string;
  content: unknown;
  category: string;
  featuredImage?: string | null;
  featuredImageId?: string | null;
  author:
    | {
        _id: string;
        userName: string;
        email: string;
      }
    | string;
  likes: string[];
  dislikes: string[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleResponse {
  success: boolean;
  articles?: Article[];
  article?: Article;
}

import { CreateArticleDTO, UpdateArticleDTO } from "../../dtos/article.dto";
import { IArticle } from "../../models/article.model";

export interface IArticleService {
  createArticle(
    data: CreateArticleDTO,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    article: IArticle;
  }>;

  uploadImage(
    file: Express.Multer.File,
    folder?: string
  ): Promise<{ url: string; publicId: string }>;

  getFeed(): Promise<{
    success: boolean;
    articles: IArticle[];
  }>;

  getArticle(articleId: string): Promise<{
    success: boolean;
    article: IArticle;
  }>;

  getMyArticles(userId: string): Promise<{
    success: boolean;
    articles: IArticle[];
  }>;

  updateArticle(
    articleId: string,
    userId: string,
    data: UpdateArticleDTO
  ): Promise<{
    success: boolean;
    message: string;
    article: IArticle | null;
  }>;

  deleteArticle(
    articleId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  toggleLike(
    articleId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    article: IArticle | null;
  }>;

  toggleDislike(
    articleId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    article: IArticle | null;
  }>;

  toggleBlock(
    articleId: string,
    userId: string,
    value: boolean
  ): Promise<{
    success: boolean;
    message: string;
    article: IArticle | null;
  }>;
}

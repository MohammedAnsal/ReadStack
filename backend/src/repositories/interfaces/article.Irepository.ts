import { IBaseRepository } from "./base.Irepository";
import { IArticle } from "../../models/article.model";
import { Types } from "mongoose";

export type CreateArticleInput = {
  title: string;
  content: unknown;
  category: string;
  featuredImage?: string | null;
  featuredImageId?: string | null;
  author: Types.ObjectId;
};

export interface IArticleRepository
  extends IBaseRepository<IArticle, CreateArticleInput>
{
  findAvailableArticles(): Promise<IArticle[]>;
  findByIdWithAuthor(id: string): Promise<IArticle | null>;
  findByAuthor(authorId: string): Promise<IArticle[]>;
  toggleLike(articleId: string, userId: string): Promise<IArticle | null>;
  toggleDislike(articleId: string, userId: string): Promise<IArticle | null>;
  toggleBlock(articleId: string, value: boolean): Promise<IArticle | null>;
}

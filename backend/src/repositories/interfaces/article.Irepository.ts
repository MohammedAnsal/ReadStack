import { IBaseRepository } from "./base.Irepository";
import { IArticle } from "../../models/article.model";

export interface IArticleRepository extends IBaseRepository<IArticle> {
  findAvailableArticles(): Promise<IArticle[]>;
  findByAuthor(authorId: string): Promise<IArticle[]>;
  toggleLike(articleId: string, userId: string): Promise<IArticle | null>;
  toggleDislike(articleId: string, userId: string): Promise<IArticle | null>;
  toggleBlock(articleId: string, value: boolean): Promise<IArticle | null>;
}

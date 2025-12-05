import Container, { Service } from "typedi";
import { IArticleRepository } from "../../repositories/interfaces/article.Irepository";
import { articleRepository } from "../../repositories/implementations/article.repository";

import { CreateArticleDTO, UpdateArticleDTO } from "../../dtos/article.dto";
import { AppError } from "../../utils/customError.utils";
import { HttpStatus } from "../../enums/httpStatus.enum";

@Service()
export class ArticleService {
  private articleRepo: IArticleRepository;

  constructor() {
    this.articleRepo = articleRepository;
  }

  /** Create an article */
  async createArticle(data: CreateArticleDTO, userId: string) {
    const newArticle = await this.articleRepo.create({
      ...data,
      author: userId,
    } as any);

    return {
      success: true,
      message: "Article created successfully",
      article: newArticle,
    };
  }

  /** Get all visible articles (feed) */
  async getFeed() {
    const articles = await this.articleRepo.findAvailableArticles();
    return {
      success: true,
      articles,
    };
  }

  /** Get a single article */
  async getArticle(articleId: string) {
    const article = await this.articleRepo.findById(articleId);

    if (!article) {
      throw new AppError("Article not found", HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      article,
    };
  }

  /** Get articles created by logged in user */
  async getMyArticles(userId: string) {
    const articles = await this.articleRepo.findByAuthor(userId);
    return {
      success: true,
      articles,
    };
  }

  /** Update article (only author allowed) */
  async updateArticle(
    articleId: string,
    userId: string,
    data: UpdateArticleDTO
  ) {
    const article = await this.articleRepo.findById(articleId);

    if (!article) {
      throw new AppError("Article not found", HttpStatus.NOT_FOUND);
    }

    if (article.author.toString() !== userId) {
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const updated = await this.articleRepo.update(articleId, data);

    return {
      success: true,
      message: "Article updated successfully",
      article: updated,
    };
  }

  /** Delete article (only author allowed) */
  async deleteArticle(articleId: string, userId: string) {
    const article = await this.articleRepo.findById(articleId);

    if (!article) {
      throw new AppError("Article not found", HttpStatus.NOT_FOUND);
    }

    if (article.author.toString() !== userId) {
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    await this.articleRepo.delete(articleId);

    return {
      success: true,
      message: "Article deleted successfully",
    };
  }

  /** Toggle like */
  async toggleLike(articleId: string, userId: string) {
    const updated = await this.articleRepo.toggleLike(articleId, userId);

    if (!updated) throw new AppError("Article not found", HttpStatus.NOT_FOUND);

    return {
      success: true,
      message: "Like updated",
      article: updated,
    };
  }

  /** Toggle dislike */
  async toggleDislike(articleId: string, userId: string) {
    const updated = await this.articleRepo.toggleDislike(articleId, userId);

    if (!updated) throw new AppError("Article not found", HttpStatus.NOT_FOUND);

    return {
      success: true,
      message: "Dislike updated",
      article: updated,
    };
  }

  /** Block or unblock article (only owner) */
  async toggleBlock(articleId: string, userId: string, value: boolean) {
    const article = await this.articleRepo.findById(articleId);

    if (!article) throw new AppError("Article not found", HttpStatus.NOT_FOUND);

    if (article.author.toString() !== userId)
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

    const updated = await this.articleRepo.toggleBlock(articleId, value);

    return {
      success: true,
      message: value ? "Article blocked" : "Article unblocked",
      article: updated,
    };
  }
}

export const articleService = Container.get(ArticleService);

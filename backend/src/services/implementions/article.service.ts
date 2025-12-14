import Container, { Service } from "typedi";
import { IArticleRepository } from "../../repositories/interfaces/article.Irepository";
import { articleRepository } from "../../repositories/implementations/article.repository";
import { CreateArticleDTO, UpdateArticleDTO } from "../../dtos/article.dto";
import { AppError } from "../../utils/customError.utils";
import { HttpStatus } from "../../enums/httpStatus.enum";
import cloudinary from "../../config/config.cloudinary";
import { Types } from "mongoose";

@Service()
export class ArticleService {
  private articleRepo: IArticleRepository;

  constructor() {
    this.articleRepo = articleRepository;
  }

  private handleError(message: string, error: unknown): never {
    console.error(message, error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Something went wrong. Please try again later.",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async createArticle(data: CreateArticleDTO, userId: string) {
    try {
      const newArticle = await this.articleRepo.create({
        title: data.title,
        content: data.content,
        category: data.category,
        featuredImage: data.featuredImage || null,
        featuredImageId: data.featuredImageId ?? null,
        author: new Types.ObjectId(userId),
      });

      return {
        success: true,
        message: "Article created successfully",
        article: newArticle,
      };
    } catch (error) {
      this.handleError("Create Article Error:", error);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = "readStack/articles"
  ): Promise<{ url: string; publicId: string }> {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (err, result) => {
          if (err) return reject(err);

          resolve({
            url: result?.secure_url || "",
            publicId: result?.public_id || "",
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async getFeed(userId?: string) {
    try {
      const articles = await this.articleRepo.findAvailableArticles(userId);
      return { success: true, articles };
    } catch (error) {
      this.handleError("Get Feed Error:", error);
    }
  }

  async getArticle(articleId: string) {
    try {
      const article = await this.articleRepo.findByIdWithAuthor(articleId);

      if (!article) {
        throw new AppError("Article not found", HttpStatus.NOT_FOUND);
      }

      return { success: true, article };
    } catch (error) {
      this.handleError("Get Article Error:", error);
    }
  }

  async getMyArticles(userId: string) {
    try {
      const articles = await this.articleRepo.findByAuthor(userId);
      return { success: true, articles };
    } catch (error) {
      this.handleError("Get My Articles Error:", error);
    }
  }

  async updateArticle(
    articleId: string,
    userId: string,
    data: UpdateArticleDTO
  ) {
    try {
      const article = await this.articleRepo.findById(articleId);

      if (!article) {
        throw new AppError("Article not found", HttpStatus.NOT_FOUND);
      }

      if (article.author.toString() !== userId) {
        throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      // If a new image is being uploaded and there's an old image, delete the old one from Cloudinary
      if (data.featuredImageId && article.featuredImageId && article.featuredImageId !== data.featuredImageId) {
        try {
          await cloudinary.uploader.destroy(article.featuredImageId);
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
          // Continue with update even if deletion fails
        }
      }

      // If image is being removed (set to null) and there was an old image, delete it
      if (data.featuredImage === null && article.featuredImageId) {
        try {
          await cloudinary.uploader.destroy(article.featuredImageId);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
          // Continue with update even if deletion fails
        }
      }

      const updated = await this.articleRepo.update(articleId, data);

      return {
        success: true,
        message: "Article updated successfully",
        article: updated,
      };
    } catch (error) {
      this.handleError("Update Article Error:", error);
    }
  }

  async deleteArticle(articleId: string, userId: string) {
    try {
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
    } catch (error) {
      this.handleError("Delete Article Error:", error);
    }
  }

  async toggleLike(articleId: string, userId: string) {
    try {
      const updated = await this.articleRepo.toggleLike(articleId, userId);

      if (!updated)
        throw new AppError("Article not found", HttpStatus.NOT_FOUND);

      return {
        success: true,
        message: "Like updated",
        article: updated,
      };
    } catch (error) {
      this.handleError("Toggle Like Error:", error);
    }
  }

  async toggleDislike(articleId: string, userId: string) {
    try {
      const updated = await this.articleRepo.toggleDislike(articleId, userId);

      if (!updated)
        throw new AppError("Article not found", HttpStatus.NOT_FOUND);

      return {
        success: true,
        message: "Dislike updated",
        article: updated,
      };
    } catch (error) {
      this.handleError("Toggle Dislike Error:", error);
    }
  }

  async toggleBlock(articleId: string, userId: string) {
    try {
      const article = await this.articleRepo.findById(articleId);

      if (!article)
        throw new AppError("Article not found", HttpStatus.NOT_FOUND);

      const updated = await this.articleRepo.toggleBlock(articleId, userId);
      
      const isBlocked = updated?.blockedBy.some(
        (id) => id.toString() === userId
      );

      return {
        success: true,
        message: isBlocked ? "Article blocked" : "Article unblocked",
        article: updated,
      };
    } catch (error) {
      this.handleError("Toggle Block Error:", error);
    }
  }
}

export const articleService = Container.get(ArticleService);

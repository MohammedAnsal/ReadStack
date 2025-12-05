import { Request, Response } from "express";
import Container, { Service } from "typedi";
import { AppError } from "../../utils/customError.utils";
import { HttpStatus } from "../../enums/httpStatus.enum";
import { AuthRequest } from "../../interfaces/api.interface";
import { articleService } from "../../services/implementions/article.service";
import { IArticleService } from "../../services/interfaces/article.Iservice";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../../utils/validations/article.validation";
import { IArticleController } from "../interfaces/article.Icontroller";

@Service()
export class ArticleController implements IArticleController {
  private articleService: IArticleService;

  constructor() {
    this.articleService = articleService;
  }

  /** Create Article */
  async createArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id; 
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const parsed = createArticleSchema.parse(req.body);
      const response = await this.articleService.createArticle(parsed, userId);

      return res.status(HttpStatus.CREATED).json(response);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      if (error instanceof Error) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Get Feed Articles */
  async getFeed(req: Request, res: Response) {
    try {
      const response = await this.articleService.getFeed();
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Get Single Article */
  async getArticle(req: Request, res: Response) {
    try {
      const response = await this.articleService.getArticle(req.params.id);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Get Logged-In User Articles */
  async getMyArticles(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.getMyArticles(userId);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Update Article */
  async updateArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const parsed = updateArticleSchema.parse(req.body);
      const response = await this.articleService.updateArticle(
        req.params.id,
        userId,
        parsed
      );

      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      if (error instanceof Error) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Delete Article */
  async deleteArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.deleteArticle(
        req.params.id,
        userId
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Like Article */
  async likeArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.toggleLike(
        req.params.id,
        userId
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Dislike Article */
  async dislikeArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.toggleDislike(
        req.params.id,
        userId
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  /** Block/Unblock Article */
  async toggleBlock(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.toggleBlock(
        req.params.id,
        userId,
        req.body.status
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Something went wrong" });
    }
  }
}

export const articleController = Container.get(ArticleController);

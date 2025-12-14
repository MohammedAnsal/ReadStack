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
import { responseMessage } from "../../enums/responseMessage.enum";

@Service()
export class ArticleController implements IArticleController {
  private articleService: IArticleService;

  constructor() {
    this.articleService = articleService;
  }

  async createArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      // const parsed = createArticleSchema.parse(req.body);

      const response = await this.articleService.createArticle(
        req.body,
        userId
      );

      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new AppError("No image uploaded", HttpStatus.BAD_REQUEST);
      }
      const { url, publicId } = await this.articleService.uploadImage(req.file);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Image uploaded successfully",
        url,
        publicId,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Upload Image Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async getFeed(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const response = await this.articleService.getFeed(userId);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

  async getArticle(req: Request, res: Response) {
    try {
      const response = await this.articleService.getArticle(req.params.id);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

  async getMyArticles(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.getMyArticles(userId);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

  async updateArticle(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      // const parsed = updateArticleSchema.parse(req.body);
      const response = await this.articleService.updateArticle(
        req.params.id,
        userId,
        req.body
      );

      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

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
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

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
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

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
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }

  async toggleBlock(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

      const response = await this.articleService.toggleBlock(
        req.params.id,
        userId
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }
}

export const articleController = Container.get(ArticleController);

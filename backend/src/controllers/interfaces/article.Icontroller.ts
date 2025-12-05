import { Request, Response } from "express";

export interface IArticleController {
  createArticle(req: Request, res: Response): Promise<Response | void>;
  getFeed(req: Request, res: Response): Promise<Response | void>;
  getArticle(req: Request, res: Response): Promise<Response | void>;
  getMyArticles(req: Request, res: Response): Promise<Response | void>;
  updateArticle(req: Request, res: Response): Promise<Response | void>;
  deleteArticle(req: Request, res: Response): Promise<Response | void>;
  likeArticle(req: Request, res: Response): Promise<Response | void>;
  dislikeArticle(req: Request, res: Response): Promise<Response | void>;
  toggleBlock(req: Request, res: Response): Promise<Response | void>;
}

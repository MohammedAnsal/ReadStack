import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { articleController } from "../controllers/implementations/article.controller";
import { upload } from "../utils/upload.utils";

const articleRouter = express.Router();

articleRouter.post(
  "/",
  authMiddleware,
  articleController.createArticle.bind(articleController)
);

articleRouter.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  articleController.uploadImage.bind(articleController)
);

articleRouter.get(
  "/feed",
  authMiddleware,
  articleController.getFeed.bind(articleController)
);

articleRouter.get(
  "/my-articles",
  authMiddleware,
  articleController.getMyArticles.bind(articleController)
);

articleRouter.get(
  "/:id",
  authMiddleware,
  articleController.getArticle.bind(articleController)
);

articleRouter.patch(
  "/:id",
  authMiddleware,
  articleController.updateArticle.bind(articleController)
);

articleRouter.delete(
  "/:id",
  authMiddleware,
  articleController.deleteArticle.bind(articleController)
);

articleRouter.post(
  "/:id/like",
  authMiddleware,
  articleController.likeArticle.bind(articleController)
);

articleRouter.post(
  "/:id/dislike",
  authMiddleware,
  articleController.dislikeArticle.bind(articleController)
);

articleRouter.patch(
  "/:id/block",
  authMiddleware,
  articleController.toggleBlock.bind(articleController)
);

export default articleRouter;

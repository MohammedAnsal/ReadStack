import Container, { Service } from "typedi";
import { Article, IArticle } from "../../models/article.model";
import { BaseRepository } from "../base.repository";
import {
  CreateArticleInput,
  IArticleRepository,
} from "../interfaces/article.Irepository";
import { Types } from "mongoose";

@Service()
export class ArticleRepository
  extends BaseRepository<IArticle, CreateArticleInput>
  implements IArticleRepository
{
  constructor() {
    super(Article);
  }

  async findAvailableArticles(
    userId?: string,
    page = 1,
    limit = 10
  ): Promise<{ articles: IArticle[]; total: number }> {
    const query: any = {};

    if (userId) {
      query.blockedBy = { $nin: [new Types.ObjectId(userId)] };
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.model
        .find(query)
        .populate("author", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),

      this.model.countDocuments(query),
    ]);

    return { articles, total };
  }

  async findByIdWithAuthor(id: string): Promise<IArticle | null> {
    return this.model.findById(id).populate("author").exec();
  }

  async findByAuthor(authorId: string): Promise<IArticle[]> {
    return this.model.find({ author: authorId }).exec();
  }

  async toggleLike(
    articleId: string,
    userId: string
  ): Promise<IArticle | null> {
    return this.model.findByIdAndUpdate(
      articleId,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true }
    );
  }

  async toggleDislike(
    articleId: string,
    userId: string
  ): Promise<IArticle | null> {
    return this.model.findByIdAndUpdate(
      articleId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    );
  }

  async toggleBlock(
    articleId: string,
    userId: string
  ): Promise<IArticle | null> {
    const article = await this.model.findById(articleId);
    if (!article) return null;

    const isBlocked = article.blockedBy.some((id) => id.toString() === userId);

    if (isBlocked) {
      return this.model.findByIdAndUpdate(
        articleId,
        { $pull: { blockedBy: userId } },
        { new: true }
      );
    } else {
      return this.model.findByIdAndUpdate(
        articleId,
        { $addToSet: { blockedBy: userId } },
        { new: true }
      );
    }
  }
}

export const articleRepository = Container.get(ArticleRepository);

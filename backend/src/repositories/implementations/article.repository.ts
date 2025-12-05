import Container, { Service } from "typedi";
import { Article, IArticle } from "../../models/article.model";
import { BaseRepository } from "../base.repository";
import { IArticleRepository } from "../interfaces/article.Irepository";

@Service()
export class ArticleRepository
  extends BaseRepository<IArticle>
  implements IArticleRepository
{
  constructor() {
    super(Article);
  }

  async findAvailableArticles(): Promise<IArticle[]> {
    return this.model.find({ isBlocked: false }).populate("author").exec();
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
    value: boolean
  ): Promise<IArticle | null> {
    return this.model.findByIdAndUpdate(
      articleId,
      { isBlocked: value },
      { new: true }
    );
  }
}

export const articleRepository = Container.get(ArticleRepository);

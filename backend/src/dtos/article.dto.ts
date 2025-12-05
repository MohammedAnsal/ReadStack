export interface CreateArticleDTO {
  title: string;
  content: string;
  category: string;
  image?: string | null;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  category?: string;
  image?: string | null;
}

export interface CreateArticleDTO {
  title: string;
  content: any; // TipTap JSON
  category: string;
  featuredImage: string | null;
  featuredImageId: string | null;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: any; // TipTap JSON
  category?: string;
  featuredImage?: string | null;
  featuredImageId?: string | null;
}

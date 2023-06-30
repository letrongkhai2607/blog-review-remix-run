export interface IArticle {
  slug: string;
  title: string;
  markdown: String;
  thumbnailUrl: String;
}
export interface IArticleQueries {
  cate?: string | null;
  author?: string | null;
  searchTerm?: string | null;
}

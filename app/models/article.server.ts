import { IArticle, IArticleQueries } from "interfaces/index";
import { prisma } from "~/db.server";
import type { Post as Article } from "@prisma/client";

const INCLUDE_CLAUSE = {
  user: true,
  categories: true,
};
export async function getArticles(queries: IArticleQueries = {}) {
  const { cate, author, searchTerm } = queries;
  let whereClause: any = {};
  if (cate) {
    whereClause["categories"] = {
      some: {
        slug: {
          equals: cate,
        },
      },
    };
  } else if (author) {
    whereClause["user"] = {
      id: {
        equals: author,
      },
    };
  } else if (searchTerm) {
    whereClause["body"] = {
      search: searchTerm,
    };
  }

  return prisma.post.findMany({
    where: whereClause,
    include: INCLUDE_CLAUSE,
  });
}

export async function getArticle(slug: string) {
  return prisma.post.findUniqueOrThrow({
    where: { slug },
    include: INCLUDE_CLAUSE,
  });
}

export async function createArticle(
  article: Pick<
    Article,
    "slug" | "title" | "markdown" | "thumbnailUrl" | "userId"
  >,
  categories: any[] = []
) {
  let connectCategories = {
    connect: categories.map((cate: any) => {
      return {
        id: cate,
      };
    }),
  };
  return prisma.post.create({
    data: { ...article, categories: connectCategories },
  });
}

export async function deleteArticle(slug: string) {
  return prisma.post.delete({
    where: { slug },
  });
}

export async function updateArticle(article: Partial<Article>) {
  return prisma.post.update({
    data: article,
    where: { slug: article.slug },
  });
}

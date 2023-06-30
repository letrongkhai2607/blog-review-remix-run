import { json, LoaderArgs } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";

import type { Cate } from "@prisma/client";

import { getArticles } from "~/models/article.server";
import { getCates } from "~/models/cates.server";
import { IArticleQueries } from "interfaces";

export const loader = async ({ params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const cate = url.searchParams.get("cate");
  const author = url.searchParams.get("author");
  const searchTerm = url.searchParams.get("searchTerm");
  console.log("searchTerm", searchTerm);

  const articleQueries: IArticleQueries = {
    cate,
    author,
    searchTerm,
  };

  const articles = await getArticles(articleQueries);
  const cates = await getCates();
  return json({ articles, cates });
};
export default function Articles() {
  const { articles, cates } = useLoaderData<typeof loader>();
  console.log("articles", articles);

  const CateList = () => {
    return (
      <div className="my-8 flex items-center gap-4">
        {cates &&
          cates.length > 0 &&
          cates.map(({ name, slug, id }: Cate) => {
            const navigateUrl = `.?cate=${slug}`;
            return (
              <Link
                className="w-fit cursor-pointer rounded-[50px] px-4 py-1 text-center shadow-md dark:bg-slate-700"
                to={navigateUrl}
              >
                <div key={id}>{name}</div>
              </Link>
            );
          })}
      </div>
    );
  };

  const ArticleList = () => {
    return (
      <div className="my-8 grid grid-cols-12 gap-4 p-4 md:p-0">
        {articles.map(
          ({ thumbnailUrl, title, slug, createdAt, user, categories }) => {
            const isDisplayThumbnail = thumbnailUrl !== null;

            return (
              <Link
                to={slug}
                key={slug}
                className="w-ful h-fulll col-span-12 mb-4 block h-full rounded-[2px] p-4 shadow-md dark:bg-slate-700 md:col-span-4 md:p-0"
              >
                <div className="w-full">
                  {thumbnailUrl ? (
                    <img
                      className="h-[250px] w-full rounded-[2px] object-cover"
                      src={thumbnailUrl || ""}
                      alt={title}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <figure className="">
                  <div className="space-y-4 text-center md:p-8 md:text-left">
                    <blockquote>
                      <p className="h-[60px] text-lg font-medium uppercase">
                        {title}
                      </p>
                    </blockquote>
                    <div className="flex h-[24px] items-center justify-center gap-2 md:justify-start">
                      {categories.map(({ name, slug, id }: Cate) => {
                        return (
                          <div
                            className="w-fit  rounded-[2px] px-4 text-center dark:bg-slate-500 "
                            key={id}
                          >
                            {name}
                          </div>
                        );
                      })}
                    </div>
                    <figcaption className="flex flex-col items-center gap-2 text-[12px] font-medium md:flex-row">
                      <div className="rounded-full bg-white p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8 text-black"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="uppercase text-slate-500">
                          {user?.email}
                        </div>
                        <div className="text-slate-500">
                          {createdAt.toLocaleString()}
                        </div>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </Link>
            );
          }
        )}
      </div>
    );
  };
  return (
    <div className="">
      {/* Banner */}
      {/* <div>
        <img
          className="h-auto w-full object-cover"
          src={`/uploads/banner2.avif`}
          alt="heroes-banner"
        />
      </div> */}
      {/* Banner */}
      <CateList />
      {articles.length > 0 ? (
        <ArticleList />
      ) : (
        <div className="my-8 p-4 text-center text-xl dark:bg-slate-500">
          Not found any Article
        </div>
      )}
    </div>
  );
}

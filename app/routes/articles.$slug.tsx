import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getArticle } from "~/models/article.server";
import { marked } from "marked";
export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const article = await getArticle(params.slug);
  const author = article.user;
  if (!article) {
    throw new Error(`Article not found: ${params.slug}`);
  }

  const html = marked(article.markdown);

  return json({ article, html, author });
};

export default function ArticleSlug() {
  const { article, html, author } = useLoaderData<typeof loader>();
  const { title, thumbnailUrl } = article;
  const isDisplayThumbnail = thumbnailUrl !== null;
  return (
    <div className="my-8">
      <div className="text-center text-lg font-medium uppercase">{title}</div>
      <main className="mx-auto grid grid-cols-12 gap-4">
        {html && (
          <div
            className="text-stale-500 col-span-12 flex items-center p-4 text-justify dark:bg-slate-700 md:col-span-9"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        <div className="author-information col-span-12 p-4 dark:bg-slate-700 md:col-span-3">
          <div className="flex items-center gap-2 text-[12px]">
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
            <div className="uppercase text-slate-500">
              <div>
                <Link to={`/articles?author=${author?.id}`}>
                  {author?.email}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

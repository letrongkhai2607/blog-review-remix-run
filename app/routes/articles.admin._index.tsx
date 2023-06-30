import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import BlogItem from "components/BlogItem";
import { IArticle } from "interfaces";
import { getArticles } from "~/models/article.server";
import { requireUser, requireUserId } from "~/session.server";
export const loader = async ({ request, params }: LoaderArgs) => {
  const admin = await requireUser(request);

  return json({ articles: await getArticles() });
};
export default function AdminIndex() {
  const { articles } = useLoaderData<typeof loader>();
  const ArticleList = () => {
    return (
      <div className="my-8 grid grid-cols-12">
        {articles.map(({ thumbnailUrl, title, slug, createdAt, user }) => {
          const isDisplayThumbnail = thumbnailUrl !== null;
          return (
            <Link
              to={slug}
              className="w-ful h-fulll col-span-12 mb-4 block shadow-md"
            >
              <figure className="rounded-[2px] p-8 dark:bg-slate-700 md:flex md:p-0">
                <div className="space-y-4 text-center md:p-8 md:text-left">
                  <blockquote>
                    <p className="text-lg font-medium uppercase">{title}</p>
                  </blockquote>
                  <figcaption className="text-[12px] font-medium">
                    <div className="uppercase text-sky-500">{user?.email}</div>
                    <div className="text-slate-500">{createdAt}</div>
                  </figcaption>
                </div>
              </figure>
            </Link>
          );
        })}
      </div>
    );
  };
  return (
    <div className="">
      <ArticleList />
      <Link
        to="new"
        className="dark:bg-stale-700 block w-fit rounded-[2px] p-3"
      >
        Create a New Post
      </Link>
    </div>
  );
}

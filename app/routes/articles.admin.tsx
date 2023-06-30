import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import BlogItem from "components/BlogItem";
import { IArticle } from "interfaces";

import { getArticles } from "~/models/article.server";
import { useUser } from "~/utils";

export default function PostAdmin() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12">
        <nav className="col-span-12 md:col-span-12"></nav>
        <main className="col-span-12 md:col-span-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

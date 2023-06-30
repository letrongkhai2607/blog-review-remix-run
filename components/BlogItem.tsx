import { Link } from "@remix-run/react";
import { IArticle } from "interfaces/index";

export default function BlogItem({ article }: { article: IArticle }) {
  return (
    <div className="">
      <Link to={article.slug} className="block w-full text-center uppercase">
        {article.title}
      </Link>
    </div>
  );
}

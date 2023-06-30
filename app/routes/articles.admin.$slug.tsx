import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  deleteArticle,
  getArticle,
  updateArticle,
} from "~/models/article.server";
import { marked } from "marked";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { requireUserId } from "~/session.server";
import { cleanObject } from "~/utils";
export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const article = await getArticle(params.slug);
  invariant(article, `Article not found: ${params.slug}`);

  const html = marked(article.markdown);

  return json({ article, html });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  const article = await getArticle(params.slug || "");
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
      maxPartSize: 3000000,
    }),
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);

  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;
  const thumbnail = formData.get("thumbnail");
  const thumbnailUrl =
    (thumbnail as any).name !== ""
      ? `${request.headers.get("origin")}/uploads/${(thumbnail as any).name}`
      : article.thumbnailUrl;

  const actionType = formData.get("actionType") as string;
  const isDelete = actionType === "delete";
  const slug = params.slug as string;

  if (isDelete) {
    await deleteArticle(slug);
  } else {
    const errors = {
      title: title ? null : "Title is required",
      slug: slug ? null : "Slug is required",
      markdown: markdown ? null : "Markdown is required",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json(errors);
    }
    invariant(typeof title === "string", "Title must be a string");
    invariant(typeof slug === "string", "Slug must be a string");
    invariant(typeof markdown === "string", "Markdown must be a string");

    await updateArticle(
      cleanObject({ title, slug, markdown, thumbnailUrl, userId })
    );
  }

  return redirect("/articles");
};

export default function AdminArticleSlug() {
  const errors = useActionData<typeof action>();
  const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-sm text-black`;
  const [previewImageUrl, setPreviewImageUrl] = useState<any>();

  const { article, html } = useLoaderData<typeof loader>();
  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <Form
        method="post"
        encType="multipart/form-data"
        className="w-full p-2 dark:bg-slate-700 md:p-8"
      >
        <main className="container mx-auto">
          <p className="mb-2">
            <label>
              Article Title:{" "}
              <input
                defaultValue={article?.title}
                type="text"
                name="title"
                placeholder="Hello"
                className={inputClassName}
              />
            </label>
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
          </p>
          <p className="mb-2">
            <label>
              Article Thumbnail:{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mb-2 h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                />
              </svg>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={(event) => {
                  setPreviewImageUrl((event.target.files as any)[0]);
                }}
                className={`${inputClassName} hidden bg-white`}
              />
            </label>
            {previewImageUrl && (
              <img
                className="h-auto w-[30%] rounded-[2px]"
                src={URL.createObjectURL(previewImageUrl)}
                alt={article.title}
              />
            )}
          </p>
          <p className="mb-2">
            {article.thumbnailUrl && (
              <label htmlFor="">
                Current thumbnail:
                <img
                  className="h-auto w-[30%] rounded-[2px]"
                  src={article.thumbnailUrl || ""}
                  alt={article.title}
                />
              </label>
            )}
          </p>
          <p className="mb-2">
            <label htmlFor="markdown">Markdown: </label>
            <br />
            {/* <textarea
            id="markdown"
            rows={20}
            name="markdown"
            defaultValue={article?.markdown}
            className={`${inputClassName} font-mono`}
          /> */}
            <Editor initialValue={article?.markdown} textareaName="markdown" />
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </p>
          <p className="mb-2 flex justify-end gap-2 text-right">
            <button
              type="submit"
              name="actionType"
              value="update"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
              Update
            </button>
            <button
              type="submit"
              name="actionType"
              value="delete"
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
              Delete
            </button>
          </p>
        </main>
      </Form>
    </div>
  );
}

import {
  ActionArgs,
  json,
  LoaderArgs,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Editor } from "@tinymce/tinymce-react";

import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { createArticle } from "~/models/article.server";
import { convertToSlug, useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getCates } from "~/models/cates.server";
import { Cate } from "@prisma/client";

export const loader = async ({ params, request }: LoaderArgs) => {
  const cates = await getCates();
  return json({ cates });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
      maxPartSize: 3000000,
    }),
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  console.log("formData", formData);

  const title = formData.get("title") as string;
  const slug = convertToSlug(title);
  const markdown = formData.get("markdown") as string;
  const thumbnail = formData.get("thumbnail");
  const thumbnailUrl = `${request.headers.get("origin")}/uploads/${
    (thumbnail as any).name
  }`;
  const errors = {
    title: title ? null : "Title is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "Title must be a string");
  invariant(typeof markdown === "string", "Markdown must be a string");

  await createArticle({
    title,
    slug,
    markdown,
    thumbnailUrl: thumbnailUrl,
    userId,
  });

  return redirect("/articles");
};

export default function NewArticle() {
  const { cates } = useLoaderData<typeof loader>();
  const [previewImageUrl, setPreviewImageUrl] = useState<any>();
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log((editorRef.current as any).getContent());
    }
  };
  const errors = useActionData<typeof action>();
  const inputClassName = `w-full h-[40px] rounded border border-gray-500 px-2 py-1 text-sm text-black`;
  const [categories, setCategories] = useState<any>([]);
  const handleAddCategories = (id: any) => {
    if (categories?.includes(id)) return;
    setCategories([...categories, id]);
  };
  console.log("categories", categories);
  return (
    <div className="flex min-h-[100vh] items-center justify-center ">
      <Form
        className="w-full p-2  dark:bg-slate-700 md:p-8"
        method="post"
        encType="multipart/form-data"
      >
        <p className="mb-2">
          <label>
            Article Title:{" "}
            <input type="text" name="title" className={inputClassName} />
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
              alt="preview-thumbnail-image"
            />
          )}
        </p>
        <p className="mb-2">
          <label htmlFor="markdown">Markdown: </label>
          <br />
          {/* <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        /> */}
          <Editor textareaName="markdown" />
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </p>
        {/* <p className="mb-2">
          <label className="" htmlFor="markdown">
            Categories:
          </label>
          <br />
          <span className="text-[10px] text-red-500">
            Please choose at least 1 categories
          </span>
          <br />
          <div className="r flex h-[24px] items-center justify-center gap-2 md:justify-start">
            {cates.map(({ name, slug, id }: Cate) => {
              const backgroundColor = `${
                categories?.includes(id) ? "bg-blue-500" : "dark:bg-slate-500"
              }`;
              return (
                <div
                  onClick={() => handleAddCategories(id)}
                  className={`w-fit rounded-[50px] px-4 text-center ${backgroundColor}`}
                  key={id}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </p> */}
        <p className="mb-2 text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Create Article
          </button>
        </p>
      </Form>
    </div>
  );
}

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Menu from "components/Menu";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { useOptionalUser, useUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};
const inputClassName = `w-full h-[40px] rounded border border-gray-500 px-2 py-1 text-sm text-black`;
export default function App() {
  const credentical = useOptionalUser();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-900">
        <nav className="border-gray-200 bg-white dark:bg-gray-900">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
            <a href="#" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Flowbite
              </span>
            </a>
            <div className="flex items-center md:order-2">
              <a
                href="/login"
                className="mr-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:mr-2 md:px-5 md:py-2.5"
              >
                Login
              </a>
              <a
                href="/signup"
                className="mr-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-2 md:px-5 md:py-2.5"
              >
                Sign up
              </a>
              <button
                data-collapse-toggle="mega-menu"
                type="button"
                className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
                aria-controls="mega-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              id="mega-menu"
              className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
            >
              <ul className="mt-4 flex flex-col font-medium md:mt-0 md:flex-row md:space-x-8">
                <li>
                  <a
                    href="/articles"
                    className="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-500 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-600 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    Articles
                  </a>
                </li>
                <li>
                  <a
                    href="/notes"
                    className="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-500 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-600 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    Notes
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* <div className="col-span-12 flex flex-col gap-2 rounded-[2px] p-4 dark:bg-slate-700 md:flex-row md:items-center md:justify-around md:gap-0">
          <Link
            className=""
            to={{
              pathname: "/articles",
            }}
          >
            <span className="text-white">Articles</span>
          </Link>
          <Link
            className=""
            to={{
              pathname: "/articles/admin",
            }}
          >
            <span className="text-white">Articles Admin</span>
          </Link>
          <Link
            className=""
            to={{
              pathname: "/signup",
            }}
          >
            <span className="text-white">Sign up</span>
          </Link>
          {credentical !== undefined ? (
            <Form action="/logout" method="POST" className="text-white">
              <button type="submit">Log out</button>
            </Form>
          ) : (
            <Link
              className=""
              to={{
                pathname: "/login",
              }}
            >
              <span className="text-white">Log in</span>
            </Link>
          )}
          <Form
            action="/articles"
            className="flex items-center gap-2 text-white"
          >
            <input
              type="search"
              className={inputClassName}
              name="searchTerm"
              placeholder="Search..."
            />
          </Form>
        </div> */}

        <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 ">
          {/* <div>
          <img
            className="h-auto max-h-[800px] w-full rounded-[2px] object-cover"
            src="https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt=""
          />
        </div> */}

          <div className="grid w-full grid-cols-12">
            <div className="col-span-12 text-white">
              <div className="min-h-[100vh]">
                <Outlet />
              </div>
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </div>
          </div>
        </div>
        <footer className="m-4 rounded-lg bg-white shadow dark:bg-gray-900">
          <div className="mx-auto w-full p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <a
                href="https://flowbite.com/"
                className="mb-4 flex items-center sm:mb-0"
              >
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="mr-3 h-8"
                  alt="Flowbite Logo"
                />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Flowbite
                </span>
              </a>
              <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
                <li>
                  <a href="#" className="mr-4 hover:underline md:mr-6 ">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="mr-4 hover:underline md:mr-6">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="mr-4 hover:underline md:mr-6 ">
                    Licensing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
            <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
              © 2023{" "}
              <a href="https://flowbite.com/" className="hover:underline">
                Flowbite™
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

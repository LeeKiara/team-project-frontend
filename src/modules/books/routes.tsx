import { Outlet, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import BookSearch from "./BookSearch";
import BookPage from "./BookPage";
import SlideBanner from "@/components/SlideBanner";
import { isLocalhost } from "./data";

const BookSidebar = lazy(() => import("./BookSidebar"));
const BookList = lazy(() => import("./BookList"));
const BookNewList = lazy(() => import("./BookNewList"));
const BookBestList = lazy(() => import("./BookBestList"));

const serverAddress = isLocalhost();

export const bookRoutes = [
  <Route key="side" path="/" element={<BookSidebar />}>
    <Route
      key="books"
      path="/books"
      element={<BookList fetchUrl={`${serverAddress}/books/paging/search?option=국내도서`} />}
    />
    <Route key="best" path="/best" element={<BookBestList />} />
    <Route key="new" path="/new" element={<BookNewList />} />
    <Route
      key="foreign"
      path="/foreign"
      element={<BookList fetchUrl={`${serverAddress}/books/paging/search?option=외국도서`} />}
    />
  </Route>,
  <Route key="search" path="/search" element={<BookSearch />} />,
  <Route key="page" path="/page" element={<BookPage />} />,
];

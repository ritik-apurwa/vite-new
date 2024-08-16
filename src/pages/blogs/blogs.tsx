import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Input } from "@/components/ui/input";
import BlogCard from "@/pages/blogs/blog-card";
import { Filter, Search } from "@/assets/icons";
import BlogForm from "@/components/providers/blog-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Debounce hook
const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Assuming you have a Skeleton component in this path

const BlogCardLoading = () => {
  return (
    <div className=" size-full border-2 shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-60">
        <Skeleton className="w-full h-full" />
        <span className="absolute top-2 right-2 px-2 py-1 bg-teal-500 text-white text-xs rounded-md">
          <Skeleton className="w-16 h-4" />
        </span>
      </div>
      <div className="p-6 bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-800">
        <h1 className="text-2xl font-bold mb-3 text-teal-600 dark:text-teal-300">
          <Skeleton className="w-3/4 h-6" />
        </h1>
        <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <Skeleton className="w-1/2 h-5" />
        </h2>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Skeleton className="w-1/3 h-4" />
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-4">
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4 mb-2" />
          <Skeleton className="w-4/5 h-4" />
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-20 h-8" />
          </div>
          <Skeleton className="w-24 h-5" />
        </div>
      </div>
    </div>
  );
};

// EmptyState component
const EmptyState: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center py-10">
    <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
  </div>
);

// LoaderSpinner component

// Searchbar component
const Searchbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (debouncedValue) {
      navigate(`/blogs?search=${debouncedValue}`);
    } else if (!debouncedValue && location.pathname === "/blogs") {
      navigate("/blogs");
    }
  }, [navigate, location.pathname, debouncedValue]);

  return (
    <div className="relative max-w-sm block">
      <div className="absolute flex left-4 items-center h-full  justify-center">
        <Search />
      </div>
      <Input
        className="input-class  pl-12 focus-visible:ring-offset-orange-1"
        placeholder="Search for blogs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
    </div>
  );
};

// Main Discover component
const Blogs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const blogsData = useQuery(api.blogs.getBlogBySearch, { search });

  return (
    <div className="flex flex-col gap-10 py-10">
      <div className="grid grid-cols-12 w-screen max-w-7xl mx-auto gap-5">
        <div className="col-span-5">
          <div className="prose prose-base dark:prose-invert lg:prose-lg">
            <h2>Blogs</h2>
            <h3>
              {" "}
              {!search ? "Discover Trending Blogs" : "Search results for "}
              {search && <span className="text-white-2"> "{search}" </span>}
            </h3>
          </div>
        </div>
        <div className="col-span-3">
          <Searchbar />
        </div>

        <div className="col-span-4 flex flex-row items-start gap-x-4 justify-center">
          <BlogForm type="create" />
          <Button variant="outline" className="gap-x-2">
            <Filter />
            <span className="hidden md:flex">Filter</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-9">
        {blogsData ? (
          <>
            {blogsData.length > 0 ? (
              <div className="blog_grid grid lg:grid-cols-2 gap-4 w-screen max-w-7xl mx-auto">
                {blogsData.map(
                  ({
                    _creationTime,
                    _id,
                    author,
                    content,
                    published,
                    title,
                    category,
                    images,
                  }) => (
                    <div className="" key={_id}>
                      <BlogCard
                        _creationTime={_creationTime}
                        _id={_id}
                        author={author}
                        content={content}
                        published={published}
                        title={title}
                        category={category}
                        images={images}
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <div className="blog_grid grid lg:grid-cols-2 gap-4 w-screen max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardLoading key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

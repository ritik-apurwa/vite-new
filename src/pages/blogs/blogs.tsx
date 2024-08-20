import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import BlogCard from "@/pages/blogs/blog-card";

import BlogForm from "@/components/providers/blog-form";
import BlogFilter from "./blog-filter";
import BlogCardLoading from "./blog-card-loading";

import { EmptyState } from "../snippets/snippet-coms";
import { BlogSearchInput } from "./blogs-search";

// ... (keep the EmptyState and Searchbar components as they are)

const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [author, setAuthor] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const blogsData = useQuery(api.blogs.SearchBlogsQuery, {
    search,
    author: author || undefined,
    category: category || undefined,
  });

  const handleFilterChange = (
    newAuthor: string | null,
    newCategory: string | null
  ) => {
    setAuthor(newAuthor);
    setCategory(newCategory);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (author) params.set("author", author);
    else params.delete("author");
    if (category) params.set("category", category);
    else params.delete("category");
    setSearchParams(params);
  }, [author, category, setSearchParams]);

  return (
    <div className="flex flex-col gap-10 py-10">
      <div className="grid grid-cols-12 w-screen max-w-7xl mx-auto gap-5">
        <div className="col-span-5">
          <div className="prose prose-base dark:prose-invert lg:prose-lg">
            <h2>Blogs</h2>
            <h3>
              {!search && !author && !category
                ? "Discover Trending Blogs"
                : "Filtered results"}
              {search && <span className="text-white-2"> "{search}" </span>}
              {author && <span className="text-white-2"> by {author} </span>}
              {category && (
                <span className="text-white-2"> in {category} </span>
              )}
            </h3>
          </div>
        </div>
        <div className="col-span-3">
          <BlogSearchInput />
        </div>
        <div className="col-span-4 flex flex-row items-start gap-x-4 justify-center">
          <BlogForm type="create" />
          <BlogFilter  onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="flex flex-col gap-9">
        {blogsData !== undefined ? (
          <>
            {blogsData.length > 0 ? (
              <div className="blog_grid grid lg:grid-cols-2 gap-4 w-screen max-w-7xl mx-auto">
                {blogsData.map((item) => (
                  <div className="" key={item._id}>
                    <BlogCard {...item} />
                  </div>
                ))}
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

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import BlogCard from "../blogs/blog-card";
import { Id } from "@convex/_generated/dataModel";

function BlogList() {
  const [cursor, setCursor] = useState<Id<"blogs"> | null>(null);
  const [loadedBlogs, setLoadedBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryResult = useQuery(api.blogs.getBlogsNew, {
    limit: 5,
    cursor: cursor ?? undefined,
  });

  const blogs = queryResult?.blogs ?? [];
  const nextCursor = queryResult?.nextCursor as Id<"blogs"> | null;

  useEffect(() => {
    if (blogs.length > 0) {
      setLoadedBlogs((prevBlogs) => [...prevBlogs, ...blogs]);
      setIsLoading(false);
    }
  }, [blogs]);

  const handleLoadMore = () => {
    if (nextCursor) {
      setIsLoading(true);
      setCursor(nextCursor);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadedBlogs.map((blog) => (
          <BlogCard key={blog._id} {...blog} />
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center mt-6">
          {/* Add your spinner component here */}
          <p>Loading...</p>
        </div>
      )}
      {nextCursor && !isLoading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <BlogList />
    </div>
  );
};

export default Admin;
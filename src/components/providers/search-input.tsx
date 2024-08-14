import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Input } from "@/components/ui/input";
import BlogCard from "@/pages/blogs/blog-card";
import { Search } from "@/assets/icons";

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

// EmptyState component
const EmptyState: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center py-10">
    <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
  </div>
);

// LoaderSpinner component
const LoaderSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
  </div>
);

// Searchbar component
const Searchbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (debouncedValue) {
      navigate(`/discover?search=${debouncedValue}`);
    } else if (!debouncedValue && location.pathname === "/discover") {
      navigate("/discover");
    }
  }, [navigate, location.pathname, debouncedValue]);

  return (
    <div className="relative mt-8 max-w-sm block">
      <div className="absolute flex items-center h-full  justify-center">
        <Search />
      </div>
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        placeholder="Search for podcasts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
    </div>
  );
};

// Main Discover component
const Discover: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const podcastsData = useQuery(api.blogs.getBlogBySearch, { search });

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
                {podcastsData.map(
                  ({
                    _creationTime,
                    _id,
                    author,
                    content,
                    published,
                    title,
                  }) => (
                    <BlogCard
                      key={_id}
                      _creationTime={_creationTime}
                      _id={_id}
                      author={author}
                      content={content}
                      published={published}
                      title={title}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;

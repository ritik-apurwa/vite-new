import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CodeView from "@/components/providers/codebox/codeview";
import CodeForm from "@/components/providers/code-form";
import { useDebounce } from "@/lib/utils";
import { CodeViewLoading, EmptyState } from "./snippet-coms";

const Searchbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (debouncedValue) {
      navigate(`/snippets?search=${debouncedValue}`);
    } else if (!debouncedValue && location.pathname === "/snippets") {
      navigate("/snippets");
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
const Snippets: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const codeData = useQuery(api.code.getCodeBySearch, { search });

  return (
    <div className="flex flex-col gap-10 py-10">
      <div className="grid grid-cols-12 w-screen max-w-7xl mx-auto gap-5">
        <div className="col-span-5">
          <div className="prose prose-base dark:prose-invert lg:prose-lg">
            <h2>Snippets </h2>
            <h3>
              {" "}
              {!search ? "New Snippets on Top" : "Search results for "}
              {search && <span className="text-white-2"> "{search}" </span>}
            </h3>
          </div>
        </div>
        <div className="col-span-3">
          <Searchbar />
        </div>

        <div className="col-span-4 flex flex-row items-start gap-x-4 justify-center">
          <CodeForm type="create" />
          <Button variant="outline" className="gap-x-2">
            <Filter />
            <span className="hidden md:flex">Filter</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-9">
        {codeData ? (
          <>
            {codeData.length > 0 ? (
              <div className="blog_grid grid lg:grid-cols-2 gap-4 w-screen max-w-7xl mx-auto">
                {codeData.map(({ _id, file , title }) => (
                  <div className="" key={_id}>
                    <CodeView codeId={_id} file={file} title={title} />
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
              <CodeViewLoading key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippets;

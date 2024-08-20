import { Search } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export const BlogSearchInput: React.FC = () => {
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

  const EmptyState: React.FC<{ title: string }> = ({ title }) => (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
    </div>
  );
  
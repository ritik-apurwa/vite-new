import React, { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Filter } from "@/assets/icons";

interface BlogFilterProps {
  onFilterChange: (author: string | null, category: string | null) => void;
}

const BlogFilter: React.FC<BlogFilterProps> = ({ onFilterChange }) => {
  const authors = useQuery(api.blogs.GetUniqueAuthors);
  const categories = useQuery(api.blogs.GetUniqueCategories);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleApply = () => {
    onFilterChange(selectedAuthor, selectedCategory);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-x-2" size="sm" variant="outline">
          <Filter  />
          Filter
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div>
          <Command>
            <CommandInput placeholder="Search Author or Category" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Authors">
                {authors?.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => setSelectedAuthor(item)}
                  >
                    {item}
                    {selectedAuthor === item && " ✓"}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Categories">
                {categories?.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => setSelectedCategory(item)}
                  >
                    {item}
                    {selectedCategory === item && " ✓"}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setSelectedAuthor(null);
            setSelectedCategory(null);
          }}>
            Clear
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleApply}>Apply</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlogFilter;
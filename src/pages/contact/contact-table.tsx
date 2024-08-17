import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "@/assets/icons";

const ITEMS_PER_PAGE = 10;

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

const Searchbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (debouncedValue) {
      navigate(`/admin?search=${debouncedValue}`);
    } else if (!debouncedValue && location.pathname === "/admin") {
      navigate("/admin");
    }
  }, [navigate, location.pathname, debouncedValue]);

  return (
    <div className="relative max-w-md mx-auto mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search />
      </div>
      <Input
        className="pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Search for contacts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

const ContactFormTable: React.FC = () => {
    const [cursor, setCursor] = useState<Id<"contacts"> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const debouncedSearch = useDebounce(search, 500);
  
    const queryResult = useQuery(api.contact.GetLimitedContactForms, {
      limit: ITEMS_PER_PAGE,
      cursor: cursor ?? undefined,
      search: debouncedSearch,
    });
  
    const contact_forms = queryResult?.contact_forms ?? [];
    const nextCursor = queryResult?.nextCursor as Id<"contacts"> | null;
  
    const deleteContactForm = useMutation(api.contact.DeleteContactForm);
  
    const handleDelete = async (id: Id<"contacts">) => {
      await deleteContactForm({ id });
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setCursor(null); // Reset cursor to get previous page
      }
    };
  
    const handleNextPage = () => {
      if (nextCursor) {
        setCurrentPage(currentPage + 1);
        setCursor(nextCursor);
      }
    };
  
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  
    return (
      <div className="p-6 space-y-6">
        <Searchbar />
        <div className="shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="p-4">Index</TableHead>
                <TableHead className="p-4">Name</TableHead>
                <TableHead className="p-4">Email</TableHead>
                <TableHead className="p-4">Message</TableHead>
                <TableHead className="p-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contact_forms.map((form, index) => (
                <TableRow key={form._id} className="hover:bg-card">
                  <TableCell className="p-4">{startIndex + index}</TableCell>
                  <TableCell className="p-4">{form.name}</TableCell>
                  <TableCell className="p-4">{form.email}</TableCell>
                  <TableCell className="p-4">
                    {form.message.substring(0, 50)}...
                  </TableCell>
                  <TableCell className="p-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(form._id)}
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage} 
              
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage} 
      
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

export default ContactFormTable;

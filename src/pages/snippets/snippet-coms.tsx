import { Skeleton } from "@/components/ui/skeleton";



export const CodeViewLoading: React.FC = () => {
  return (
    <section className="border rounded-md">
      <div
        id="Header"
        className="flex flex-row border-b-2 w-full items-center px-2 py-2 justify-between min-w-full"
      >
        <Skeleton className="w-1/4 h-6" />
        <div className="flex flex-row gap-x-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>

      <div id="code-box" className="relative">
        <div
          id="code_preview"
          className="absolute w-full no-scrollbar overflow-auto h-full pb-4 pt-2 top-0"
          style={{ height: "384px" }} // Max height of 384px (96rem) like in the original CodeView
        >
          <Skeleton  className="w-full h-4 mb-2" />
        </div>
      </div>
    </section>
  );
};



export const EmptyState: React.FC<{ title: string }> = ({ title }) => (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
    </div>
  );
  
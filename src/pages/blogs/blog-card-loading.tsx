import { Skeleton } from "@/components/ui/skeleton";

const BlogCardLoading = () => {
  return (
    <div className=" size-full border-2 flex flex-col gap-3  shadow-lg rounded-lg overflow-hidden">
      <div className="id_image">
        <Skeleton id="published time" className="w-full  h-60" />
      </div>

      <div className="flex flex-col gap-2 px-6 ">
        <Skeleton id="title" className="w-40 h-5" />
        <Skeleton id="author" className="w-60 h-5" />
        <Skeleton id="published time" className="w-80 h-5" />
      </div>
      <div id="para" className="px-6 flex flex-col gap-y-2">
        <Skeleton id="published time" className="w-full h-5" />
        <Skeleton id="published time" className="w-full h-5" />
      </div>

      <div className="flex justify-between px-6 py-3 items-center">
        <div className="flex space-x-4">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </div>
        <Skeleton className="w-24 h-5" />
      </div>
    </div>
  );
};

export default BlogCardLoading;

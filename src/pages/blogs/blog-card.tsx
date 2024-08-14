import BlogForm from "@/components/providers/blog-form";
import { convertToIST } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";

type BlogTypes = Doc<"blogs">;

const BlogCard = ({
  _creationTime,
  _id,
  author,
  content,
  published,
  title,
}: BlogTypes) => {
  return (
    <div className="max-w-2xl mx-auto border-2 shadow-lg rounded-lg overflow-hidden ">
      <div className="p-6">
        <h1 className="text-2xl font-bold  mb-3">
          {title}
        </h1>
        <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          By {author}
        </h2>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Published on {convertToIST(_creationTime)}
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {content}
        </p>
        <div className="flex space-x-4">
          <BlogForm type="update" initialData={_id} />
          <BlogForm type="delete" initialData={_id} />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

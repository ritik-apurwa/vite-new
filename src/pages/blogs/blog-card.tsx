import FadeImageCarousel from "@/components/providers/auto-scroll/fade-image-carousel";
import BlogForm from "@/components/providers/blog-form";
import { convertToIST } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";

type BlogTypes = Doc<"blogs">;

const BlogCard = ({
  _creationTime,
  _id,
  author,
  content,
  title,
  category,
  images,
}: BlogTypes) => {
  const Images = ({ img }: { img: string }) => {
    return (
      <div className="flex justify-center py-4 items-center h-full w-full">
      <img src={img} className="w-auto object-cover h-60" alt="" />
    </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto border-2 shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-full">
        <FadeImageCarousel
          slides={images.map((img) => (
            <Images key={img.url} img={img.url} />
          ))}
          options={{ startIndex: 0 }}
        />
        <span className="absolute top-2 right-2 px-2 py-1 bg-teal-500 text-white text-xs rounded-md">
          {category}
        </span>
      </div>
      <div className="p-6 bg-gradient-to-r from-white to-teal-50 dark:from-gray-800 dark:to-teal-800">
        <h1 className="text-2xl font-bold mb-3 text-teal-600 dark:text-teal-300">
          {title}
        </h1>
        <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          By <span className="font-medium">{author}</span>
        </h2>
        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Published on {convertToIST(_creationTime)}
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-4">
          {content}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <BlogForm type="update" initialData={_id} />
            <BlogForm type="delete" initialData={_id} />
          </div>
          <button className="text-teal-500 hover:underline dark:text-teal-300">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

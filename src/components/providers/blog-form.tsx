import React, { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import CustomForm, { FormType } from "@/components/providers/custom-form";
import { BlogFormData, blogSchemaZod } from "@/types";
import OpenFormButton from "./control-opener";
import { SelectItem } from "../ui/select";
import UploadImages from "./image-upload";


interface BlogControlProps {
  initialData?: Id<"blogs">;
  type: "create" | "update" | "delete";
}

const BlogForm: React.FC<BlogControlProps> = ({ type, initialData }) => {
  const [, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>([]);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchemaZod),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
      published: false,
      images: [],
    },
  });

  const createBlog = useMutation(api.blogs.create);
  const updateBlog = useMutation(api.blogs.update);
  const deleteBlog = useMutation(api.blogs.deleteBlog);
  const getBlog = useQuery(
    api.blogs.getBlog,
    initialData ? { id: initialData } : "skip"
  );

  useEffect(() => {
    if (getBlog && type !== "create") {
      form.reset(getBlog);
      setImages(getBlog.images.map(img => img.url));
      setImageStorageIds(getBlog.images.map(img => img.storageId));
    }
  }, [getBlog, form, type]);

  const handleSubmit = async (values: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const imageData = images.map((url, index) => ({
        url,
        storageId: imageStorageIds[index],
      }));

      if (type === "create") {
        await createBlog({ ...values, images: imageData });
      } else if (type === "update" && initialData) {
        await updateBlog({ id: initialData, ...values, images: imageData });
      } else if (type === "delete" && initialData) {
        await deleteBlog({ blogId: initialData });
      }
      form.reset();
      setImages([]);
      setImageStorageIds([]);
    } catch (error) {
      console.error(`Error ${type}ing blog:`, error);
    }
    setIsSubmitting(false);
  };

  return (
    <OpenFormButton
      type={type}
      buttonName="Blog"
      formHeader="Blog Form"
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => {
        form.reset();
        setImages([]);
        setImageStorageIds([]);
      }}
    >
      <Form {...form}>
        <form className="space-y-4">
          {type !== "delete" && (
            <>
              <CustomForm
                control={form.control}
                name="title"
                label="Title"
                placeholder="Enter blog title (min 5 characters)"
                formType={FormType.INPUT}
              />
              <CustomForm
                control={form.control}
                name="content"
                label="Content"
                placeholder="Enter blog content (min 50 characters)"
                formType={FormType.TEXTAREA}
              />
              <CustomForm
                control={form.control}
                name="author"
                label="Author"
                placeholder="Enter author name"
                formType={FormType.INPUT}
              />
              <CustomForm
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select Category"
                formType={FormType.SELECT}
              >
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="java">Travel</SelectItem>
              </CustomForm>
              <CustomForm
                control={form.control}
                name="published"
                label="Published"
                formType={FormType.CHECKBOX}
              />
              <UploadImages
                setImages={setImages}
                setImageStorageIds={setImageStorageIds}
                images={images}
              />
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default BlogForm;
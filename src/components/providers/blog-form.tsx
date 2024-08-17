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
import UploadImage from "./uploadImage/upload-image";

interface BlogControlProps {
  initialData?: Id<"blogs">;
  type: "create" | "update" | "delete";
}

const BlogForm: React.FC<BlogControlProps> = ({ type, initialData }) => {
  const [, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<
    { url: string; storageId: Id<"_storage"> }[]
  >([]);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchemaZod),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
      published: false,
    },
  });

  const createBlog = useMutation(api.blogs.CreateBlog);
  const updateBlog = useMutation(api.blogs.UpdateBlog);
  const deleteBlog = useMutation(api.blogs.DeleteBlog);
  const getBlog = useQuery(
    api.blogs.GetBlogID,
    initialData ? { id: initialData } : "skip"
  );

  useEffect(() => {
    if (getBlog && type !== "create") {
      form.reset(getBlog);
      setImages(getBlog.images);
    }
  }, [getBlog, form, type]);

  const handleSubmit = async (values: BlogFormData) => {
    setIsSubmitting(true);
    try {
      if (type === "create") {
        await createBlog({ ...values, images });
      } else if (type === "update" && initialData) {
        await updateBlog({ id: initialData, ...values, images });
      } else if (type === "delete" && initialData) {
        await deleteBlog({ id: initialData });
      }
      form.reset();
      setImages([]);
      return true; // Indicate successful submission
    } catch (error) {
      console.error(`Error ${type}ing blog:`, error);
      return false; // Indicate failed submission
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OpenFormButton
      type={type}
      buttonName="Blog"
      formHeader="Blog Form"
      isValid={form.formState.isValid} // Pass form validity
      isSubmitting={form.formState.isSubmitting} // Pass submission state
      onSubmit={async () => {
        const isValid = await form.trigger();
        if (!isValid) return false;
        return handleSubmit(form.getValues());
      }}
      onCancel={() => {
        form.reset();
        setImages([]);
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
                <SelectItem value="travel">Travel</SelectItem>
              </CustomForm>
              <CustomForm
                control={form.control}
                name="published"
                label="Published"
                formType={FormType.CHECKBOX}
              />
              <UploadImage initialImages={images} onImageUpdate={setImages} />
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default BlogForm;

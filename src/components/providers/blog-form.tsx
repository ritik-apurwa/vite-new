import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import CustomForm, { FormType } from "@/components/providers/custom-form";
import { blogSchemaZod } from "@/types";
import OpenFormButton from "./control-opener";

type BlogFormData = z.infer<typeof blogSchemaZod>;

interface BlogControlProps {
  initialData?: Id<"blogs">;
  type: "create" | "update" | "delete";
}

const BlogForm: React.FC<BlogControlProps> = ({ type, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchemaZod),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      published: false,
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
    }
  }, [getBlog, form, type]);

  const handleSubmit = async (values: BlogFormData) => {
    setIsSubmitting(true);
    try {
      if (type === "create") {
        await createBlog(values);
      } else if (type === "update" && initialData) {
        await updateBlog({ id: initialData, ...values });
      } else if (type === "delete" && initialData) {
        await deleteBlog({ blogId: initialData });
      }
      form.reset();
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
      onCancel={() => form.reset()}
    >
      <Form {...form}>
        <form className="space-y-4">
          {type !== "delete" && (
            <>
              <CustomForm
                control={form.control}
                name="title"
                label="Title"
                placeholder="Enter blog title (min 10 characters)"
                formType={FormType.INPUT}
              />
              <CustomForm
                control={form.control}
                name="content"
                label="Content"
                placeholder="Enter blog content (min 100 characters)"
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
                name="published"
                label="Published"
                formType={FormType.CHECKBOX}
              />
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default BlogForm;

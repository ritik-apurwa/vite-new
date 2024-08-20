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
import UploadImage, { ImageData } from "./uploadImage/upload-image";

interface BlogControlProps {
  initialData?: Id<"blogs">;
  type: "create" | "update" | "delete";
}

const BlogForm: React.FC<BlogControlProps> = ({ type, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [initialImages, setInitialImages] = useState<ImageData[]>([]);
  const [newlyAddedImages, setNewlyAddedImages] = useState<ImageData[]>([]);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchemaZod),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
      imageId: [],
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
  const deleteUnusedImages = useMutation(api.blogs.DeleteUnusedImages);

  useEffect(() => {
    if (getBlog && type !== "create") {
      form.reset(getBlog);
      setImages(getBlog.imageId);
      setInitialImages(getBlog.imageId);
    }
  }, [getBlog, form, type]);

  const handleSubmit = async (values: BlogFormData) => {
    setIsSubmitting(true);
    try {
      if (type === "create") {
        await createBlog({ ...values, imageId: images });
      } else if (type === "update" && initialData) {
        const { _id, _creationTime, ...updateData } = values as any;
        await updateBlog({ id: initialData, ...updateData, imageId: images });
      } else if (type === "delete" && initialData) {
        await deleteBlog({ id: initialData });
      }
      form.reset();
      setImages([]);
      setInitialImages([]);
      setNewlyAddedImages([]);
      return true;
    } catch (error) {
      console.error(`Error ${type}ing blog:`, error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (type === "create") {
      // Delete all uploaded images for create operation
      if (images.length > 0) {
        await deleteUnusedImages({
          imageIds: images.map((img) => img.storageId),
        });
      }
      setImages([]);
    } else if (type === "update") {
      // For update, delete only newly added images
      if (newlyAddedImages.length > 0) {
        await deleteUnusedImages({
          imageIds: newlyAddedImages.map((img) => img.storageId),
        });
      }
      setImages(initialImages);
    }
    setNewlyAddedImages([]);
    form.reset();
  };


  const handleImageDelete = async (deletedImage: ImageData) => {
    if (type === "update") {
      // Remove from newlyAddedImages if it's there
      setNewlyAddedImages(
        newlyAddedImages.filter(
          (img) => img.storageId !== deletedImage.storageId
        )
      );
    }
    // Remove from images
    setImages(images.filter((img) => img.storageId !== deletedImage.storageId));
    // Delete the image from storage
    await deleteUnusedImages({ imageIds: [deletedImage.storageId] });
  };

  return (
    <OpenFormButton
      type={type}
      buttonName="Blog"
      formHeader="Blog Form"
      isValid={form.formState.isValid}
      isSubmitting={isSubmitting}
      onSubmit={async () => {
        const isValid = await form.trigger();
        if (!isValid) return false;
        return handleSubmit(form.getValues());
      }}
      onCancel={handleCancel}
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
                <SelectItem value="Personal">Personal</SelectItem>
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
              <UploadImage
                images={images}
                setImages={setImages}
                onDelete={handleImageDelete}
              />
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default BlogForm;

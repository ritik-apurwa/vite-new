import { useState } from "react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import OpenFormButton from "./control-opener";
import { useForm } from "react-hook-form";
import { imageDataSchemaZod, ImageDataType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomForm, { FormType } from "./custom-form";
import { useToast } from "@/components/ui/use-toast";

interface ImageDataProps {
  initialData?: Id<"imageData">;
  type: "create" | "update" | "delete";
}

const ImageDataForm = ({ type, initialData }: ImageDataProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createImageData = useMutation(api.imagedata.createImageData);
  const updateImageData = useMutation(api.imagedata.updateImageData);
  const deleteImageData = useMutation(api.imagedata.deleteImageData);

  const form = useForm<ImageDataType>({
    resolver: zodResolver(imageDataSchemaZod),
    defaultValues: {
      title: "",
      images: [],
    },
  });

  const handleSubmit = async (values: ImageDataType) => {
    setIsSubmitting(true);
    try {
      if (type === "create") {
        await createImageData(values);
      } else if (type === "update" && initialData) {
        await updateImageData({ id: initialData, ...values });
      } else if (type === "delete" && initialData) {
        await deleteImageData({ imageDataId: initialData });
      }
      form.reset();
      toast({ title: "Image data operation successful" });
    } catch (error) {
      console.error(`Error ${type}ing image data:`, error);
      toast({ title: `Error ${type}ing image data`, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <OpenFormButton
      type={type}
      buttonName="Upload Images"
      formHeader="Upload Images with This Form"
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => {
        form.reset();
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
                placeholder="Enter image title (min 1 character)"
                formType={FormType.INPUT}
              />
              <CustomForm
                control={form.control}
                name="images"
                label="Images"
                formType={FormType.IMAGEUPLOAD}
              />
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default ImageDataForm;
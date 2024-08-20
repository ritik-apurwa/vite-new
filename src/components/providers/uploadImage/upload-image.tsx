import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { Loader, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

export interface ImageData {
  url: string;
  storageId: Id<"_storage">;
}

export interface UploadImageProps {
  images: ImageData[];
  setImages: (newImages: ImageData[]) => void;
  onDelete: (deletedImage: ImageData) => Promise<void>;
}

export const UploadImage = ({
  images,
  setImages,
  onDelete,
}: UploadImageProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.GenerateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.blogs.GetUrl);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);

    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      const imageUrl = await getImageUrl({ storageId });

      const newImage = { url: imageUrl!, storageId };
      setImages([...images, newImage]);
      setIsImageLoading(false);
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error) {
      console.log(error);
      toast({ title: "Error uploading image", variant: "destructive" });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: "Error uploading image", variant: "destructive" });
    }
  };

  const deleteImage = async (image: ImageData) => {
    try {
      await onDelete(image);
      toast({
        title: "Image deleted successfully",
      });
    } catch (error) {
      toast({ title: "Error deleting image", variant: "destructive" });
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    imageRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-row gap-x-5 justify-between">
        <div className=" flex flex-row border-2 border-red-400 px-4 gap-x-2">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img
                src={image.url}
                width={200}
                height={200}
                className="mt-5 size-24"
                alt={`thumbnail-${index}`}
              />
              <Button
                variant="outline"
                size="lg"
                onClick={() => deleteImage(image)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>

        <div className="h-auto w-full flex justify-start items-center ">
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          <button className="h-full w-48 items-center border-2 border-dotted border-spacing-8 flex justify-center" onClick={handleUploadClick}>
            {!isImageLoading ? (
              <Upload />
            ) : (
              <div className="text-16 flex-center font-medium text-white-1">
                <Loader
                  size={20}
                  className="animate-spin text-teal-400 font-bold ml-2"
                />
                Uploading
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadImage;

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

interface ImageData {
  url: string;
  storageId: Id<"_storage">;
}

interface UploadImageProps {
  initialImages?: ImageData[];
  onImageUpdate: (images: ImageData[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({
  initialImages = [],
  onImageUpdate,
}) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.GenerateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.files.GenerateUploadUrl);
  const deleteImage = useMutation(api.files.DeleteFileFromStorage);

  const handleLocalImageClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLocalImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      const files = Array.from(e.target.files);
      let totalProgress = 0;
      let newImages: ImageData[] = [];

      try {
        const uploadPromises = files.map((file) =>
          startUpload([file])
            .then(async (uploaded) => {
              const storageId = (uploaded[0].response as any)
                .storageId as string;
              const url = await getImageUrl({});
              return {
                url,
                storageId,
              };
            })
            .finally(() => {
              totalProgress += (1 / files.length) * 100;
              setUploadProgress(totalProgress);
            })
        );

        const results = await Promise.all(uploadPromises);
        for (const result of results) {
          if (result.url) {
            newImages.push({
              url: result.url,
              storageId: result.storageId,
            });
          }
        }

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImageUpdate(updatedImages);

        toast({ title: "Images uploaded successfully" });
      } catch (error) {
        console.error("Error uploading images:", error);
        toast({ title: "Error uploading images", variant: "destructive" });
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDeleteImage = async (storageId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    
    try {
      await deleteImage({ storageId: storageId as Id<"_storage"> });
      const updatedImages = images.filter((img) => img.storageId !== storageId);
      setImages(updatedImages);
      onImageUpdate(updatedImages);
      toast({ title: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({ title: "Error deleting image", variant: "destructive" });
    }
  };

  return (
    <section className="p-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-center mb-6">
        <Button
          onClick={handleLocalImageClick}
          className="flex flex-col items-center justify-center space-y-2 size-24 p-4"
        >
          <UploadCloud size={24} />
          <span>Computer</span>
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLocalImageChange}
        className="hidden"
        multiple
        accept="image/*"
      />

      <div className="mt-6 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
        <div className="flex flex-row gap-4 flex-wrap">
          {images.map((image) => (
            <div
              key={image.storageId.toString()}
              className="relative size-24 group"
            >
              <img
                src={image.url}
                alt="Uploaded"
                className="size-full object-cover rounded"
              />
              <Button
                className="absolute top-2 size-8 right-2 p-1 bg-red-500/60 hover:bg-red-600/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDeleteImage(image.storageId, e)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="border-4 border-dotted p-4 rounded-lg flex flex-col items-center">
            <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-xs">{uploadProgress.toFixed(2)}%</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadImage;
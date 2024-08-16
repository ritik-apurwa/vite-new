import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface UploadImagesProps {
  setImages: Dispatch<SetStateAction<string[]>>;
  setImageStorageIds: Dispatch<SetStateAction<Id<"_storage">[]>>;
  images: string[];
}

const UploadImages = ({
  setImages,
  setImageStorageIds,
  images,
}: UploadImagesProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.blogs.getUrl);

  const handleImage = async (blobs: Blob[], fileNames: string[]) => {
    setIsImageLoading(true);
    console.log("Starting image upload...");

    try {
      const files = blobs.map(
        (blob, index) => new File([blob], fileNames[index], { type: blob.type })
      );
      console.log("Files prepared for upload:", files);

      let totalProgress = 0;
      const uploadPromises = files.map((file) => {
        return startUpload([file])
          .then((uploaded) => {
            console.log("File uploaded:", uploaded);

            const storageId = (uploaded[0].response as any).storageId;
            console.log("Storage ID obtained:", storageId);

            return getImageUrl({ storageId }).then((url) => {
              console.log("Image URL obtained:", url);
              return { url, storageId };
            });
          })
          .finally(() => {
            totalProgress += (1 / files.length) * 100;
            setUploadProgress(totalProgress);
          });
      });

      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((result) => result.url !== null);
      const storageIds = validResults.map((result) => result.storageId);
      const validImageUrls = validResults.map((result) => result.url as string);

      setImageStorageIds((prevIds) =>
        Array.isArray(prevIds)
          ? [...prevIds, ...storageIds].slice(0, 4)
          : storageIds.slice(0, 4)
      );
      setImages((prevImages) =>
        Array.isArray(prevImages)
          ? [...prevImages, ...validImageUrls].slice(0, 4)
          : validImageUrls.slice(0, 4)
      );
      console.log("Updated image URLs state:", validImageUrls);

      toast({
        title: "Images uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({ title: "Error uploading images", variant: "destructive" });
    } finally {
      setIsImageLoading(false);
      setUploadProgress(0); // Reset progress
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("Image input change detected");

    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const blobs = await Promise.all(
        Array.from(files).map((file) =>
          file.arrayBuffer().then((ab) => new Blob([ab], { type: file.type }))
        )
      );
      const fileNames = Array.from(files).map((file) => file.name);
      console.log("Files and blobs prepared:", { blobs, fileNames });

      handleImage(blobs, fileNames);
    } catch (error) {
      console.error("Error processing images:", error);
      toast({ title: "Error processing images", variant: "destructive" });
    }
  };

  const deleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageStorageIds((prevIds) => prevIds.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden group"
        >
          <img
            height={100}
            width={100}
            src={image}
            className="object-cover w-full h-full"
            alt={`thumbnail ${index + 1}`}
          />
          <Button
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => deleteImage(index)}
          >
            <X size={16} />
          </Button>
        </div>
      ))}
      {images.length < 4 && (
        <div
          className="flex flex-col items-center justify-center w-32 h-32 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => imageRef?.current?.click()}
        >
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={uploadImage}
            multiple
            accept="image/*"
          />
          {!isImageLoading ? (
            <div className="flex flex-col justify-center items-center gap-2">
              <Upload size={24} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-500">
                Upload Image
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-xs">{uploadProgress.toFixed(2)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImages;

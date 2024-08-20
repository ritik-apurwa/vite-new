import React, { useState, useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from "@convex/_generated/dataModel";
import { useUploadFiles } from '@xixixao/uploadstuff/react';
interface ImageData {
    url: string;
    storageId: Id<"_storage">;
  }
interface ImageUploaderProps {
  images: { url: string; storageId: Id<"_storage"> }[];
  onImagesChange: (images: { url: string; storageId: Id<"_storage"> }[]) => void;
}

const ImageUploader = ({ images, onImagesChange }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const generateUploadUrl = useMutation(api.files.GenerateUploadUrl);
  const {startUpload, isUploading} = useUploadFiles(generateUploadUrl)
  const deleteImage = useMutation(api.files.DeleteFileFromStorage);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const url = await fetch(postUrl).then(res => res.url);
      
      // Convert storageId to Id<"_storage">
      const typedStorageId = storageId as unknown as Id<"_storage">;
      
      onImagesChange([...images, { url, storageId: typedStorageId }]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [images, generateUploadUrl, onImagesChange]);


  const uploadImage = async (
    e:React.ChangeEvent<HTMLInputElement>
  ) =>{
    if(e.target.files && e.target.files.length >  0){
        setIsLoading(true);
        const files = Array.from(e.target.files); 
        let newImages: ImageData[] = [];

        try {
            const uploadPromises = files.map((file) => 
            startUpload([file]).then(async (uploadI))
            
            )
        } catch (error ) {
            
        }
    }
  }

  const handleDelete = useCallback(async (storageId: Id<"_storage">) => {
    await deleteImage({ storageId });
    onImagesChange(images.filter(img => img.storageId !== storageId));
  }, [images, deleteImage, onImagesChange]);

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.url} alt={`Upload ${index + 1}`} width="100" />
            <button onClick={() => handleDelete(image.storageId)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
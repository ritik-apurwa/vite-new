import React from 'react';

export interface ImageCardProps {
  imageUrl: string;
  onRemove: () => void;
}

export const ImageCard = ({ imageUrl, onRemove }: ImageCardProps) => (
  <div className="relative">
    <img src={imageUrl} alt="Uploaded" className="max-w-[150px] max-h-[150px]" />
    <button
      onClick={onRemove}
      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
    >
      X
    </button>
  </div>
);

export interface FileUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton = ({ onChange }: FileUploadButtonProps) => (
  <input type="file" onChange={onChange} className="mt-2 p-2 border rounded" />
);

export interface CustomUrlInputProps {
  customUrl: string;
  setCustomUrl: (url: string) => void;
  onAddCustomImage: () => void;
}

export const CustomUrlInput = ({
  customUrl,
  setCustomUrl,
  onAddCustomImage,
}: CustomUrlInputProps) => (
  <div className="flex gap-2 mt-4">
    <input
      type="text"
      value={customUrl}
      onChange={(e) => setCustomUrl(e.target.value)}
      placeholder="Enter image URL"
      className="p-2 border rounded flex-1"
    />
    <button
      onClick={onAddCustomImage}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Add Image
    </button>
  </div>
);

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link, X } from "lucide-react";
import { useState } from "react";

const UploadImageUrl = () => {
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<{ url: string }[]>([]);

  const validateImageUrl = (url: string) => {
    const img = new Image();
    img.onload = () => setIsUrlValid(true);
    img.onerror = () => setIsUrlValid(false);
    img.src = url;
  };

  const handleUrlInputChange = (value: string) => {
    setUrlInput(value);
    validateImageUrl(value);
    console.log("URL input changed:", value);
  };

  const handleSubmitUrl = async () => {
    if (isUrlValid && urlInput) {
      setIsLoading(true);
      console.log("Submitting URL:", urlInput);
      try {
      
        const newImage = { url: urlInput, };
        console.log("Image added:", newImage);

        setImages((prev) => [...prev, newImage]);
        console.log("Updated images list:", [...images, newImage]);

        setUrlInput("");
        toast({ title: "URL image added successfully" });
      } catch (error) {
        console.error("Error adding URL image:", error);
        toast({ title: "Error adding URL image", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteImage = (url: string) => {
    console.log("Deleting image with URL:", url);
    setImages((prev) => prev.filter((image) => image.url !== url));
    console.log("Updated images list after deletion:", images);
  };

  return (
    <div>
      <Button className="flex flex-col items-center justify-center space-y-2 size-24 p-4">
        <Link size={24} />
        <span>Image URL</span>
      </Button>

      <div className="space-y-4 max-w-sm mx-auto">
        <Input
          type="text"
          value={urlInput}
          placeholder="Enter Image URL"
          onChange={(e) => handleUrlInputChange(e.target.value)}
          className={`w-full p-2 border rounded ${!isUrlValid ? "border-red-500" : ""}`}
        />
        {!isUrlValid && (
          <p className="text-red-500 text-sm">This URL is not a valid image.</p>
        )}
        <Button
          onClick={handleSubmitUrl}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
          disabled={!isUrlValid || isLoading}
        >
          {isLoading ? "Adding..." : "Add URL Image"}
        </Button>
      </div>

      <div className="mt-6 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
        <div className="flex flex-row gap-4 flex-wrap">
          {images.map((image) => (
            <div key={image.url} className="relative size-24 group">
              <img
                src={image.url}
                alt="Uploaded"
                className="size-full object-cover rounded"
              />
              <Button
                className="absolute top-2 size-8 right-2 p-1 bg-red-500/60 hover:bg-red-600/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteImage(image.url)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadImageUrl;

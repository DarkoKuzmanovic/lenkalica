import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    await onUpload(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <button type="button" onClick={handleClick} className="btn btn-ghost btn-sm gap-2">
        <PhotoIcon className="h-5 w-5" />
        Add Image
      </button>
    </div>
  );
}

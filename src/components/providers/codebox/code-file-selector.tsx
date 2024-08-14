import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeFile {
  fileName: string;
  code: string;
  language: string;
}

interface FileSelectorProps {
  files: CodeFile[];
  onFileSelect: (file: CodeFile) => void;
}

export const FileSelector: React.FC<FileSelectorProps> = ({ files, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);

  const handleSelect = (filename: string) => {
    const file = files.find((file) => file.fileName === filename);
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <Select onValueChange={(value) => handleSelect(value)}>
      <SelectTrigger className="h-full border-2 w-full">
        <SelectValue
          className="capitalize"
          placeholder={selectedFile.fileName}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Files</SelectLabel>
          {files.map((file) => (
            <SelectItem
              key={file.fileName}
              className="flex items-center"
              value={file.fileName}
            >
              <span className="ml-2">{file.fileName}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
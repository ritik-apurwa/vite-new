import React, { useEffect, useState } from "react";
import { useTheme } from "../theme-provider";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import CopyToClipBoard from "./copy-to-clipboard";
import { FileSelector } from "./code-file-selector";
import CodeForm from "../code-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@convex/_generated/dataModel";
import { HiDotsVertical } from "react-icons/hi";

interface CodeFile {
  fileName: string;
  code: string;
  language: string;
}

interface CodeViewProps {
  file: CodeFile[];
  title: string;
  codeId: Id<"codes">;
}

const CodeView: React.FC<CodeViewProps> = ({ file, title, codeId }) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<CodeFile>(file[0]);
  const [codeHeight, setCodeHeight] = useState<number>(0);

  useEffect(() => {
    const codeLines = selectedFile.code.split("\n");
    const lineHeight = 22; // Adjust this based on your preferred line height
    const height = Math.min(codeLines.length * lineHeight, 600); // Max height of 384px (96rem)
    setCodeHeight(height);
  }, [selectedFile]);

  const handleFileChange = (newFile: CodeFile) => {
    setSelectedFile(newFile);
  };

  const customTheme = theme === "dark" ? atomOneDark : atomOneLight;
  const customBG = theme === "dark" ? "#09090B" : "white";
  const customText = theme === "dark" ? "white" : "black";

  const UpdateAndDelete = () => {
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="border-2 p-0.5 size-10 flex justify-center items-center rounded-md">
              <HiDotsVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-row md:flex-col  items-center justify-center gap-2">
            <DropdownMenuItem asChild>
              <CodeForm type="update" initialData={codeId} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <CodeForm type="delete" initialData={codeId} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <section className="border rounded-md">
      <div
        id="Header"
        className="flex flex-row border-b-2 w-full items-center px-2 py-2  justify-between min-w-full"
      >
        <h1 className="font-semibold text-sm ">{title}</h1>
        <div className="flex flex-row  gap-x-2">
          <FileSelector files={file} onFileSelect={handleFileChange} />

          <UpdateAndDelete />
          <CopyToClipBoard
            text={selectedFile.code}
            codeName={selectedFile.fileName}
          />
        </div>
      </div>

      <div
        id="code-box"
        className="relative"
        style={{ height: `${codeHeight}px` }}
      >
        <div
          id="code_preview"
          className="absolute w-full no-scrollbar overflow-auto h-full pb-4 pt-2 top-0"
        >
          <SyntaxHighlighter
            customStyle={{
              lineHeight: "22px",
              fontFamily: "monospace",
              margin: 0,
              backgroundColor: customBG,
              color: customText,
              fontSize: "14px",
              padding: "10px",
            }}
            language={selectedFile.language}
            style={customTheme}
            showLineNumbers
            wrapLines
          >
            {selectedFile.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
};

export default CodeView;

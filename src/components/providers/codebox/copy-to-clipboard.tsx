import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import copy from "copy-text-to-clipboard";
import { motion } from "framer-motion";
import { LucideCheck, LucideCopy } from "lucide-react";

interface CopyToClipBoardProps {
  text: string;
  codeName?: string;
}

const CopyToClipBoard = ({ text, codeName }: CopyToClipBoardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyAction = () => {
    copy(text);
    toast({
      title: `${codeName === undefined ? "selected file" : codeName} text copied!`,
      description: "The text has been copied to your clipboard.",
      duration: 1000,
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1100);
  };

  return (
    <motion.div className="flex justify-center items-center">
      {copied ? (
        <motion.button
          disabled={copied}
          initial={{
            opacity: 0,
            height: "10px",
            width: "10px",
            backgroundColor: "#000",
            borderRadius: "50%",
          }}
          animate={{
            opacity: 1,
            height: "100%",
            width: "100%",
            backgroundColor: "#10b981", // Green color transition
          }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center min-h-10 min-w-10 size-12 rounded-md"
        >
          <LucideCheck className="w-6 h-6 text-white" />
        </motion.button>
      ) : (
        <button
          onClick={copyAction}
          className="border-2 p-0.5 size-10 flex justify-center items-center rounded-md"
        >
          <LucideCopy className="size-5" />
        </button>
      )}
    </motion.div>
  );
};

export default CopyToClipBoard;

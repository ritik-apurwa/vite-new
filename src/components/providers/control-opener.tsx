import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { IoCreateOutline } from "react-icons/io5";
import { LiaEdit } from "react-icons/lia";
import { AiOutlineDelete } from "react-icons/ai";

// Updated interface to include isValid and isSubmitting props
interface OpenFormButtonProps {
  type?: "create" | "update" | "delete";
  formHeader: string;
  buttonName?: string;
  children: React.ReactNode;
  className?: string;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  isValid: boolean; // New prop to indicate form validity
  isSubmitting: boolean; // New prop to indicate form submission state
}

const OpenFormButton: React.FC<OpenFormButtonProps> = ({
  type,
  children,
  buttonName,
  formHeader,
  className,
  onSubmit,
  onCancel,
  isValid,
  isSubmitting,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  const getOpenButton = () => {
    switch (type) {
      case "create":
        return (
          <Button
            className="w-12 md:w-auto flex justify-center items-center gap-2"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <IoCreateOutline className="" size={18} />
            <span className="hidden md:flex items-center justify-center">
              Create {buttonName}
            </span>
          </Button>
        );
      case "update":
        return (
          <Button
            className="w-12 md:w-auto flex justify-center items-center gap-2"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <LiaEdit size={18} />
            <span className="hidden md:flex items-center justify-center">
              Update {buttonName}
            </span>
          </Button>
        );
      case "delete":
        return (
          <Button
            className="w-12 md:w-auto bg-red-600/80 dark:bg-red-500/60 text-white flex justify-center items-center gap-2"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <AiOutlineDelete size={18} />
            <span className="hidden md:flex items-center justify-center">
              Delete {buttonName}
            </span>
          </Button>
        );
      default:
        return null;
    }
  };

  const getSubmitButton = () => {
    switch (type) {
      case "create":
        return (
          <>
            <IoCreateOutline className="" size={18} />
            Create {buttonName}
          </>
        );
      case "update":
        return (
          <>
            <LiaEdit size={18} />
            Update {buttonName}
          </>
        );
      case "delete":
        return (
          <>
            <AiOutlineDelete size={18} />
            Delete {buttonName}
          </>
        );
      default:
        return null;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "create":
        return "When creating a new blog, fill out the form below.";
      case "update":
        return "Update the blog with the changes you made in the form below.";
      case "delete":
        return "If you want to delete this blog, click the delete button below.";
      default:
        return "";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{getOpenButton()}</AlertDialogTrigger>
      <AlertDialogContent
        className={`container mx-auto max-w-5xl max-h-screen overflow-y-auto no-scrollbar ${className || ""}`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{formHeader}</AlertDialogTitle>
        </AlertDialogHeader>
        {type && (
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        )}
        {children}
        <AlertDialogFooter className="flex flex-row gap-x-4 items-center h-14">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            disabled={(type !== "delete" && !isValid) || isSubmitting}  // Disable button based on form validity and submission state
            className="flex flex-row gap-x-2"
            onClick={handleSubmit}
          >
            {getSubmitButton()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OpenFormButton;

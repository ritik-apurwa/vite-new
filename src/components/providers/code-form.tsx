import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import OpenFormButton from "./control-opener";
import CustomForm, { FormType } from "./custom-form";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

// Define the schema for a single code file
const codeFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
});

// Define the schema for the entire form
const codeSchemaZod = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  file: z.array(codeFileSchema).min(1, "At least one file is required"),
});

type CodeFormValues = z.infer<typeof codeSchemaZod>;

interface CodeControlProps {
  initialData?: Id<"codes">;
  type: "create" | "update" | "delete";
}

const CodeForm: React.FC<CodeControlProps> = ({ type, initialData }) => {
  const form = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchemaZod),
    defaultValues: {
      title: "",
      category: "",
      file: [{ fileName: "", code: "", language: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "file",
  });

  const createCode = useMutation(api.code.createCode);
  const updateCode = useMutation(api.code.updateCode);
  const deleteCode = useMutation(api.code.deleteCode);
  const getCode = useQuery(
    api.code.getCode,
    initialData ? { id: initialData } : "skip"
  );

  useEffect(() => {
    if (getCode && type !== "create") {
      form.reset(getCode);
    }
  }, [getCode, form, type]);

  const handleSubmit = async (values: CodeFormValues): Promise<boolean> => {
    try {
      if (type === "create") {
        await createCode(values);
      } else if (type === "update" && initialData) {
        await updateCode({ id: initialData, ...values });
      } else if (type === "delete" && initialData) {
        await deleteCode({ codeId: initialData });
      }
      form.reset();
      return true;
    } catch (error) {
      console.error(`Error ${type}ing code:`, error);
      return false;
    }
  };

  return (
    <OpenFormButton
      type={type}
      buttonName="Code"
      formHeader={`${type.charAt(0).toUpperCase() + type.slice(1)} Code Component`}
      isValid={form.formState.isValid} // Pass form validity
      isSubmitting={form.formState.isSubmitting} // Pass submission state
      onSubmit={async () => {
        const isValid = await form.trigger();
        if (!isValid) return false;
        return await handleSubmit(form.getValues());
      }}
      onCancel={() => {
        form.reset();
      }}
    >
      <Form {...form}>
        <form className="space-y-4">
          {type !== "delete" && (
            <>
              <CustomForm
                control={form.control}
                name="title"
                label="Title"
                placeholder="Enter code title (min 10 characters)"
                formType={FormType.INPUT}
              />

              <CustomForm
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select a category"
                formType={FormType.SELECT}
              >
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="fullstack">Full Stack</SelectItem>
              </CustomForm>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md">
                  <CustomForm
                    control={form.control}
                    name={`file.${index}.fileName`}
                    label="File Name"
                    placeholder="Enter file name"
                    formType={FormType.INPUT}
                  />
                  <CustomForm
                    control={form.control}
                    name={`file.${index}.language`}
                    label="File Language"
                    placeholder="Select a language"
                    formType={FormType.SELECT}
                  >
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </CustomForm>

                  <CustomForm
                    control={form.control}
                    name={`file.${index}.code`}
                    label="Code"
                    className="min-h-60"
                    placeholder="Enter your code here"
                    formType={FormType.TEXTAREA}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Remove File
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ fileName: "", code: "", language: "" })}
              >
                Add One More
              </Button>
            </>
          )}
        </form>
      </Form>
    </OpenFormButton>
  );
};

export default CodeForm;




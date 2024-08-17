import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const contactFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactFormSchema>;

const ContactForm: React.FC = () => {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleFocus = (inputName: string) => setFocusedInput(inputName);

  const handleBlur = () => setFocusedInput(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const createContactForm = useMutation(api.contact.CreateContactForm);

  const onSubmit = async (values: ContactValues) => {
    try {
      await createContactForm({ ...values });
      form.reset();
      setInputValues({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fields = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "message", label: "Hi I wanted you to Tell that" },
  ] as const;

  return (

      <div className="size-full flex justify-center items-center">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 flex flex-col p-6 w-full">
          {fields.map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof ContactValues}
              render={({ field }) => (
                <FormItem className="relative">
                  <motion.div
                    initial={false}
                    animate={{
                      y: focusedInput === name || inputValues[name] ? -24 : 0,
                      scale: focusedInput === name || inputValues[name] ? 0.90 : 1,
                      x: focusedInput === name || inputValues[name] ? -10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`
                        absolute top-2 left-2  pointer-events-none ${focusedInput ? "text-gray-400":"text-gray-600"}`}
                  >
                    <FormLabel>{label}</FormLabel>
                  </motion.div>
                  {name === "message" ? (
                    <Textarea
                      {...field}
                      className="border-x-0 bg-black w-full rounded-none border-t-0 border-b-2 focus-visible:ring-0 border-gray-500 pt-6"
                      onFocus={() => handleFocus(name)}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        field.onChange(e);
                      }}
                      value={inputValues[name]}
                      autoComplete="off"
                    />
                  ) : (
                    <Input
                      {...field}
                      className="border-x-0 bg-black focus:outline-none border-t-0 border-b-2  rounded-none focus-visible:ring-0 border-gray-500 py-2"
                      onFocus={() => handleFocus(name)}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        field.onChange(e);
                      }}
                      value={inputValues[name]}
                      autoComplete="off"
                    />
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 transition-transform ${
                      focusedInput === name || inputValues[name] ? "transform scale-x-100" : "transform scale-x-0"
                    }`}
                    style={{
                      transition: "transform 0.3s ease",
                      transformOrigin: "center",
                    }}
                  />
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" disabled={!form.formState.isValid} className="disabled:bg-opacity-45 w-full">
            Submit
          </Button>
        </form>
      </Form>
      </div>
 
  );
};

export default ContactForm;
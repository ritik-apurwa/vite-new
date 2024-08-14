// import { blogSchemaZod } from "@/types";
// import { useState } from "react";
// import { z } from "zod";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { Button } from "../ui/button";
// import { Plus, Edit, Trash } from "lucide-react";
// import CustomFormField, { FormFieldType } from "../CustomForm";
// import { Form } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { Id } from "convex/_generated/dataModel";

// type BlogFormData = z.infer<typeof blogSchemaZod>;

// interface BlogControlProps {
//   initialData?: BlogFormData & { id: Id<"blogs"> };
//   type: "create" | "update" | "delete";
// }

// const BlogControlNew = ({ type, initialData }: BlogControlProps) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const getBlogControlButtons = () => {
//     switch (type) {
//       case "create":
//         return (
//           <Button variant="outline" size="lg">
//             <Plus className="mr-2" /> Create a Blog
//           </Button>
//         );
//       case "update":
//         return (
//           <Button variant="outline" size="sm">
//             <Edit className="mr-2" /> Edit
//           </Button>
//         );
//       case "delete":
//         return (
//           <Button variant="outline" size="sm">
//             <Trash className="mr-2" /> Delete
//           </Button>
//         );
//       default:
//         return "Blog Operation";
//     }
//   };

//   const SubmitButtons = () => {
//     switch (type) {
//       case "create":
//         return (
//           <Button
//             type="submit"
//             variant="outline"
//             size="lg"
//             disabled={isSubmitting}
//           >
//             <Plus className="mr-2" /> Create Blog
//           </Button>
//         );
//       case "update":
//         return (
//           <Button
//             type="submit"
//             variant="outline"
//             size="lg"
//             disabled={isSubmitting}
//           >
//             <Edit className="mr-2" /> Update Blog
//           </Button>
//         );
//       case "delete":
//         return (
//           <Button
//             type="submit"
//             variant="outline"
//             size="lg"
//             disabled={isSubmitting}
//           >
//             <Trash className="mr-2" /> Delete Blog
//           </Button>
//         );
//       default:
//         return "Blog Operation";
//     }
//   };

//   const form = useForm<BlogFormData>({
//     resolver: zodResolver(blogSchemaZod),
//     defaultValues: initialData || {
//       title: "",
//       content: "",
//       author: "",
//       published: false,
//     },
//   });

//   const createBlog = useMutation(api.blogs.create);
//   const updateBlog = useMutation(api.blogs.update);
//   const deleteBlog = useMutation(api.blogs.deleteBlog);

//   const handleSubmit = async (values: BlogFormData) => {
//     setIsSubmitting(true);
//     try {
//       if (type === "create") {
//         await createBlog(values);
//       } else if (type === "update" && initialData) {
//         await updateBlog({ id: initialData.id, ...values });
//       } else if (type === "delete" && initialData) {
//         await deleteBlog({ blogId: initialData.id });
//       }
//       form.reset();
//     } catch (error) {
//       console.error(`Error ${type}ing blog:`, error);
//     }
//     setIsSubmitting(false);
//   };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>{getBlogControlButtons()}</AlertDialogTrigger>
//       <AlertDialogContent className="container mx-auto max-w-5xl max-h-screen overflow-y-auto no-scrollbar">
//         <AlertDialogHeader>
//           <AlertDialogTitle>Blog Operation</AlertDialogTitle>
//         </AlertDialogHeader>
//         <AlertDialogDescription>
//           {type === "create" && "Create a new blog post"}
//           {type === "update" && "Update the existing blog post"}
//           {type === "delete" &&
//             "Are you sure you want to delete this blog post?"}
//         </AlertDialogDescription>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             {type !== "delete" && (
//               <>
//                 <CustomFormField
//                   control={form.control}
//                   name="title"
//                   label="Title"
//                   placeholder="Enter blog title"
//                   fieldType={FormFieldType.INPUT}
//                 />

//                 <CustomFormField
//                   control={form.control}
//                   name="content"
//                   label="Content"
//                   placeholder="Enter blog content"
//                   fieldType={FormFieldType.TEXTAREA}
//                 />

//                 <CustomFormField
//                   control={form.control}
//                   name="author"
//                   label="Author"
//                   placeholder="Enter author name"
//                   fieldType={FormFieldType.INPUT}
//                 />

//                 <CustomFormField
//                   control={form.control}
//                   name="published"
//                   label="Published"
//                   fieldType={FormFieldType.CHECKBOX}
//                 />
//               </>
//             )}
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction asChild>{SubmitButtons()}</AlertDialogAction>
//             </AlertDialogFooter>
//           </form>
//         </Form>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default BlogControlNew;
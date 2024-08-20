import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import ImageUploader from './uploadImage/image-uploader';
// Assume this is implemented as discussed earlier

// Define the form schema
const testSchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
});

type TestFormData = z.infer<typeof testSchemaZod>;

interface TestFormProps {
  testId?: Id<"test">;
  onSuccess: () => void;
}

const TestForm: React.FC<TestFormProps> = ({ testId, onSuccess }) => {
  const [images, setImages] = useState<{ url: string; storageId: Id<"_storage"> }[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TestFormData>({
    resolver: zodResolver(testSchemaZod),
  });

  const createTest = useMutation(api.test.createTest);
  const updateTest = useMutation(api.test.updateTest);
  const deleteTest = useMutation(api.test.deleteTest);
  const existingTest = useQuery(api.test.getTestId, testId ? { id: testId } : "skip");

  useEffect(() => {
    if (existingTest) {
      reset({ title: existingTest.title });
      setImages(existingTest.images);
    }
  }, [existingTest, reset]);

  const onSubmit = async (data: TestFormData) => {
    try {
      if (testId) {
        await updateTest({ id: testId, ...data, images });
      } else {
        await createTest({ ...data, images });
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async () => {
    if (testId) {
      try {
        await deleteTest({ id: testId });
        onSuccess();
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...register("title")}
          placeholder="Enter test title"
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <ImageUploader
        images={images}
        onImagesChange={setImages}
      />

      <button type="submit">{testId ? 'Update' : 'Create'} Test</button>
      {testId && (
        <button type="button" onClick={handleDelete}>Delete Test</button>
      )}
    </form>
  );
};

export default TestForm;
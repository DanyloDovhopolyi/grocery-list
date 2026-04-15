import * as yup from "yup";

export const groceryFormSchema = yup.object({
  title: yup.string().required("Title is required"),
  amount: yup.string(),
});

export type GroceryFormValues = yup.InferType<typeof groceryFormSchema>;

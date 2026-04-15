import type {
  GroceryItem,
  GroceryItemPayload,
} from "@/services/types/grocery-item";

import { axiosClient } from "./axios-client";

export const apis = {
  getGroceryItems: async () => {
    await new Promise((r) => setTimeout(r, 2500));
    return axiosClient.get<GroceryItem[]>("/groceryItems");
  },

  getGroceryItem: (id: string) =>
    axiosClient.get<GroceryItem>(`/groceryItems/${id}`),

  createGroceryItem: (body: GroceryItemPayload) =>
    axiosClient.post<GroceryItem>("/groceryItems", body),

  updateGroceryItem: (id: string, body: Partial<GroceryItemPayload>) =>
    axiosClient.patch<GroceryItem>(`/groceryItems/${id}`, body),

  deleteGroceryItem: (id: string) =>
    axiosClient.delete<void>(`/groceryItems/${id}`),
};

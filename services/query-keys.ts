export const queryKeys = {
  groceryItems: ["groceryItems"] as const,
  groceryItem: (id: string) => ["groceryItem", id] as const,
};

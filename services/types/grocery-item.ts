export interface GroceryItem {
  id: string;
  title: string;
  amount: string;
  bought: boolean;
}

export type GroceryItemPayload = Omit<GroceryItem, 'id'>;

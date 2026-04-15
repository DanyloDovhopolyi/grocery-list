import type { GroceryItem } from "@/services/types/grocery-item";

export interface GroceryListItemProps {
  item: GroceryItem;
  onToggleBought: (id: string, bought: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

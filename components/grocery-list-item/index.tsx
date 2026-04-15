import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { memo, type FC } from "react";
import { Pressable, View } from "react-native";

import { styles } from "./styles";
import type { GroceryListItemProps } from "./types";

const GroceryListItem: FC<GroceryListItemProps> = ({
  item,
  onToggleBought,
  onEdit,
  onDelete,
}) => {
  const { id, title, amount, bought } = item;

  return (
    <Card className="overflow-hidden p-4">
      <View style={styles.row}>
        <Checkbox
          checked={bought}
          onCheckedChange={(next) => onToggleBought(id, next)}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => onEdit(id)}
          style={styles.body}
        >
          <Text
            className={cn(
              "font-medium",
              bought && "text-muted-foreground line-through",
            )}
            numberOfLines={2}
          >
            {title}
          </Text>
          {amount ? (
            <Text
              variant="muted"
              className="mt-0.5"
              style={styles.amount}
              numberOfLines={1}
            >
              {amount}
            </Text>
          ) : null}
        </Pressable>
        <View style={styles.actions}>
          <Button variant="outline" size="sm" onPress={() => onEdit(id)}>
            <Text>Edit</Text>
          </Button>
          <Button variant="destructive" size="sm" onPress={() => onDelete(id)}>
            <Text>Delete</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
};

export default memo(GroceryListItem, (previousProps, nextProps) => {
  return (
    previousProps.item.id === nextProps.item.id &&
    previousProps.item.title === nextProps.item.title &&
    previousProps.item.amount === nextProps.item.amount &&
    previousProps.item.bought === nextProps.item.bought &&
    previousProps.onToggleBought === nextProps.onToggleBought &&
    previousProps.onEdit === nextProps.onEdit &&
    previousProps.onDelete === nextProps.onDelete
  );
});

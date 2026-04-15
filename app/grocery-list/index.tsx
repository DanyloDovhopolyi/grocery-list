import AppLoading from "@/components/app-loading";
import GroceryListError from "@/components/grocery-list-error";
import GroceryListItem from "@/components/grocery-list-item";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { keyboardVerticalOffset, styles } from "@/features/grocery-list/styles";
import { useGroceryList } from "@/hooks/use-grocery-list";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { FC, PropsWithChildren } from "react";
import { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { GroceryItem } from "@/services/types/grocery-item";

interface GroceryListShellProps extends PropsWithChildren {
  onAddItem: () => void;
}

const GroceryListShell: FC<GroceryListShellProps> = ({
  onAddItem,
  children,
}) => {
  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="w-full max-w-xl flex-1 self-center px-4 pb-4">
          <View className="mb-4 flex-row items-center justify-between gap-3">
            <Text variant="h3" className="flex-1">
              Groceries
            </Text>
            <Button onPress={onAddItem} className="shrink-0">
              <Text>Add</Text>
            </Button>
          </View>
          {children}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const GroceryListContent: FC = () => {
  const router = useRouter();
  const { items, isRefreshing, refresh, toggleBought, removeItem } =
    useGroceryList();

  const handleAddItem = useCallback(() => {
    router.push("/modal");
  }, [router]);

  const handleEdit = useCallback(
    (id: string) => {
      router.push({ pathname: "/modal", params: { id } });
    },
    [router],
  );

  const handleToggleBought = useCallback(
    (id: string, bought: boolean) => {
      toggleBought({ id, bought });
    },
    [toggleBought],
  );

  const confirmDelete = useCallback((id: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const approved = window.confirm(
        "Delete this item from your grocery list?",
      );
      if (approved) {
        removeItem(id);
      }
      return;
    }

    Alert.alert(
      "Delete item",
      "Delete this item from your grocery list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeItem(id),
        },
      ],
      { cancelable: true },
    );
  }, [removeItem]);

  const keyExtractor = useCallback((row: GroceryItem) => row.id, []);

  const renderItem = useCallback<ListRenderItem<GroceryItem>>(
    ({ item }) => (
      <GroceryListItem
        item={item}
        onToggleBought={handleToggleBought}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />
    ),
    [confirmDelete, handleEdit, handleToggleBought],
  );

  return (
    <GroceryListShell onAddItem={handleAddItem}>
      {!items.length ? (
        <View className="flex-1 items-center justify-center py-12">
          <Text variant="muted" className="text-center">
            No items yet. Tap Add to create your first grocery item.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          refreshing={isRefreshing}
          onRefresh={refresh}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      )}
    </GroceryListShell>
  );
};

/**
 * Main screen with query-boundary error handling + suspense fallback.
 */
const GroceryList: FC = () => {
  const router = useRouter();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <GroceryListShell onAddItem={() => router.push("/modal")}>
              <GroceryListError error={error} onRetry={resetErrorBoundary} />
            </GroceryListShell>
          )}
        >
          <Suspense
            fallback={
              <GroceryListShell onAddItem={() => router.push("/modal")}>
                <AppLoading message="Loading groceries..." />
              </GroceryListShell>
            }
          >
            <GroceryListContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default GroceryList;

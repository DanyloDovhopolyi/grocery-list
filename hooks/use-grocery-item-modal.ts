import { apis } from "@/services/apis";
import { queryKeys } from "@/services/query-keys";
import type { GroceryItemPayload } from "@/services/types/grocery-item";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

export const useGroceryItemModal = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const itemId = typeof params.id === "string" ? params.id : params.id?.[0];
  const isEditMode = Boolean(itemId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditMode ? "Edit item" : "Add item" });
  }, [navigation, isEditMode]);

  const itemQuery = useQuery({
    queryKey: itemId ? queryKeys.groceryItem(itemId) : ["groceryItem", "skip"],
    queryFn: async () => {
      const { data } = await apis.getGroceryItem(itemId!);
      return data;
    },
    enabled: Boolean(isEditMode && itemId),
  });

  const createItem = useMutation({
    mutationFn: (body: GroceryItemPayload) => apis.createGroceryItem(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
      router.back();
    },
  });

  const updateItem = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<GroceryItemPayload>;
    }) => apis.updateGroceryItem(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
      if (itemId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.groceryItem(itemId),
        });
      }
      router.back();
    },
  });

  return {
    itemId,
    isEditMode,
    existingItem: itemQuery.data,
    isLoadingItem: itemQuery.isPending,
    isItemError: itemQuery.isError,
    refetchItem: itemQuery.refetch,
    createItem: createItem.mutate,
    updateItem: updateItem.mutate,
    isSaving: createItem.isPending || updateItem.isPending,
  };
};

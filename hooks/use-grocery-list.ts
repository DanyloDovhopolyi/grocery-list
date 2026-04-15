import { apis } from "@/services/apis";
import { queryKeys } from "@/services/query-keys";
import type { GroceryItem } from "@/services/types/grocery-item";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useGroceryList = () => {
  const queryClient = useQueryClient();

  const listQuery = useSuspenseQuery({
    queryKey: queryKeys.groceryItems,
    queryFn: async () => {
      const { data } = await apis.getGroceryItems();
      return data;
    },
  });

  const toggleBought = useMutation({
    mutationFn: ({ id, bought }: { id: string; bought: boolean }) =>
      apis.updateGroceryItem(id, { bought }),
    onMutate: async ({ id, bought }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.groceryItems });

      const previousItems = queryClient.getQueryData<GroceryItem[]>(
        queryKeys.groceryItems,
      );
      queryClient.setQueryData<GroceryItem[]>(
        queryKeys.groceryItems,
        (currentItems) =>
          currentItems?.map((item) =>
            item.id === id ? { ...item, bought } : item,
          ) ?? [],
      );

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.groceryItems, context.previousItems);
      }
    },
    onSuccess: ({ data: updatedItem }) => {
      queryClient.setQueryData<GroceryItem[]>(
        queryKeys.groceryItems,
        (currentItems) =>
          currentItems?.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ) ?? [],
      );
    },
  });

  const removeItem = useMutation({
    mutationFn: (id: string) => apis.deleteGroceryItem(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems }),
  });

  return {
    items: listQuery.data,
    isRefreshing: listQuery.isRefetching,
    refresh: listQuery.refetch,
    toggleBought: toggleBought.mutate,
    removeItem: removeItem.mutate,
  };
};

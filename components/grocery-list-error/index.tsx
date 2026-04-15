import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getApiBaseUrl } from "@/services/constants";
import { isAxiosError } from "axios";
import type { FC } from "react";
import { View } from "react-native";

import { styles } from "./styles";

interface GroceryListErrorProps {
  error: unknown;
  onRetry: () => void;
}

const GroceryListError: FC<GroceryListErrorProps> = ({ error, onRetry }) => {
  const message =
    isAxiosError(error) && error.code === "ERR_NETWORK"
      ? "Network error: could not reach the API."
      : error instanceof Error
        ? error.message
        : "Could not load your list.";

  return (
    <View style={styles.container}>
      <Text className="text-center text-destructive">{message}</Text>
      <Text variant="muted" style={styles.hint}>
        Current API URL:{" "}
        <Text className="font-mono text-xs">{getApiBaseUrl()}</Text>
        {"\n\n"}
        Run <Text className="font-mono text-xs">npm run api</Text> in another
        terminal (port 3001). On a phone, set{" "}
        <Text className="font-mono text-xs">EXPO_PUBLIC_API_URL</Text> if needed
        — see .env.example.
      </Text>
      <Button variant="outline" onPress={onRetry}>
        <Text>Retry</Text>
      </Button>
    </View>
  );
};

export default GroceryListError;

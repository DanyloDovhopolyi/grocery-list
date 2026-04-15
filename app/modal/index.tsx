import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
  keyboardVerticalOffset,
  styles,
} from "@/features/grocery-item-modal/styles";
import { useGroceryItemModal } from "@/hooks/use-grocery-item-modal";
import type { GroceryFormValues } from "@/services/grocery-form-schema";
import { groceryFormSchema } from "@/services/grocery-form-schema";
import type { GroceryItemPayload } from "@/services/types/grocery-item";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { type FC } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

const GroceryItemModal: FC = () => {
  const router = useRouter();
  const {
    itemId,
    isEditMode,
    existingItem,
    isLoadingItem,
    isItemError,
    refetchItem,
    createItem,
    updateItem,
    isSaving,
  } = useGroceryItemModal();

  const initialValues: GroceryFormValues = {
    title: existingItem?.title ?? "",
    amount: existingItem?.amount ?? "",
  };
  const submitLabel = isSaving ? "Saving..." : isEditMode ? "Save" : "Add item";

  if (isEditMode && isLoadingItem) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isEditMode && isItemError) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-center text-destructive">
          Could not load this item.
        </Text>
        <Button variant="outline" onPress={() => refetchItem()}>
          <Text>Retry</Text>
        </Button>
        <Button onPress={() => router.back()}>
          <Text>Go back</Text>
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Formik<GroceryFormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={groceryFormSchema}
        onSubmit={(values) => {
          const title = values.title.trim();
          const amount = values.amount?.trim() ?? "";
          if (isEditMode && itemId) {
            const body: Partial<GroceryItemPayload> = {
              title,
              amount,
              bought: existingItem?.bought ?? false,
            };
            updateItem({ id: itemId, body });
          } else {
            const body: GroceryItemPayload = { title, amount, bought: false };
            createItem(body);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View className="gap-2">
              <Label nativeID="title-label">Title</Label>
              <Input
                accessibilityLabelledBy="title-label"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                placeholder="e.g. Milk"
                autoCapitalize="sentences"
              />
              {touched.title && errors.title ? (
                <Text className="text-destructive text-sm">{errors.title}</Text>
              ) : null}
            </View>

            <View className="gap-2">
              <Label nativeID="amount-label">Amount (optional)</Label>
              <Input
                accessibilityLabelledBy="amount-label"
                value={values.amount}
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                placeholder="e.g. 2 L or 12"
              />
            </View>

            <View className="mt-4 flex-row flex-wrap gap-3">
              <Button
                className="flex-1"
                onPress={() => handleSubmit()}
                disabled={isSaving || isSubmitting}
              >
                <Text>{submitLabel}</Text>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => router.back()}
                disabled={isSaving}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default GroceryItemModal;

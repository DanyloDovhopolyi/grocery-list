import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
});

export const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0;

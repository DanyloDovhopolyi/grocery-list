import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
});

export const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0;

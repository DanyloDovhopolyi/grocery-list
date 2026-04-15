import { Text } from '@/components/ui/text';
import type { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { styles } from './styles';

interface AppLoadingProps {
  message?: string;
}

const AppLoading: FC<AppLoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text variant="muted">{message}</Text>
    </View>
  );
};

export default AppLoading;

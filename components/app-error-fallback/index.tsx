import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { FallbackProps } from 'react-error-boundary';
import { View } from 'react-native';

import { styles } from './styles';

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const message = error instanceof Error ? error.message : 'Unknown error';

  return (
    <View style={styles.container}>
      <Text variant="h4">Something went wrong</Text>
      <Text variant="muted" style={styles.message}>
        {message}
      </Text>
      <Button onPress={resetErrorBoundary}>
        <Text>Try again</Text>
      </Button>
    </View>
  );
};

export default AppErrorFallback;

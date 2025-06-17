import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function EditScreenInfo({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return (
    <View className="mx-12 items-center">
      <View className="items-center">
        <Text className="text-center text-lg leading-6 text-foreground">{title}</Text>
        <View className="my-2 h-px w-4/5 bg-muted" />
        <Text className="text-foreground">{path}</Text>
      </View>
      <Text className="text-center text-lg leading-6 text-muted-foreground">{description}</Text>
    </View>
  );
}

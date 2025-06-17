import { View } from 'react-native';
import { Text } from '~/components/ui/text';

import EditScreenInfo from './EditScreenInfo';

export default function ScreenContent({
  title,
  path,
  description,
  children,
}: {
  title: string;
  path: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">{title}</Text>
      <View className="my-7 h-px w-4/5 bg-gray-200" />
      <EditScreenInfo path={path} title={title} description={description} />
      {children}
    </View>
  );
}

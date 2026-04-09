import { Tabs } from 'expo-router';
import { Camera, List } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0a7ea4',
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color }) => <Camera color={color} size={24} />,
          headerTitle: 'Escanear Remedios',
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Mis Códigos',
          tabBarIcon: ({ color }) => <List color={color} size={24} />,
          headerTitle: 'Códigos Guardados',
        }}
      />
    </Tabs>
  );
}
import { Stack } from 'expo-router';
import { CodesProvider } from '../constants/CodeContext';

export default function Layout() {
  return (
    <CodesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CodesProvider>
  );
}
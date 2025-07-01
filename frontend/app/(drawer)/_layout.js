// Configurazione del drawer laterale
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../src/navigation/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: '#64B5F6',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#777',
      }}
    />
  );
}

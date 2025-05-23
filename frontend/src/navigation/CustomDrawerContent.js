import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function CustomDrawerContent(props) {
  const { user, logout } = useContext(AuthContext);

  // fallback iniziali
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.username}>
          {user?.name || user?.email || 'Utente'}
        </Text>
      </View>

     <DrawerItem
        label="Dashboard"
        onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('(tabs)', { screen: 'home' });
        }}
        />

        <DrawerItem
        label="Portafoglio"
        onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('(tabs)', { screen: 'portfolio' });
        }}
      />

      <DrawerItem
        label="Impostazioni"
        onPress={() => props.navigation.navigate('settings')}
      />
      <DrawerItem
        label="Logout"
        onPress={logout}
        labelStyle={{ color: 'red' }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#1976D2',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#1976D2',
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
});

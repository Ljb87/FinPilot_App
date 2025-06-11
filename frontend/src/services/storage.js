import * as SecureStore from 'expo-secure-store';

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export async function saveToken(key, value) {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn('⚠️ localStorage non disponibile', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getToken(key) {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn('⚠️ localStorage non disponibile', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function deleteToken(key) {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn('⚠️ localStorage non disponibile', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

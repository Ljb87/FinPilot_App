// Wrapper per la gestione sicura dei token su web e mobile
import * as SecureStore from 'expo-secure-store';

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export async function saveToken(key, value) {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

  if (isWeb) {
    try {
      window.localStorage.setItem(key, stringValue);
    } catch (e) {
      console.warn('⚠️ localStorage non disponibile', e);
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, stringValue);
    } catch (e) {
      console.warn(`⚠️ Errore nel salvataggio SecureStore per "${key}"`, e);
    }
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
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn(`⚠️ Errore nel recupero SecureStore per "${key}"`, e);
      return null;
    }
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
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn(`⚠️ Errore nella cancellazione SecureStore per "${key}"`, e);
    }
  }
}

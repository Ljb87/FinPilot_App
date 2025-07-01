// Punto di ingresso: reindirizza l'utente alla pagina di login
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/login" />;
}

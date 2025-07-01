// Stili per la schermata di login
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // aggiunto per coerenza
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 15,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default styles;

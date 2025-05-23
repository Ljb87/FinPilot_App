import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1976D2', // Blu profondo
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#E3D5C5', // Beige sabbia
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 18,
    marginTop: 4,
    color: '#4CAF50', // Verde bosco
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 30,
  },
});

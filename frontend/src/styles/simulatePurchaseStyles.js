import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  asset: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: '#1976D2',
  },
});

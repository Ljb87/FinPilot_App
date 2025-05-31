import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  buttonColumn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#FFA000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  exploreButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1976D2',
    borderRadius: 8,
  },
  exploreText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;

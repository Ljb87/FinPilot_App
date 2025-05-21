import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 24,
  },
  assetContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendedBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
  },
  assetName: {
    fontSize: 16,
    marginBottom: 4,
  },
  assetPrice: {
    fontSize: 15,
    marginBottom: 4,
  },
  assetChange: {
    fontSize: 15,
    marginBottom: 4,
  },
  assetForecast: {
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

    buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonTextDisabled: {
    color: '#eee',
  },


});

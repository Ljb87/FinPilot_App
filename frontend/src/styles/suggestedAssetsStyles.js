// Stili per la schermata di suggerimenti AI
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 24,
  },
  assetContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assetSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assetName: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  infoTextLabel: {
    fontSize: 15,
    color: '#555',
  },
  infoTextValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },

  button: {
    backgroundColor: '#64B5F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonTextDisabled: {
    color: '#eee',
  },

  aiBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: 2,
  },
  aiBadgeText: {
    color: '#388E3C',
    fontSize: 12,
    fontWeight: '600',
  },
});

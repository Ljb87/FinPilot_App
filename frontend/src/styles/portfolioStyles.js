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
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    textAlign: 'center',
  },
  card: {
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
    backgroundColor: '#FFCA28',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#EF5350',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  exploreButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#64B5F6',
    borderRadius: 8,
  },
  exploreText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;

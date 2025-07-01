# FinPilot – Simulatore di Investimenti Finanziari con AI

FinPilot è un'app mobile sviluppata come progetto di tesi per simulare investimenti finanziari. L’utente può creare un portafoglio, acquistare asset in modalità simulata, ricevere suggerimenti da un Consulente AI e monitorare l’andamento nel tempo.  
Grazie all’integrazione con l’API `yFinance`, i dati sono aggiornati in tempo reale, offrendo un’esperienza fedele ai mercati reali.

## Tecnologie utilizzate

| Layer     | Tecnologie |
|-----------|------------|
| Frontend  | React Native (Expo) |
| Backend   | FastAPI (Python) |
| Database  | PostgreSQL |
| Librerie  | Axios, AsyncStorage, yfinance, react-native-chart-kit |
| Hosting   | Ambiente locale (Expo Go / Web + Uvicorn) |

## Funzionalità principali

- Registrazione e login utente
- Schermata di benvenuto con guida iniziale
- Consulente AI con suggerimenti in tempo reale
- Simulazione d’acquisto di asset
- Dashboard con grafici, performance e saldo
- Modifica/Vendita asset

## Installazione e avvio locale

### 1. Clona il progetto

```bash
git clone https://github.com/Ljb87/FinPilot_App.git
cd FinPilot_App
```

### 2. Backend – FastAPI

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Crea file `.env`

Nel file `backend/.env` inserire:

```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/finpilot_db
```

Sostituire `<password>` con la password dell’utente PostgreSQL.

#### Crea il database

```sql
psql -U postgres
CREATE DATABASE finpilot_db;
```

Le tabelle vengono create automaticamente al primo avvio grazie a SQLAlchemy.

#### Avvio del backend su rete locale (necessario per Expo Go)

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Documentazione API interattiva: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend – Expo (React Native)

```bash
cd ../frontend
npm install
```

#### Modifica `services/api.js`

Aggiornare `API_URL` con l’**IP locale del proprio computer** (es. `192.168.1.64`):

```js
const API_URL = 'http://192.168.1.64:8000';
```

È possibile trovare l’IP locale tramite `ipconfig` (Windows) o `ifconfig` (Mac/Linux).

### 4. Avvio Expo

```bash
npx expo start
```

- Scansionare il QR code con l’app Expo Go per test su smartphone
- Premere:
  - `i` per simulatore iOS
  - `a` per simulatore Android
  - `w` per testare da browser

## Testing

1. Avviare il backend con:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. Avviare il frontend con:

```bash
cd frontend
npx expo start
```

3. Collegarsi da:

- Browser (modalità Web)
- Smartphone tramite Expo Go

4. Testare le funzionalità principali:

> **Nota:** per testare rapidamente il comportamento dell’app con dati già presenti, è possibile accedere con l’utente:
>
> - **Email**: paolo@paolo.com  
> - **Password**: paolo123
>
> Questo utente ha già un portafoglio simulato popolato, utile per visualizzare asset acquistati e performance nel tempo.

   - Registrazione
   - Schermata Welcome
   - Simulazione acquisto
   - Suggerimenti AI
   - Modifica e vendita asset
   - Dashboard con statistiche

## Stato

Versione stabile testata su:
- iPhone (Expo Go)
- Browser (Web)
- Backend FastAPI su host 0.0.0.0

## Licenza

Uso didattico – progetto di tesi

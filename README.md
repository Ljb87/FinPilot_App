## FinPilot – Simulatore di Investimenti Finanziari con AI

FinPilot è un’applicazione mobile sviluppata come progetto di tesi per simulare investimenti finanziari. L’utente può creare un portafoglio, acquistare asset in modalità simulata, ricevere suggerimenti da un Consulente AI e monitorare l’andamento nel tempo. Tutti i dati sono aggiornati in tempo reale tramite l’API yFinance, rendendo l’esperienza vicina alla realtà.

## Tecnologie utilizzate

- **Frontend:** React Native (con Expo)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Librerie:** Axios, AsyncStorage, react-native-chart-kit, yfinance
- **Hosting sviluppo:** ambiente locale

## Funzionalità principali

- Registrazione e login utente
- Dashboard personalizzata con grafici
- Simulazione d'acquisto di asset finanziari
- Suggerimenti AI basati su analisi reali via yFinance
- Calcolo automatico della performance e del saldo
- Schermata di benvenuto e guida al primo utilizzo

## Installazione e test locale

Per testare l’app sul proprio dispositivo o emulatore:

## 1. Clona il progetto

git clone https://github.com/Ljb87/FinPilot_App.git
cd FinPilot_App


## 2. Backend – FastAPI


cd backend
python -m venv venv
source venv/bin/activate        # Su Windows: venv\Scripts\activate
pip install -r requirements.txt

## Configura il file .env:

Crea un file chiamato .env nella cartella backend con il seguente contenuto:

DATABASE_URL=postgresql://postgres:password@localhost:5432/finpilot_db
Sostituisci password con la password effettiva del tuo utente PostgreSQL.

## Come creare il database PostgreSQL

Se PostgreSQL è già installato, puoi creare il database in questo modo:

psql -U postgres
CREATE DATABASE finpilot_db;

Nota: non è necessario creare manualmente le tabelle.
Il backend genera automaticamente la struttura del database al primo avvio, grazie a SQLAlchemy.

## Avvia il backend:

uvicorn app.main:app --reload
Accedi alla documentazione interattiva:
http://localhost:8000/docs


## 3. Frontend – Expo (React Native)
cd ../frontend
npm install

## Aggiorna l’endpoint in services/api.js:

const API_URL = 'http://<IP_LOCALE_DEL_PC>:8000';
Puoi trovare il tuo IP locale con ipconfig o ifconfig.

## Avvia Expo:

npx expo start
Scansiona il QR code con l’app Expo Go sul telefono
oppure premi i (iOS) o a (Android) per emulatori.



## Test funzionale

Tutte le funzionalità sono testabili localmente.
Puoi verificare:

Registrazione/Login
Onboarding iniziale
Simulazione acquisto
Suggerimenti AI
Dashboard con statistiche
Performance e saldo aggiornato

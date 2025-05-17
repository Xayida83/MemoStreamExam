# MemoStream

MemoStream är en applikation för att hantera och automatisera e-postkommunikation med kunder.



## Funktioner (Sprint 1)

- ✅ Automatisk hämtning av e-post från Gmail
- ✅ Bearbetning av e-postmeddelanden och deras bilagor
- ✅ Lagring av e-post och bilagor i Firebase
- ✅ Kategorisering av e-post baserat på avsändaradress
- ✅ Sökbar historik över e-postkommunikation
- ✅ Automatisk filtrering av tekniska e-postheaders

## Installation

1. Klona repot
2. Installera beroenden:
   ```bash
   npm install
   ```
3. Skapa en `.env`-fil med följande variabler:
   ```
   PORT=5000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   GMAIL_CLIENT_ID=your-gmail-client-id
   GMAIL_CLIENT_SECRET=your-gmail-client-secret
   GMAIL_REDIRECT_URI=http://localhost:5000/api/auth/gmail/callback
   RECEIVING_EMAIL=your-receiving-email@gmail.com
   ```

## Starta applikationen

1. Starta servern:
   ```bash
   npm run server
   ```
2. Öppna webbläsaren och gå till:
   ```
   http://localhost:5000/api/auth/gmail
   ```
3. Följ autentiseringsprocessen för Gmail

## Filhantering

Bilagor från e-postmeddelanden sparas i Firebase Storage och är tillgängliga via unika URL:er.

### Hur filer sparas
- Alla filer sparas i Firebase Storage
- Filnamnen genereras automatiskt med formatet: `[timestamp]-[originalfilnamn].[extension]`
- Filer är tillgängliga via unika Firebase Storage URL:er

### Stödda filformat
- Bilder: JPEG, PNG, GIF, WebP
- Ljud: MP3, WAV, OGG, M4A
- Video: MP4, MOV, AVI, WebM

## Kundhantering

Kunder skapas med följande information:
- Kundnamn
- Tillåtna e-postadresser
- Inställningar för bilagor och notifieringar

Kunder identifieras automatiskt baserat på avsändaradress.

## Utveckling

### Starta utvecklingsservern
```bash
npm run dev
```

### Bygga för produktion
```bash
npm run build
```

### Skapa ny kund
```bash
npm run create-customer
```

## Teknisk information

### Media-bearbetning
- Bilder optimeras till max 1200px bredd/höjd
- Ljudfiler konverteras till MP3 med 128kbps
- Videor konverteras till MP4 med max 30 sekunders längd och 720p upplösning

### E-postbearbetning
- Tekniska headers filtreras bort automatiskt
- E-postinnehåll extraheras och sparas i databasen
- Bilagor bearbetas och sparas i Firebase Storage

## Licens

MIT 
# Supabase Setup

## Einrichtung

1. Erstelle ein kostenloses Konto auf [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Gehe zu **SQL Editor** und führe `schema.sql` aus
4. Optional: Führe `seed.sql` für Testdaten aus
5. Gehe zu **Project Settings → API** und kopiere:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Trage diese Werte in `.env.local` ein

## Admin-Account erstellen

1. Gehe zu **Authentication → Users**
2. Klicke auf **Add User**
3. Trage deine E-Mail und ein sicheres Passwort ein
4. Dieser Account hat Admin-Rechte (Schreibzugriff)

## Freigabe-Links

Gäste erhalten Lesezugriff über einen Einladungscode.
Der Code wird in der App unter "Teilen" generiert.

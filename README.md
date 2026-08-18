# 📅 Stundenplan

> Eine moderne, webbasierte Stundenplan-App für die Schule – übersichtlich, schnell und mobil optimiert.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)

🌐 **Live:** [flo-stundenplan.vercel.app](https://flo-stundenplan.vercel.app) &nbsp;·&nbsp; 💻 **GitHub:** [dmimts/flo-stundenplan](https://github.com/dmimts/flo-stundenplan)

---

## ✨ Features

### 📊 Stundenraster
- WebUntis-ähnliches Raster mit **6-Tage-Woche** (Mo–Sa)
- **Individuelle Stundenzeiten** – Beginn und Ende frei einstellbar
- **Unbegrenzte Wochennavigation** – beliebig vor und zurück blättern
- Jede Woche **individuell belegbar**

### 🕐 Live & Ansicht
- **Echtzeit-Zeitbalken** zeigt die aktuelle Uhrzeit (gecappt bei 18:00 Uhr)
- **Aktueller Tag** wird farblich hervorgehoben
- **Dark / Light Mode** – automatisch oder manuell umschaltbar
- Vollständig auf **Deutsch** – responsive für **Mobile & Desktop**

### 🔐 Admin & Teilen
- **Admin-Login** via Supabase Auth zum Bearbeiten des Stundenplans
- Stunden **hinzufügen, bearbeiten, löschen** oder als **entfällt** markieren
- **Teilen** per QR-Code oder Einladungscode (Read-Only für Gäste)

---

## 🗂️ Projektstruktur

```
flo-stundenplan/
├── src/
│   ├── app/          # Next.js App Router – Pages & Layouts
│   ├── components/   # React-Komponenten (TimetableGrid, LessonCard, WeekNav …)
│   ├── lib/          # Supabase Client, Auth, Datenzugriff
│   └── types/        # TypeScript-Typdefinitionen
└── supabase/
    └── schema.sql    # Datenbankschema & Seed-Daten
```

---

## 🚀 Lokale Einrichtung

**Voraussetzungen:** Node.js ≥ 18, ein [Supabase-Konto](https://supabase.com)

1. **Repository klonen**
   ```bash
   git clone https://github.com/dmimts/flo-stundenplan.git
   cd flo-stundenplan
   ```

2. **Supabase-Projekt anlegen** auf [supabase.com](https://supabase.com) und das Schema einspielen:
   ```sql
   -- Im Supabase SQL Editor ausführen:
   -- supabase/schema.sql
   ```

3. **Umgebungsvariablen** setzen – `.env.local` im Projektroot anlegen:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<dein-projekt>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<dein-anon-key>
   ```

4. **Abhängigkeiten installieren & starten**
   ```bash
   npm install
   npm run dev
   ```

   Die App ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## ☁️ Deployment

Das Deployment läuft vollautomatisch über **Vercel** – jeder Push auf den `main`-Branch löst einen neuen Build aus.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dmimts/flo-stundenplan)

---

## 🛠️ Tech Stack

| Technologie | Verwendung |
|---|---|
| [Next.js 16](https://nextjs.org) | Framework, App Router, SSR |
| [TypeScript](https://www.typescriptlang.org) | Typsicherheit |
| [Tailwind CSS v3](https://tailwindcss.com) | Styling & Dark Mode |
| [Supabase](https://supabase.com) | Auth, PostgreSQL-Datenbank |
| [Vercel](https://vercel.com) | Hosting & Deployment |

---

<p align="center">Made with ❤️ for school life</p>

# Huskesedler

En full-stack huskeseddel-applikation udviklet som et portfolio-projekt med fokus på moderne frontend, REST API og databaseintegration.

Applikationen gør det muligt at oprette, organisere, søge i og slette huskesedler fordelt på forskellige kategorier.

## Funktioner

* Oprette huskesedler
* Organisere huskesedler efter kategori
* Søge i huskesedler
* Markere flere huskesedler
* Slette valgte huskesedler
* Dashboard med statistik
* Kategorier som fx:

  * Indkøb
  * Arbejde
  * Studie
  * Rejse
  * Rengøring
  * Børn
  * Økonomi
  * Projekter
  * Personlige mål

## Teknologier

### Frontend

* Angular
* TypeScript
* HTML
* CSS
* Angular Signals
* Angular Forms

### Backend

* Python
* FastAPI
* REST API
* Pydantic

### Database

* SQLite

### Udviklingsværktøjer

* Git
* GitHub
* Visual Studio Code

## Arkitektur

Projektet er opdelt i en frontend og en backend:

```text
Angular frontend
       │
       │ HTTP / REST API
       ▼
FastAPI backend
       │
       ▼
SQLite database
```

Angular-applikationen håndterer brugergrænsefladen og brugerinteraktionen.

FastAPI fungerer som backend og eksponerer REST endpoints til oprettelse, hentning og sletning af huskesedler.

SQLite bruges til permanent lagring af data.

## API endpoints

### Hent huskesedler

```http
GET /items
```

Returnerer alle huskesedler.

### Opret huskeseddel

```http
POST /items
```

Eksempel på request:

```json
{
  "name": "Læs Angular",
  "category": "Studie"
}
```

### Slet huskeseddel

```http
DELETE /items/{id}
```

Sletter en huskeseddel ud fra dens ID.

## Kør projektet lokalt

### 1. Clone repository

```bash
git clone <repository-url>
cd Python-Project
```

### 2. Start backend

Gå til Python-projektet:

```bash
cd python_project
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload
```

Backend kører herefter på:

```text
http://localhost:8000
```

### 3. Start frontend

Åbn en ny terminal og gå til Angular-projektet:

```bash
cd angular
```

Installer dependencies:

```bash
npm install
```

Start Angular:

```bash
ng serve
```

Frontend kan herefter åbnes på:

```text
http://localhost:4200
```

## Projektstruktur

```text
Python-Project/
│
├── angular/
│   └── src/
│       └── app/
│           ├── items/
│           │   ├── items.ts
│           │   ├── items.html
│           │   └── items.css
│           │
│           └── ...
│
├── python_project/
│   ├── main.py
│   ├── db.py
│   └── database.db
│
└── README.md
```

## Fokusområder

Projektet er udviklet med fokus på:

* Full-stack udvikling
* REST API'er
* Frontend-komponenter
* State management med Angular Signals
* Databaseintegration
* CRUD-operationer
* Søgning og filtrering
* UI/UX
* Separation mellem frontend og backend

## Status

Projektet er under udvikling.

Planlagte forbedringer inkluderer blandt andet:

* Kategori-badges
* Task cards
* Empty states
* Angular animations
* Dark mode
* Forbedret responsive design
* Redigering af huskesedler
* Yderligere UI/UX-forbedringer

# LearnLingo

SPA for an online language school: browse tutors, filter them, book a trial lesson, and save favorites after sign-in.

## Stack

- React + TypeScript
- Vite
- React Router
- react-hook-form + Yup
- Firebase Authentication and Realtime Database via REST API

## Links

- Design: [Figma](https://www.figma.com/file/dewf5jVviSTuWMMyU3d8Mc/%D0%9F%D0%B5%D1%82-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82-%D0%B4%D0%BB%D1%8F-%D0%9A%D0%A6?type=design&node-id=0-1&mode=design)
- Spec PDF: `../ТЗ`
- Seed data: [teachers.json](https://drive.google.com/file/d/121ufnYEerBdPopSSVw0W7iUJWT-4Zcfu/view?usp=sharing)
- Ready import file for Realtime Database: [`data/teachers-import.json`](./data/teachers-import.json)

## Features

- Home page with company benefits and a link to Teachers
- Teachers page with pagination (`Load more`, 4 cards per request)
- Filters by language, level, and price
- Teacher card: Read more, Book trial lesson, favorites heart
- Auth modals: registration and login
- Private Favorites page for authorized users
- Favorites stored in Firebase at `users/{uid}/favorites`

## Firebase setup

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project.
2. **Build → Authentication → Sign-in method** → enable **Email/Password**.
3. **Build → Realtime Database → Create Database**.
   Use Realtime Database, not Cloud Firestore.
4. Open the **Rules** tab and publish:

```json
{
  "rules": {
    "teachers": {
      ".read": true,
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

5. Open the **Data** tab → menu (⋯) → **Import JSON**.
   Select `data/teachers-import.json` from this repository.
   After import you should see a `teachers` node with keys `0`…`29`.
6. Copy the **database URL** from the Data page header.
7. Project settings (gear) → **Your apps** → add a **Web** app.
   Copy `apiKey` from the generated config.

## Local environment

1. Copy env example:

```bash
cp .env.example .env
```

2. Fill values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.region.firebasedatabase.app
```

Do not commit `.env`.

3. Install and run:

```bash
npm install
npm run dev
```

4. Production build:

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Publish the production build to the `gh-pages` branch:

```bash
npm run deploy
```

Then in GitHub: **Settings → Pages → Build and deployment**

- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**

Site: https://volodymyr-but2025.github.io/LearnLingo-pet/

`vite.config.ts` uses `base: '/LearnLingo-pet/'` for this project URL.  
Firebase keys are taken from your local `.env` at build time (do not commit `.env`).

## Project structure

```text
src/
  components/   UI pieces and modals
  context/      Auth and favorites state
  pages/        Home, Teachers, Favorites
  services/     Firebase REST clients
  validation/   Yup schemas
  types/        Shared TypeScript types
data/
  teachers-import.json
```

# Grocery List PoC

React Native + Expo proof of concept for grocery management.

## What is implemented

- View grocery list
- Add new grocery item
- Edit existing item
- Delete item with confirmation
- Add amount for each item
- Mark item as bought (checkbox + crossed out title)
- Optimistic update for bought toggle (with rollback on error)
- Pull-to-refresh on the list
- Loading, error, and suspense states
- JSON-server API mock + TanStack React Query integration

## Tech stack

- Expo Router
- TypeScript
- TanStack React Query
- Axios
- JSON Server
- Formik + Yup
- React Native Reusables (NativeWind UI components)

## How to run

### 1) Install dependencies

```bash
npm install
```

### 2) Start mock API (Terminal 1)

```bash
npm run api
```

Runs JSON Server on `http://localhost:3001` with data from [`db.json`](./db.json).

### 3) Start app (Terminal 2)

```bash
npx expo start
```

Then open app in Expo Go / simulator / web.

For web only:

```bash
npm run web
```

## API URL notes

By default:

- Web: `http://localhost:3001`
- Android emulator: `http://10.0.2.2:3001`
- iOS simulator: `http://127.0.0.1:3001`

You can override with `EXPO_PUBLIC_API_URL` (see [`.env.example`](./.env.example)).

## Seed data

- `db.json` currently contains **50 grocery items** for list/performance testing.

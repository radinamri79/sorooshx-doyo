# Frontend — Next.js 15 PWA

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 3.4
- Zustand 5 (state management)
- Lucide React (icons)

## Setup (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── (app)/         # Authenticated routes
│   │   ├── chat/      # AI chat
│   │   ├── messages/  # Conversations
│   │   ├── orders/    # Order management
│   │   ├── profile/   # User profile
│   │   └── providers/ # Provider browsing
│   ├── auth/          # Login & register
│   └── page.tsx       # Landing page
├── components/
│   ├── layout/        # AppShell
│   └── ui/            # Button, Input, Spinner
├── hooks/             # useWebSocket
├── lib/               # API client, utils
├── stores/            # Zustand (auth, notifications)
└── types/             # TypeScript interfaces
```

## Key Features

- JWT auth with auto-refresh
- WebSocket hook with auto-reconnect
- Real-time notifications with badge
- PWA manifest for mobile install
- Bottom navigation (mobile-first)

## Build

```bash
npm run build
```

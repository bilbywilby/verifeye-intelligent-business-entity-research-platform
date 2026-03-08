# Cloudflare Workers Chat Demo

[![[cloudflarebutton]]](https://deploy.workers.cloudflare.com)

A modern, full-stack chat application built on Cloudflare Workers. This template demonstrates a production-ready setup with a React frontend, Hono-powered API backend, and Durable Objects for scalable, stateful storage. Manage users, create chat boards, and exchange messages in real-time—all serverless.

## ✨ Key Features

- **Full-Stack TypeScript**: End-to-end type safety with shared types between frontend and worker.
- **Durable Objects**: Per-user and per-chat storage with automatic indexing and pagination.
- **Real-Time Chat**: Send and list messages within chat boards.
- **Modern UI**: Responsive design with Shadcn/UI, Tailwind CSS, and Framer Motion animations.
- **API-First**: RESTful endpoints for CRUD operations on users and chats.
- **Query Management**: TanStack Query for optimistic updates and caching.
- **Error Handling**: Global error boundaries and client error reporting.
- **Theme Support**: Light/dark mode with persistence.
- **Production-Ready**: CORS, logging, health checks, and Cloudflare deployment.

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects |
| **Frontend** | React 18, Vite, TypeScript, TanStack Query |
| **UI/UX** | Shadcn/UI, Tailwind CSS, Lucide Icons, Sonner (Toasts) |
| **State** | Zustand (optional), Immer |
| **Utils** | Zod (validation), Class Variance Authority, React Hook Form |
| **Dev Tools** | Bun, ESLint, Wrangler, Vitest |

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install/)
- Cloudflare account (free tier sufficient)

### Installation
```bash
bun install
```

### Local Development
```bash
# Generate types from worker
bun cf-typegen

# Start dev server (frontend + worker proxy)
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or `PORT=8080 bun dev`).

### Build for Production
```bash
bun build
```

## 📖 Usage

### API Endpoints
All routes under `/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List users (supports `?cursor` & `?limit`) |
| `POST` | `/api/users` | Create user `{ name: string }` |
| `DELETE` | `/api/users/:id` | Delete user |
| `POST` | `/api/users/deleteMany` | Bulk delete `{ ids: string[] }` |
| `GET` | `/api/chats` | List chats (supports `?cursor` & `?limit`) |
| `POST` | `/api/chats` | Create chat `{ title: string }` |
| `DELETE` | `/api/chats/:id` | Delete chat |
| `POST` | `/api/chats/deleteMany` | Bulk delete `{ ids: string[] }` |
| `GET` | `/api/chats/:chatId/messages` | List messages |
| `POST` | `/api/chats/:chatId/messages` | Send `{ userId: string, text: string }` |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/client-errors` | Report frontend errors |

Example with `curl`:
```bash
# List users
curl http://localhost:3000/api/users

# Create chat
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'
```

### Frontend Customization
- Replace `src/pages/HomePage.tsx` with your app.
- Add routes in `src/main.tsx`.
- Use `src/lib/api-client.ts` for type-safe API calls.
- Extend entities in `worker/entities.ts`.
- Add routes in `worker/user-routes.ts`.

## 🔧 Development Workflow

- **Hot Reload**: `bun dev` proxies API calls to worker.
- **Type Generation**: Run `bun cf-typegen` after worker changes.
- **Linting**: `bun lint`
- **Preview**: `bun preview`
- **Seeds**: Demo data auto-seeds on first `/api/users` or `/api/chats` call.

**File Structure**:
```
├── src/              # React app
├── worker/           # Hono API + Durable Objects
├── shared/           # Shared types
└── wrangler.jsonc    # Cloudflare config
```

**Do Not Modify**:
- `worker/core-utils.ts`, `worker/index.ts` (core DO logic).
- Use `worker/entities.ts` and `worker/user-routes.ts` instead.

## ☁️ Deployment

Deploy to Cloudflare Pages + Workers in one command:

```bash
bun run deploy
```

Or manually:
1. `bun build`
2. `wrangler deploy`

**Custom Domain**: Update `wrangler.jsonc` and run `wrangler deploy`.

**[cloudflarebutton]**

### Durable Objects Migration
First deploy creates SQLite DO migration automatically.

## 🤝 Contributing

1. Fork & clone.
2. `bun install`
3. `bun dev`
4. Submit PR.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Docs](https://hono.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)

Built with ❤️ for Cloudflare Developers.
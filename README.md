# ADM

This is the Repository for the unified backend and frontend for the ADM Project.

## Conventions

Branch naming convention: `kn-<feature-name>` with author name initials at the beginning.

Branch Example: `kn-feature-name-example`

## Tech-Stack

- NodeJs [Javascript runtime]
- SvelteKit [Full-Stack Framework]
- Svelte [Frontend Framework]
- Prisma [ORM]
- PostgreSQL [Database]
- TailwindCSS [CSS Framework]
- HeadlessUI [Behavior Framework]
- GitHub Actions [CI/CD]
- Capacitor [Mobile App Framework]
- Electron [Desktiop App Framework]

## Getting Started

### Prerequisites

- Nodejs
- NPM
- Git
- Docker Engine

### Development

### Commands

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Docker

To create a full local environment, use the docker compose to create all services localy and the production application:

```bash
docker-compose up
```

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
